# ⚡ SQL Explainer — Plain-English Query Walkthrough & Performance Optimizer

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

> **Created with ❤️ by Faisal Zazai**

**SQL Explainer** is an enterprise-grade AI developer application that turns complex SQL queries into clear, logical, step-by-step plain-English walkthroughs. It highlights SQL code line ranges, detects performance anti-patterns, recommends 1-click optimized queries, visualizes data pipeline flows, measures cognitive execution complexity, and transpile queries across multiple database dialects.

---

## 🌟 Key Features

- 🔍 **Step-by-Step Logical Walkthrough**: Breaks queries down following SQL logical execution order (Sources & Joins ➔ Row Filters ➔ Aggregations ➔ Group Filters ➔ Projections ➔ Ordering & Limits).
- ⚡ **AI Performance & Anti-Pattern Inspector**: Identifies costly table scans, unindexed joins, wildcard `LIKE` patterns, and `SELECT *` pitfalls, offering 1-click application of tuned SQL.
- 🔀 **Multi-Dialect Transpiler**: Converts SQL syntax dynamically between **PostgreSQL**, **MySQL**, **SQLite**, **SQL Server (T-SQL)**, and **Google BigQuery**.
- 📊 **Cognitive & Execution Complexity Meter**: Analyzes join depth, subquery nesting, and aggregation complexity to calculate a color-coded 1-100 complexity score.
- 📐 **Visual Data Flow Pipeline**: Interactive pipeline diagram mapping data movement from source tables through filters, joins, aggregations, to the final output projection.
- 📋 **Output Schema Simulator**: Estimates projected column names, data types, descriptions, and sample output rows.
- ✍️ **CodeMirror 6 Editor**: Includes syntax highlighting, keyboard shortcuts (`⌘ + Enter`), SQL keyword auto-formatting, and interactive line-range highlighting.
- 📑 **Export & Share Suite**: Export reports as formatted **Markdown**, **Annotated SQL** with embedded step comments, or generate shareable deep-link URLs.
- 🌙 **Dark & Light Mode Support**: Fluid, responsive, WCAG-compliant design tailored for dark/light IDE themes.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.8, Vite 6 |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Code Editor** | `@uiw/react-codemirror` with `@codemirror/lang-sql` |
| **Backend Server** | Node.js, Express v4, `tsx` (Dev), `esbuild` (Prod CJS Bundle) |
| **AI Infrastructure** | `@google/genai` (Google Gemini 3.6 Flash), OpenRouter / Groq Fallback |
| **Persistence** | LocalStorage (Query History, Settings, Theme) |

---

## 🏗️ Architecture Flow

```
[ User Input / Sample Query ] ➔ [ CodeMirror Editor ]
                                        │
                                        ▼ (POST /api/explain)
                         ┌─────────────────────────────┐
                         │    Express Backend Proxy    │
                         └──────────────┬──────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   [ Google Gemini AI ]       [ OpenRouter Fallback ]     [ Groq Fallback ]
             │                          │                          │
             └──────────────────────────┴──────────────────────────┘
                                        │ (Structured JSON)
                                        ▼
                      ┌──────────────────────────────────┐
                      │    Explanation & Report View     │
                      ├──────────────────────────────────┤
                      │  • Clause-by-Clause Walkthrough  │
                      │  • Performance Anti-Pattern Rules│
                      │  • 1-Click Optimized SQL         │
                      │  • Cognitive Complexity Gauge    │
                      │  • Multi-Dialect Transpiler      │
                      │  • Output Schema Simulator       │
                      └──────────────────────────────────┘
```

---

## 🚀 Quick Start & Installation

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Gemini API Key** (optional but recommended): Get a free key at [Google AI Studio](https://aistudio.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/faisalzazai/sql-explainer.git
cd sql-explainer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (or copy `.env.example`):

```bash
cp .env.example .env
```

Set your API keys:

```env
# .env
GEMINI_API_KEY="your_gemini_api_key_here"
OPENROUTER_API_KEY="optional_openrouter_key"
GROQ_API_KEY="optional_groq_key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build Command

Compiles Vite frontend assets and bundles the Node/Express backend into `dist/server.cjs` using `esbuild`:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

The application runs on `http://0.0.0.0:3000`.

---

## 📡 API Reference

### `POST /api/explain`

Analyzes a SQL query and returns a structured JSON response.

#### Request Body

```json
{
  "query": "SELECT u.id, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id;",
  "dialect": "PostgreSQL",
  "depth": "Beginner"
}
```

#### Response Structure

```json
{
  "isValidSql": true,
  "summary": "Groups order totals per user by joining users and orders tables.",
  "tablesInvolved": ["users", "orders"],
  "detectedDialect": "PostgreSQL",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Data Sources & Joins",
      "clause": "FROM users u JOIN orders o ON u.id = o.user_id",
      "explanation": "Combines users and orders on matching user IDs.",
      "lineStart": 1,
      "lineEnd": 1
    }
  ],
  "antiPatterns": [],
  "optimizedSql": "SELECT u.id, COUNT(o.id) AS total_orders FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id;",
  "optimizationNotes": "Added explicit column alias for count aggregate."
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + Enter` / `Ctrl + Enter` | Trigger SQL Query Analysis |
| `Format Button` | Capitalize SQL Keywords & Indent Clauses |
| `Copy Button` | Copy SQL or Markdown Report |

---

## 👤 Author & Credits

Designed and developed with precision by **Faisal Zazai**.

- **Email**: `faisalzazai.business@gmail.com`
- **License**: Apache 2.0

---

*Enjoy clear, transparent SQL queries with SQL Explainer!*
