# Wanderwise — AI Travel Planner

A production-ready full-stack AI Travel Planner. Modern, animated, mobile-responsive
landing page, JWT auth, and an interactive AI-generated itinerary dashboard.

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + Lucide React
- **Backend:** Node.js + Express
- **Auth/DB:** Local JWT + bcrypt with a JSON file database (zero external setup)
- **AI:** Anthropic Claude (`claude-sonnet-4-6`) with a built-in deterministic mock
  fallback so the app works fully even without an API key.

## Project layout

```
travel_plan/
├── server/          Express API (auth + itinerary generation)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── client/          Vite + React app
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── lib/api.js
        ├── context/AuthContext.jsx
        ├── pages/{Landing,Auth,Dashboard}.jsx
        └── components/{Navbar,PlannerForm,LoadingState,ItineraryView}.jsx
```

## Run it

Open two terminals.

**1) Backend**
```bash
cd server
npm install
cp .env.example .env       # optional: add ANTHROPIC_API_KEY for real AI output
npm run dev                # http://localhost:5000
```

**2) Frontend**
```bash
cd client
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5000`, so no CORS config is
needed in development.

## Notes
- Without `ANTHROPIC_API_KEY`, the `/api/generate-itinerary` route returns a rich,
  deterministic mock itinerary in the exact required JSON shape — the UI is fully
  functional out of the box.
- The JSON "database" lives at `server/db.json` (auto-created). Delete it to reset users.
