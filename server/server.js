// Local development entry point. Vercel does not use this file — it imports the
// Express app directly from `api/index.js`. Here we simply start a listener.
import app from "./app.js";

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`\n  Wanderwise API running on http://localhost:${PORT}`);
  console.log(
    `  AI mode: ${
      process.env.ANTHROPIC_API_KEY
        ? `Anthropic (${process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6"})`
        : "mock (set ANTHROPIC_API_KEY to enable real AI)"
    }\n`
  );
});
