import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { apiRouter } from "./routes/api.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "sports-connect-api" });
  });

  app.use("/api", apiRouter);

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const statusCode = typeof error.statusCode === "number" ? error.statusCode : 400;
    res.status(statusCode).json({
      error: error.message ?? "Unexpected error",
      details: error.errors
    });
  };

  app.use(errorHandler);

  return app;
}
