import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve("frontend"),
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      changeOrigin: true,
    },
  },
  build: {
    outDir: resolve("dist"),
    emptyOutDir: true,
  },
});
