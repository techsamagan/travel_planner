import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies /api to the Express backend on port 5000,
// so the frontend can call relative URLs without CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});
