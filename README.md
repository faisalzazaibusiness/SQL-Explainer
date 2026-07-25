# ⚡ SQL Explainer — Plain-English Query Walkthrough & Performance Optimizer

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](https://github.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-F05032?style=for-the-badge&logo=groq)](https://groq.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Multi--Model-654321?style=for-the-badge)](https://openrouter.ai)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless_Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

> **Built with ❤️ by Faisal Zazai**

**SQL Explainer** is an enterprise-grade AI developer application that turns complex SQL queries into clear, logical, step-by-step plain-English walkthroughs. Powered by ultra-fast **Groq** and **OpenRouter** AI models with instant failover, it highlights SQL code line ranges, detects performance anti-patterns, recommends 1-click optimized queries, visualizes data pipeline flows, measures cognitive execution complexity, and transpiles queries across multiple database dialects.

---

## 🌟 Key Features

- 🔍 **Step-by-Step Logical Walkthrough**: Breaks queries down following SQL logical execution order (Sources & Joins ➔ Row Filters ➔ Aggregations ➔ Group Filters ➔ Projections ➔ Ordering & Limits).
- 🚀 **Powered by Groq & OpenRouter**: Built-in multi-model AI failover engine utilizing Groq (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) and OpenRouter (`meta-llama/llama-3.3-70b-instruct`, `google/gemini-2.0-flash-lite`) for lightning-fast analysis.
- ⚡ **AI Performance & Anti-Pattern Inspector**: Identifies costly table scans, unindexed joins, wildcard `LIKE` patterns, and `SELECT *` pitfalls with 1-click application of tuned SQL.
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
| **Backend & Serverless** | Node.js, Express v4, Vercel Serverless Functions (`@vercel/node`) |
| **AI Infrastructure** | Groq API (`llama-3.3-70b-versatile`), OpenRouter API (`llama-3.3-70b-instruct`), Gemini |
| **Persistence** | LocalStorage (Query History, Settings, Theme) |

---

## 🔺 Step-by-Step Vercel Deployment Guide

Deploying SQL Explainer to Vercel takes less than 2 minutes. Follow these exact steps to ensure clean deployment without any `404` or server errors:

### Step 1: Push Project to GitHub

Ensure all repository files (including `api/explain.ts`, `vercel.json`, and `package.json`) are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Configure Groq and OpenRouter AI engine with Vercel serverless support"
git push origin main
```

### Step 2: Import Project into Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➔ **Project**.
3. Select your GitHub repository (`sql-explainer`).
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables in Vercel

Under **Environment Variables** on the Vercel import screen (or in **Settings ➔ Environment Variables**):

1. **GROQ_API_KEY**:
   Paste your Groq API key (starts with `gsk_`). Get one free at [Groq Console](https://console.groq.com).

2. **OPENROUTER_API_KEY**:
   Paste your OpenRouter API key (starts with `sk-or-v1-`). Get one free at [OpenRouter Keys](https://openrouter.ai/keys).

3. *(Optional)* **GEMINI_API_KEY**:
   Paste your Google Gemini API key if using Gemini as an additional fallback.

### Step 4: Click Deploy

Click **Deploy**. Vercel will build your static Vite frontend and spin up the `/api/explain` serverless function. Once finished, click your deployment URL to test explaining SQL queries!

---

## 🚀 Local Development

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install

```bash
git clone https://github.com/faisalzazai/sql-explainer.git
cd sql-explainer
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author & Credits

Designed and developed with precision by **Faisal Zazai**.

- **Email**: `faisalzazai.business@gmail.com`
- **License**: Apache 2.0
