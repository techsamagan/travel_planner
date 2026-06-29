import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import Database from "better-sqlite3";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "wanderwise.db");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* -------------------------------------------------------------------------- */
/*  SQLite database (better-sqlite3 — synchronous, single file, no daemon)    */
/* -------------------------------------------------------------------------- */

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL"); // better concurrency + durability
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL,
    passwordHash  TEXT NOT NULL,
    createdAt     TEXT NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (lower(email));

  CREATE TABLE IF NOT EXISTS trips (
    id         TEXT PRIMARY KEY,
    userId     TEXT NOT NULL,
    title      TEXT NOT NULL,
    params     TEXT NOT NULL,   -- JSON
    itinerary  TEXT NOT NULL,   -- JSON
    createdAt  TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_trips_user ON trips (userId, createdAt DESC);
`);

// Prepared statements (compiled once, reused per request).
const stmts = {
  userByEmail: sqlite.prepare("SELECT * FROM users WHERE lower(email) = lower(?)"),
  userById: sqlite.prepare("SELECT * FROM users WHERE id = ?"),
  insertUser: sqlite.prepare(
    "INSERT INTO users (id, name, email, passwordHash, createdAt) VALUES (@id, @name, @email, @passwordHash, @createdAt)"
  ),
  insertTrip: sqlite.prepare(
    "INSERT INTO trips (id, userId, title, params, itinerary, createdAt) VALUES (@id, @userId, @title, @params, @itinerary, @createdAt)"
  ),
  tripsByUser: sqlite.prepare(
    "SELECT id, title, params, createdAt FROM trips WHERE userId = ? ORDER BY createdAt DESC"
  ),
};

function getUserByEmail(email) {
  return stmts.userByEmail.get(String(email));
}
function getUserById(id) {
  return stmts.userById.get(id);
}
function createUser(user) {
  stmts.insertUser.run(user);
}
function createTrip(trip) {
  stmts.insertTrip.run({
    id: trip.id,
    userId: trip.userId,
    title: trip.itinerary.tripTitle,
    params: JSON.stringify(trip.params),
    itinerary: JSON.stringify(trip.itinerary),
    createdAt: trip.createdAt,
  });
}
function getTripsByUser(userId) {
  return stmts.tripsByUser.all(userId).map((row) => ({
    id: row.id,
    title: row.title,
    params: JSON.parse(row.params),
    createdAt: row.createdAt,
  }));
}

/* -------------------------------------------------------------------------- */
/*  Auth helpers                                                              */
/* -------------------------------------------------------------------------- */

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication required." });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------------------- */
/*  Auth routes                                                               */
/* -------------------------------------------------------------------------- */

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are all required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const exists = getUserByEmail(email);
  if (exists) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  createUser(user);

  const token = signToken(user);
  return res.status(201).json({ token, user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(user);
  return res.json({ token, user: publicUser(user) });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ user: publicUser(user) });
});

/* -------------------------------------------------------------------------- */
/*  Itinerary generation                                                      */
/* -------------------------------------------------------------------------- */

const TRAVEL_STYLES = ["Adventure", "Cultural", "Relaxing", "Foodie", "Budget", "Luxury"];
const COMPANION_TYPES = ["Solo", "Couple", "Family", "Friends"];

function buildSystemPrompt() {
  return `You are an expert travel planner and local-guide concierge. You design
detailed, realistic, and delightful day-by-day itineraries tailored to the traveler's
destination, trip length, travel style, and companions.

You MUST respond with a SINGLE, valid JSON object and nothing else — no markdown, no
code fences, no commentary before or after. The JSON MUST match this EXACT schema and
key names:

{
  "tripTitle": "String",
  "summary": "String",
  "budgetEstimation": { "food": 0, "activities": 0, "stay": 0, "total": 0 },
  "days": [
    {
      "dayNumber": 1,
      "theme": "String",
      "activities": [
        { "time": "Morning/Afternoon/Evening", "title": "String", "description": "String", "cost": 0 }
      ]
    }
  ],
  "packingList": ["String"]
}

Rules:
- "budgetEstimation" values are whole-number USD estimates for the WHOLE trip. "total"
  MUST equal food + activities + stay.
- Provide exactly one object in "days" for each day of the trip, with sequential
  "dayNumber" starting at 1.
- Each day MUST include at least three activities covering "Morning", "Afternoon", and
  "Evening" (use exactly those words for "time").
- "cost" is a per-activity whole-number USD estimate (use 0 for free activities).
- Tailor activity choices, pacing, and tone to the requested travel style and companions.
- "packingList" should contain 8–14 concise, destination-appropriate items.
- Keep descriptions vivid but concise (1–2 sentences).`;
}

function buildUserPrompt({ destination, days, travelStyle, companion, startDate, endDate }) {
  const dateLine =
    startDate && endDate ? `Dates: ${startDate} to ${endDate}.` : `Trip length: ${days} days.`;
  return `Plan a trip with these parameters:
Destination: ${destination}
${dateLine}
Number of days: ${days}
Travel style / vibe: ${travelStyle}
Traveling as: ${companion}

Return ONLY the JSON object described in the system prompt.`;
}

// Extract the first balanced JSON object from arbitrary model text.
function extractJSON(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

// Normalize / repair an itinerary object so the frontend always gets clean data.
function normalizeItinerary(raw, ctx) {
  const safe = raw && typeof raw === "object" ? raw : {};
  const days = Array.isArray(safe.days) ? safe.days : [];

  const normalizedDays = days.map((d, idx) => {
    const activities = Array.isArray(d?.activities) ? d.activities : [];
    return {
      dayNumber: Number(d?.dayNumber) || idx + 1,
      theme: String(d?.theme || `Day ${idx + 1}`),
      activities: activities.map((a) => ({
        time: ["Morning", "Afternoon", "Evening"].includes(a?.time) ? a.time : "Morning",
        title: String(a?.title || "Explore"),
        description: String(a?.description || ""),
        cost: Math.max(0, Math.round(Number(a?.cost) || 0)),
      })),
    };
  });

  const be = safe.budgetEstimation || {};
  const food = Math.max(0, Math.round(Number(be.food) || 0));
  const activities = Math.max(0, Math.round(Number(be.activities) || 0));
  const stay = Math.max(0, Math.round(Number(be.stay) || 0));

  return {
    tripTitle: String(safe.tripTitle || `${ctx.destination} Adventure`),
    summary: String(safe.summary || `A ${ctx.days}-day ${ctx.travelStyle} trip to ${ctx.destination}.`),
    budgetEstimation: { food, activities, stay, total: food + activities + stay },
    days: normalizedDays.length ? normalizedDays : buildMockItinerary(ctx).days,
    packingList: Array.isArray(safe.packingList) && safe.packingList.length
      ? safe.packingList.map(String)
      : buildMockItinerary(ctx).packingList,
  };
}

/* ---- Deterministic mock generator (used when no API key is configured) ---- */

function buildMockItinerary(ctx) {
  const { destination, days, travelStyle, companion } = ctx;

  const styleThemes = {
    Adventure: ["Arrival & First Trails", "Summit & Adrenaline", "Water & Wild", "Hidden Valleys", "Sunrise Peaks"],
    Cultural: ["Old Town & History", "Museums & Masters", "Local Rituals", "Architecture Walk", "Markets & Makers"],
    Relaxing: ["Slow Arrival", "Spa & Stillness", "Coastal Calm", "Gardens & Tea", "Unhurried Wanders"],
    Foodie: ["Tasting the City", "Markets & Street Eats", "Chef's Table", "Wine & Vines", "Sweet Finale"],
    Budget: ["Free City Highlights", "Parks & Viewpoints", "Local Eats", "Walking the Districts", "Sunset for Free"],
    Luxury: ["Grand Arrival", "Private Tours", "Fine Dining", "Yacht & Skyline", "Bespoke Farewell"],
  };
  const themes = styleThemes[travelStyle] || styleThemes.Cultural;

  const morning = {
    Adventure: ["Guided trail hike", "Mountain biking", "Kayak the bay", "Via ferrata climb"],
    Cultural: ["Historic old-town walk", "Grand museum visit", "Cathedral & cloisters", "Heritage quarter tour"],
    Relaxing: ["Slow breakfast & stroll", "Morning yoga by the water", "Botanical gardens", "Quiet café morning"],
    Foodie: ["Local market breakfast", "Pastry & coffee crawl", "Cooking class", "Farmers market tasting"],
    Budget: ["Free walking tour", "City park & viewpoint", "Self-guided landmark walk", "Public garden visit"],
    Luxury: ["Private city tour", "Helicopter scenic flight", "Curated gallery visit", "Champagne breakfast"],
  };
  const afternoon = {
    Adventure: ["Canyon zipline", "Cave exploration", "White-water rafting", "Cliffside scramble"],
    Cultural: ["Artisan workshops", "Royal palace tour", "Local history museum", "Temple district"],
    Relaxing: ["Spa & thermal baths", "Beach lounging", "Lakeside picnic", "Afternoon tea"],
    Foodie: ["Street-food district", "Vineyard & cheese tasting", "Hidden-gem lunch", "Chocolate atelier"],
    Budget: ["Free museum afternoon", "Riverside walk", "Street art tour", "Local neighborhood explore"],
    Luxury: ["Private yacht cruise", "Designer shopping", "Spa & wellness suite", "Exclusive tasting menu"],
  };
  const evening = {
    Adventure: ["Campfire & stargazing", "Night kayak", "Sunset summit", "Bonfire by the shore"],
    Cultural: ["Live folk performance", "Evening lantern walk", "Opera or theatre", "Rooftop city lights"],
    Relaxing: ["Sunset dinner", "Quiet wine on the terrace", "Moonlit beach walk", "Hot-spring soak"],
    Foodie: ["Chef's tasting menu", "Night market feast", "Wine bar hopping", "Dessert & jazz"],
    Budget: ["Sunset at a free viewpoint", "Local food stalls", "Live music in the square", "Night market browse"],
    Luxury: ["Michelin-star dinner", "Private rooftop cocktails", "VIP lounge & live jazz", "Skyline fine dining"],
  };

  const pick = (arr, i) => arr[i % arr.length];

  const baseCosts = {
    Budget: { food: 25, act: 15, stay: 45 },
    Adventure: { food: 40, act: 55, stay: 90 },
    Cultural: { food: 45, act: 35, stay: 110 },
    Foodie: { food: 80, act: 30, stay: 120 },
    Relaxing: { food: 55, act: 40, stay: 140 },
    Luxury: { food: 160, act: 120, stay: 380 },
  };
  const c = baseCosts[travelStyle] || baseCosts.Cultural;

  const daysArr = Array.from({ length: days }, (_, i) => {
    const dayNumber = i + 1;
    return {
      dayNumber,
      theme: pick(themes, i),
      activities: [
        {
          time: "Morning",
          title: pick(morning[travelStyle] || morning.Cultural, i),
          description: `Start day ${dayNumber} in ${destination} with a ${travelStyle.toLowerCase()} highlight, well-paced for ${companion.toLowerCase()} travelers.`,
          cost: Math.round(c.act * 0.4),
        },
        {
          time: "Afternoon",
          title: pick(afternoon[travelStyle] || afternoon.Cultural, i),
          description: `An immersive afternoon experience capturing the essence of ${destination}.`,
          cost: Math.round(c.act * 0.6),
        },
        {
          time: "Evening",
          title: pick(evening[travelStyle] || evening.Cultural, i),
          description: `Wind down with an unforgettable evening, perfect for ${companion.toLowerCase()} travel.`,
          cost: Math.round(c.food),
        },
      ],
    };
  });

  const food = c.food * days;
  const activities = c.act * days;
  const stay = c.stay * days;

  const packingByStyle = {
    Adventure: ["Hiking boots", "Daypack", "Reusable water bottle", "Quick-dry clothing", "Headlamp"],
    Cultural: ["Comfortable walking shoes", "Modest layers for sites", "Portable charger", "Phrasebook"],
    Relaxing: ["Swimwear", "Light linen outfits", "Sun hat", "A good book"],
    Foodie: ["Stretchy comfortable clothing", "Antacids", "Restaurant-list notes", "Reusable cutlery"],
    Budget: ["Refillable water bottle", "Reusable tote", "Comfortable shoes", "Snacks"],
    Luxury: ["Smart-casual evening wear", "Sunglasses", "Quality camera", "Spa-day essentials"],
  };

  const packingList = [
    "Passport & travel documents",
    "Universal power adapter",
    "Weather-appropriate clothing",
    "Toiletries & medications",
    ...(packingByStyle[travelStyle] || packingByStyle.Cultural),
    "Phone & charger",
    "Travel insurance details",
  ];

  return {
    tripTitle: `${days}-Day ${travelStyle} Escape to ${destination}`,
    summary: `A thoughtfully crafted ${days}-day ${travelStyle.toLowerCase()} journey through ${destination}, tailored for ${companion.toLowerCase()} travel — balancing iconic highlights with local, authentic moments.`,
    budgetEstimation: { food, activities, stay, total: food + activities + stay },
    days: daysArr,
    packingList: [...new Set(packingList)],
  };
}

async function generateWithAI(ctx) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(ctx) }],
  });
  const text = (message.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  const parsed = extractJSON(text);
  if (!parsed) throw new Error("AI response could not be parsed as JSON.");
  return parsed;
}

app.post("/api/generate-itinerary", authMiddleware, async (req, res) => {
  const { destination, days, travelStyle, companion, startDate, endDate } = req.body || {};

  // ---- Validation ----
  if (!destination || String(destination).trim().length < 2) {
    return res.status(400).json({ error: "Please provide a valid destination." });
  }
  const numDays = Number(days);
  if (!Number.isInteger(numDays) || numDays < 1 || numDays > 14) {
    return res.status(400).json({ error: "Number of days must be between 1 and 14." });
  }
  if (!TRAVEL_STYLES.includes(travelStyle)) {
    return res.status(400).json({ error: `Travel style must be one of: ${TRAVEL_STYLES.join(", ")}.` });
  }
  if (!COMPANION_TYPES.includes(companion)) {
    return res.status(400).json({ error: `Companion type must be one of: ${COMPANION_TYPES.join(", ")}.` });
  }

  const ctx = {
    destination: String(destination).trim(),
    days: numDays,
    travelStyle,
    companion,
    startDate: startDate || null,
    endDate: endDate || null,
  };

  try {
    let raw;
    let source;
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        raw = await generateWithAI(ctx);
        source = "ai";
      } catch (err) {
        console.warn("AI generation failed, falling back to mock:", err.message);
        raw = buildMockItinerary(ctx);
        source = "mock-fallback";
      }
    } else {
      raw = buildMockItinerary(ctx);
      source = "mock";
    }

    const itinerary = normalizeItinerary(raw, ctx);

    // Persist the trip for the authenticated user.
    const trip = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      params: ctx,
      itinerary,
      createdAt: new Date().toISOString(),
    };
    createTrip(trip);

    return res.json({ source, tripId: trip.id, itinerary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate itinerary. Please try again." });
  }
});

// List a user's saved trips.
app.get("/api/trips", authMiddleware, (req, res) => {
  const trips = getTripsByUser(req.user.id);
  return res.json({ trips });
});

app.get("/api/health", (_req, res) => res.json({ ok: true, aiEnabled: Boolean(process.env.ANTHROPIC_API_KEY) }));

app.listen(PORT, () => {
  console.log(`\n  Wanderwise API running on http://localhost:${PORT}`);
  console.log(`  Database: SQLite at ${DB_PATH}`);
  console.log(`  AI mode: ${process.env.ANTHROPIC_API_KEY ? `Anthropic (${ANTHROPIC_MODEL})` : "mock (set ANTHROPIC_API_KEY to enable real AI)"}\n`);
});
