# ⚡ SQL Explainer — Plain-English Query Walkthrough & Performance Optimizer

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?style=for-the-badge&logo=googlegemini)](https://ai.google.dev)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless_Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

> **Built with ❤️ by Faisal Zazai**

**SQL Explainer** is an enterprise-grade AI developer application that turns complex SQL queries into clear, logical, step-by-step plain-English walkthroughs. It highlights SQL code line ranges, detects performance anti-patterns, recommends 1-click optimized queries, visualizes data pipeline flows, measures cognitive execution complexity, and transpiles queries across multiple database dialects.

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
| **Backend / Serverless** | Node.js, Express v4, Vercel Serverless Functions (`@vercel/node`) |
| **AI Infrastructure** | `@google/genai` (Google Gemini 3.6 Flash), OpenRouter / Groq Fallback |
| **Persistence** | LocalStorage (Query History, Settings, Theme) |

---

## 🔺 Vercel Deployment Guide (Fixing 404 API Errors)

### Why the 404 Error Occurs on Vercel
When deploying a full-stack Vite app to Vercel, Vercel by default only serves the built static frontend files in `dist/`. The backend Express endpoints (like `/api/explain`) will return `404 Not Found` unless configured as Vercel Serverless Functions.

### How We Fixed It
The repository now includes:
1. `api/explain.ts`: A dedicated Vercel Serverless Function entry point wrapping the AI explanation service.
2. `vercel.json`: Configuration routing `/api/explain` to the serverless function and catch-all routes to SPA `index.html`.

### Step-by-Step Vercel Setup

1. **Push Changes to GitHub**:
   Ensure you push the latest codebase (including `api/explain.ts` and `vercel.json`) to your GitHub repository.

2. **Configure Environment Variables in Vercel**:
   - Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Settings** ➔ **Environment Variables**.
   - Add the following environment variable:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Your Google Gemini API key (get one free at [Google AI Studio](https://aistudio.google.com)).
   - *(Optional)* Add `OPENROUTER_API_KEY` or `GROQ_API_KEY` if you want multi-provider fallback.

3. **Deploy / Redeploy**:
   - Go to the **Deployments** tab in Vercel.
   - Click **Redeploy** (or push a new commit to trigger an automatic deployment).
   - Once deployed, your `/api/explain` endpoint will respond with status `200 OK`.

---

## 🚀 Local Development & Quick Start

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Gemini API Key**: Get a free key at [Google AI Studio](https://aistudio.google.com)

### 1. Clone & Install

```bash
git clone https://github.com/faisalzazai/sql-explainer.git
cd sql-explainer
npm install
```

### 2. Configure Environment Variables

Create `.env`:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author & Credits

Designed and developed with precision by **Faisal Zazai**.

- **Email**: `faisalzazai.business@gmail.com`
- **License**: Apache 2.0
