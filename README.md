# Wanderwise — AI Travel Planner

A production-ready full-stack AI Travel Planner. Modern, animated, mobile-responsive
landing page, JWT auth, and an interactive AI-generated itinerary dashboard.

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + Lucide React
- **Backend:** Node.js + Express, deployed as a Vercel serverless function
- **Auth/DB:** JWT + bcrypt with a Postgres database
- **AI:** Anthropic Claude (`claude-sonnet-4-6`) with a built-in deterministic mock
  fallback so the app works fully even without an API key.

## Project layout

```
travel_plan/
├── api/
│   └── [...path].js   Vercel serverless catch-all — re-exports the Express app
├── server/            Express API (auth + itinerary generation)
│   ├── app.js         The Express app (routes + Postgres data layer)
│   ├── server.js      Local dev entry (starts a listener)
│   ├── package.json
│   └── .env.example
├── client/            Vite + React app
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx  App.jsx  index.css
│       ├── lib/api.js
│       ├── context/AuthContext.jsx
│       ├── pages/{Landing,Auth,Dashboard}.jsx
│       └── components/{Navbar,PlannerForm,LoadingState,ItineraryView}.jsx
├── package.json       Root — serverless function dependencies + build script
└── vercel.json        Vercel build + routing config
```

## Deploy to Vercel

The whole app deploys to Vercel as one project: the client is served as a static
site and the Express API runs as a serverless function under `/api`.

1. **Push this repo to GitHub** (or GitLab/Bitbucket).
2. **Import the repo into Vercel** → *Add New… → Project*. Leave the framework
   preset as **Other** — `vercel.json` already defines the build command
   (`npm run build`), output directory (`client/dist`), and `/api` routing.
3. **Add a Postgres database.** In the Vercel project, open the **Storage** tab →
   *Create Database* → **Postgres** (Neon). Vercel automatically injects the
   `POSTGRES_URL` connection string into the project's environment variables.
   (Any Postgres works — Neon, Supabase, etc. — just set `POSTGRES_URL`.)
4. **Set environment variables** (Project → *Settings → Environment Variables*):
   - `JWT_SECRET` — **required.** A long random string. Generate one with
     `openssl rand -base64 32`.
   - `ANTHROPIC_API_KEY` — *optional.* Enables real AI itineraries. Without it,
     the app serves a rich deterministic mock (fully functional).
   - `ANTHROPIC_MODEL` — *optional.* Defaults to `claude-sonnet-4-6`.
   - `POSTGRES_URL` is added automatically in step 3.
5. **Deploy.** The database tables are created automatically on first request.

That's it — no other configuration needed. The client calls relative `/api/...`
URLs, so there are no CORS or base-URL settings to manage.

## Run it locally

You need a Postgres database. The quickest option is a free
[Neon](https://neon.tech) project — copy its connection string into
`POSTGRES_URL`. (A local Postgres works too.)

Open two terminals.

**1) Backend**
```bash
cd server
npm install
cp .env.example .env        # set POSTGRES_URL and JWT_SECRET (ANTHROPIC_API_KEY optional)
npm run dev                 # http://localhost:5050
```

**2) Frontend**
```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:5050`, so no CORS config is
needed in development.

## Notes
- Without `ANTHROPIC_API_KEY`, the `/api/generate-itinerary` route returns a rich,
  deterministic mock itinerary in the exact required JSON shape — the UI is fully
  functional out of the box.
- Database tables (`users`, `trips`) are created automatically on first request.
- `GET /api/health` returns `{ ok, aiEnabled }` and does not require the database —
  handy for checking a deploy is live.
