import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// System prompt for SQL analysis
function buildSystemPrompt(dialect: string, depth: string) {
  const depthGuide = depth === "Technical"
    ? "Provide in-depth explanation including execution plan details, table scan/index implications, subquery evaluation order, join algorithms, and specific performance recommendations for optimization."
    : "Provide clear, accessible, plain-English explanations suitable for developers, analysts, or students. Keep explanations conversational, straightforward, and crystal clear.";

  return `You are an expert SQL Query Analyzer, Database Administrator, and Educator.
Your task is to analyze the user's SQL query and return a structured JSON response explaining what it does.

Target SQL Dialect: ${dialect} (If 'Auto-detect', determine dialect from query syntax).
Target Audience Depth: ${depth} (${depthGuide})

CRITICAL INSTRUCTIONS:
1. Validate if the input is valid SQL syntax. If invalid, set "isValidSql": false and provide a helpful, specific "errorMessage".
2. If valid, break down the query into logical execution steps mirroring SQL logical order of operations (1. Data Sources/Joins, 2. Row Filtering (WHERE), 3. Grouping (GROUP BY), 4. Group Filtering (HAVING), 5. Window Functions/Aggregates, 6. Selection & Projection (SELECT), 7. Set Operations (UNION/INTERSECT), 8. Sorting & Limiting (ORDER BY / LIMIT)). Skip unused steps.
3. For each step, provide clause, lineStart, lineEnd, title, explanation, and optional performanceTip if depth is Technical.
4. Summary: Concise 1-2 sentence overview of what the query produces.
5. List referenced tables in "tablesInvolved".
6. Analyze performance anti-patterns (e.g. SELECT *, unindexed joins, wildcard LIKE, implicit cross joins) and return an "antiPatterns" array. If none found, return an empty array.
7. Provide an "optimizedSql" string (a cleaner, performance-tuned or better formatted SQL query) and "optimizationNotes".
8. Provide "flowNodes": array of steps showing the data pipeline flow (types: 'source', 'join', 'filter', 'aggregate', 'output').
9. Provide "outputSchema": array of projected columns with estimated data types, descriptions, and mock sample values.

Return ONLY valid JSON matching this exact structure:
{
  "isValidSql": true,
  "errorMessage": null,
  "summary": "Summarizes sales per customer by joining orders and customers.",
  "tablesInvolved": ["orders", "customers"],
  "detectedDialect": "PostgreSQL",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Data Sources & Joins",
      "clause": "FROM orders o INNER JOIN customers c ON o.customer_id = c.id",
      "explanation": "Combines orders with customer records on matching customer IDs.",
      "lineStart": 2,
      "lineEnd": 3,
      "performanceTip": "Ensure index on orders(customer_id) for faster join."
    }
  ],
  "antiPatterns": [
    {
      "issue": "Usage of SELECT *",
      "riskLevel": "medium",
      "suggestion": "Specify explicit column names to reduce I/O overhead."
    }
  ],
  "optimizedSql": "SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id;",
  "optimizationNotes": "Replaced wildcard SELECT with explicit column projections.",
  "flowNodes": [
    { "id": "f1", "label": "Orders & Customers Tables", "type": "source", "details": "Reads raw data from orders and customers" },
    { "id": "f2", "label": "Inner Join on customer_id", "type": "join", "details": "Matches customer records" }
  ],
  "outputSchema": [
    { "columnName": "customer_name", "dataType": "VARCHAR", "description": "Full name of customer", "sampleValue": "Jane Doe" }
  ]
}`;
}

// OpenRouter call function
async function callOpenRouter(query: string, dialect: string, depth: string) {
  if (!OPENROUTER_API_KEY) throw new Error("OpenRouter key not configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://sqlexplainer.app",
      "X-Title": "SQL Explainer",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        { role: "system", content: buildSystemPrompt(dialect, depth) },
        { role: "user", content: `Analyze this SQL query:\n\n\`\`\`sql\n${query}\n\`\`\`` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenRouter");
  return JSON.parse(content);
}

// Groq call function (Fallback 1)
async function callGroq(query: string, dialect: string, depth: string) {
  if (!GROQ_API_KEY) throw new Error("Groq key not configured");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: buildSystemPrompt(dialect, depth) },
        { role: "user", content: `Analyze this SQL query:\n\n\`\`\`sql\n${query}\n\`\`\`` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return JSON.parse(content);
}

// Gemini call function (Primary)
async function callGemini(query: string, dialect: string, depth: string) {
  if (!GEMINI_API_KEY) throw new Error("Gemini key not configured");
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: buildSystemPrompt(dialect, depth) },
          { text: `Analyze this SQL query:\n\n\`\`\`sql\n${query}\n\`\`\`` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini");
  return JSON.parse(text);
}

// Primary API Route
app.post("/api/explain", async (req, res) => {
  const { query, dialect = "Auto-detect", depth = "Beginner" } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Please provide a valid SQL query." });
  }

  // Guardrail: max length
  if (query.length > 10000) {
    return res.status(400).json({ error: "Query exceeds maximum limit of 10,000 characters." });
  }

  if (query.trim().length < 5) {
    return res.status(400).json({ error: "Query is too short to be meaningful SQL." });
  }

  let providerUsed = "";
  let result: any = null;
  let lastError: any = null;

  // Try Gemini -> OpenRouter -> Groq
  if (GEMINI_API_KEY) {
    try {
      result = await callGemini(query, dialect, depth);
      providerUsed = "Google Gemini 3.6 Flash";
    } catch (err: any) {
      console.warn("Gemini call failed:", err.message);
      lastError = err;
    }
  }

  if (!result && OPENROUTER_API_KEY) {
    try {
      result = await callOpenRouter(query, dialect, depth);
      providerUsed = "OpenRouter (Llama 3.3 70B)";
    } catch (err: any) {
      console.warn("OpenRouter call failed:", err.message);
      lastError = err;
    }
  }

  if (!result && GROQ_API_KEY) {
    try {
      result = await callGroq(query, dialect, depth);
      providerUsed = "Groq (Llama 3.3 Versatile)";
    } catch (err: any) {
      console.warn("Groq call failed:", err.message);
      lastError = err;
    }
  }

  if (!result) {
    return res.status(500).json({
      error: "Failed to generate SQL explanation from AI provider.",
      details: lastError?.message || "All fallback API calls failed.",
      retryable: true
    });
  }

  // Ensure sanitization & fallback fields
  result.provider = providerUsed;
  if (result.isValidSql === undefined) {
    result.isValidSql = true;
  }

  return res.json(result);
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
