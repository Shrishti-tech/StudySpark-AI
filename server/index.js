import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ error: "Request body is not valid JSON.", code: "BAD_REQUEST_JSON" });
  }

  const statusCode = err.statusCode || 500;
  const code = err.name || "InternalError";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: err.message || "Something went wrong on the server.",
    code,
  });
});

app.listen(PORT, () => {
  console.log(`StudySpark AI server listening on http://localhost:${PORT}`);
});
