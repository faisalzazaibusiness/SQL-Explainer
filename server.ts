import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { handleExplainRequest } from "./src/server/explainService";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Primary API Route
app.post("/api/explain", async (req, res) => {
  const { query, dialect = "Auto-detect", depth = "Beginner" } = req.body || {};
  const response = await handleExplainRequest(query, dialect, depth);
  return res.status(response.status).json(response.data);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
