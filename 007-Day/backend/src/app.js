import express from "express";
import cookieParser from "cookie-parser";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createAuthRouter } from "./routes/auth.routes.js";

const distPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../dist");

export function createApp({ jwtSecret, cookieSecure = false }) {
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters.");
  }

  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use("/api/auth", createAuthRouter({ jwtSecret, cookieSecure }));

  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "API route not found." });
  });

  app.use(express.static(distPath));
  app.get("*splat", (_req, res) => {
    res.sendFile(resolve(distPath, "index.html"));
  });

  app.use((error, _req, res, _next) => {
    if (res.headersSent) {
      return;
    }
    if (error.status >= 400 && error.status < 500) {
      const body = { message: error.message };
      if (error.errors) {
        body.errors = error.errors;
      }
      return res.status(error.status).json(body);
    }
    if (error.status === 413) {
      return res.status(413).json({ message: "The request is too large." });
    }
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({
        message: "The request body must be valid JSON.",
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  });

  return app;
}
