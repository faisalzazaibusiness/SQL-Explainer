import { GoogleGenAI } from "@google/genai";

// Read API keys from environment variables
const getGroqKey = () => process.env.GROQ_API_KEY;
const getOpenRouterKey = () => process.env.OPENROUTER_API_KEY;
const getGeminiKey = () => process.env.GEMINI_API_KEY;

export function buildSystemPrompt(dialect: string, depth: string) {
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

function cleanAndParseJson(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned);
}

async function callGroq(query: string, dialect: string, depth: string) {
  const key = getGroqKey();
  if (!key) throw new Error("Groq API Key missing");

  const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];
  let lastErr: any = null;

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
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
        throw new Error(`Groq [${model}] HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error(`Groq [${model}] returned empty body`);

      return {
        data: cleanAndParseJson(content),
        model: `Groq (${model})`
      };
    } catch (err: any) {
      console.warn(`Groq model ${model} failed:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr || new Error("All Groq models failed");
}

async function callOpenRouter(query: string, dialect: string, depth: string) {
  const key = getOpenRouterKey();
  if (!key) throw new Error("OpenRouter API Key missing");

  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.0-flash-lite-001",
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b"
  ];
  let lastErr: any = null;

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": "https://sqlexplainer.app",
          "X-Title": "SQL Explainer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: buildSystemPrompt(dialect, depth) },
            { role: "user", content: `Analyze this SQL query:\n\n\`\`\`sql\n${query}\n\`\`\`` }
          ],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter [${model}] HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error(`OpenRouter [${model}] returned empty body`);

      return {
        data: cleanAndParseJson(content),
        model: `OpenRouter (${model})`
      };
    } catch (err: any) {
      console.warn(`OpenRouter model ${model} failed:`, err.message);
      lastErr = err;
    }
  }

  throw lastErr || new Error("All OpenRouter models failed");
}

async function callGemini(query: string, dialect: string, depth: string) {
  const key = getGeminiKey();
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");
  const ai = new GoogleGenAI({ apiKey: key });
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
  return {
    data: cleanAndParseJson(text),
    model: "Google Gemini 3.6 Flash"
  };
}

export async function handleExplainRequest(query: string, dialect: string = "Auto-detect", depth: string = "Beginner") {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return { status: 400, data: { error: "Please provide a valid SQL query." } };
  }

  if (query.length > 10000) {
    return { status: 400, data: { error: "Query exceeds maximum limit of 10,000 characters." } };
  }

  if (query.trim().length < 5) {
    return { status: 400, data: { error: "Query is too short to be meaningful SQL." } };
  }

  let providerUsed = "";
  let resultData: any = null;
  let errors: string[] = [];

  // Priority 1: Groq
  if (getGroqKey()) {
    try {
      const res = await callGroq(query, dialect, depth);
      resultData = res.data;
      providerUsed = res.model;
    } catch (err: any) {
      errors.push(`Groq: ${err.message}`);
    }
  }

  // Priority 2: OpenRouter
  if (!resultData && getOpenRouterKey()) {
    try {
      const res = await callOpenRouter(query, dialect, depth);
      resultData = res.data;
      providerUsed = res.model;
    } catch (err: any) {
      errors.push(`OpenRouter: ${err.message}`);
    }
  }

  // Priority 3: Gemini (optional fallback)
  if (!resultData && getGeminiKey()) {
    try {
      const res = await callGemini(query, dialect, depth);
      resultData = res.data;
      providerUsed = res.model;
    } catch (err: any) {
      errors.push(`Gemini: ${err.message}`);
    }
  }

  if (!resultData) {
    return {
      status: 500,
      data: {
        error: "Failed to generate SQL explanation from available AI services.",
        details: errors.join(" | ") || "Check network connectivity or API key quotas.",
        retryable: true
      }
    };
  }

  resultData.provider = providerUsed;
  if (resultData.isValidSql === undefined) {
    resultData.isValidSql = true;
  }

  return { status: 200, data: resultData };
}
