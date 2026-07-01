// Vercel serverless entry point. This catch-all function natively receives every
// `/api/*` request (with the original URL preserved) and hands it to the shared
// Express app.
import app from "../server/app.js";

export default app;
