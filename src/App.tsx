/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Dialect, Depth, ExplanationResult, QueryHistoryItem, SampleQuery } from './types';
import { explainSqlQuery } from './services/api';
import { Navbar } from './components/Navbar';
import { SqlEditor } from './components/SqlEditor';
import { Controls } from './components/Controls';
import { SampleGallery } from './components/SampleGallery';
import { ExplanationView } from './components/ExplanationView';
import { SkeletonLoader } from './components/SkeletonLoader';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';
import { AlertCircle, RefreshCw, Sparkles, CheckCircle2, ArrowDown, Sun, Moon, Database, HelpCircle, Layers, BookOpen, ShieldAlert } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sql_explainer_history_v1';
const THEME_STORAGE_KEY = 'sql_explainer_theme_v1';
const MAX_CHAR_LIMIT = 10000;

export default function App() {
  const [query, setQuery] = useState('');
  const [dialect, setDialect] = useState<Dialect>('Auto-detect');
  const [depth, setDepth] = useState<Depth>('Beginner');
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab & Theme state
  const [activeTab, setActiveTab] = useState<'explainer' | 'samples'>('explainer');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Help Modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Editor highlighting state
  const [selectedStepRange, setSelectedStepRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number | null>(null);

  // History state
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Share modal state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync dark mode class on html tag
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme setting', e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 1. Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // 2. Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    const dParam = params.get('dialect') as Dialect;
    const depthParam = params.get('depth') as Depth;

    if (qParam) {
      setQuery(qParam);
      if (dParam) setDialect(dParam);
      if (depthParam) setDepth(depthParam);
      showToast('Loaded SQL query from shared link');
    }
  }, []);

  // Helper to save history item
  const saveToHistory = (
    q: string,
    d: Dialect,
    dp: Depth,
    result: ExplanationResult
  ) => {
    const newItem: QueryHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      query: q,
      dialect: d,
      depth: dp,
      summary: result.summary,
      isValidSql: result.isValidSql,
      stepCount: result.steps?.length || 0,
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.query.trim() !== q.trim());
      const updated = [newItem, ...filtered].slice(0, 50);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history to localStorage', e);
      }
      return updated;
    });
  };

  // Main Explain Function
  const handleExplain = useCallback(async () => {
    if (!query || query.trim().length < 5) return;
    if (query.length > MAX_CHAR_LIMIT) {
      setError(`Query exceeds the maximum character limit of ${MAX_CHAR_LIMIT.toLocaleString()} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedStepRange(null);
    setSelectedStepNumber(null);
    setActiveTab('explainer');

    try {
      const res = await explainSqlQuery(query.trim(), dialect, depth);
      setExplanation(res);
      if (res.isValidSql) {
        saveToHistory(query.trim(), dialect, depth, res);
      }
    } catch (err: any) {
      console.error('Explain error:', err);
      setError(err.message || 'An unexpected error occurred while explaining the query.');
    } finally {
      setIsLoading(false);
    }
  }, [query, dialect, depth]);

  // Load sample query
  const handleSelectSample = (sample: SampleQuery) => {
    setQuery(sample.query);
    setDialect(sample.dialect);
    setExplanation(null);
    setError(null);
    setSelectedStepRange(null);
    setSelectedStepNumber(null);
    setActiveTab('explainer');
    showToast(`Loaded sample query: ${sample.title}`);
  };

  // Clear Editor
  const handleClear = () => {
    setQuery('');
    setExplanation(null);
    setError(null);
    setSelectedStepRange(null);
    setSelectedStepNumber(null);
  };

  // Apply Optimized Query
  const handleApplyOptimizedSql = (optimizedSql: string) => {
    setQuery(optimizedSql);
    setExplanation(null);
    setSelectedStepRange(null);
    setSelectedStepNumber(null);
    showToast('Applied optimized SQL query to editor!');
  };

  // Load history item
  const handleLoadHistoryItem = (item: QueryHistoryItem) => {
    setQuery(item.query);
    setDialect(item.dialect);
    setDepth(item.depth);
    setExplanation(null);
    setError(null);
    setSelectedStepRange(null);
    setSelectedStepNumber(null);
    setActiveTab('explainer');
    showToast('Loaded query from history');
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update history', e);
      }
      return updated;
    });
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const isQueryTooShort = !query || query.trim().length < 5;
  const isQueryOverLimit = query.length > MAX_CHAR_LIMIT;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-purple-500 selection:text-white transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 dark:bg-purple-600 text-white text-xs font-heading font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 dark:border-purple-400/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onClearQuery={handleClear}
        hasQuery={query.length > 0}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Metric / Stat Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-heading font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Saved Queries
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-heading font-extrabold text-slate-900 dark:text-white">
                  {history.length}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  Local cache
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-heading font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Target Dialect
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white">
                  {dialect}
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                  <Layers className="w-3 h-3 inline mr-1" />
                  Auto SQL
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-heading font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Analysis Depth
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white">
                  {depth}
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                  <BookOpen className="w-3 h-3 inline mr-1" />
                  Detailed
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-heading font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Engine Status
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-white">
                  Llama 3.3 / Gemini
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  Active
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Tab Switcher for Sample Gallery */}
        {activeTab === 'samples' && (
          <SampleGallery onSelectSample={handleSelectSample} />
        )}

        {/* Main Work Area: Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor & Controls */}
          <div className="lg:col-span-5 space-y-4 flex flex-col h-full">
            {/* Controls Bar */}
            <Controls
              dialect={dialect}
              onDialectChange={setDialect}
              depth={depth}
              onDepthChange={setDepth}
              onExplain={handleExplain}
              isLoading={isLoading}
              isDisabled={isQueryTooShort || isQueryOverLimit}
            />

            {/* SQL CodeMirror Editor */}
            <div className="flex-1 min-h-[380px]">
              <SqlEditor
                value={query}
                onChange={(val) => {
                  setQuery(val);
                  if (error) setError(null);
                }}
                onExplain={handleExplain}
                selectedLineRange={selectedStepRange}
                disabled={isLoading}
                isDarkMode={isDarkMode}
                maxCharLimit={MAX_CHAR_LIMIT}
              />
            </div>
          </div>

          {/* Right Column: Explanation Output / Skeleton / Initial State */}
          <div className="lg:col-span-7 space-y-4">
            {/* Error Message Box with Retry */}
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-heading font-bold text-rose-900 dark:text-rose-200">Execution Error</h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed mt-1 font-sans">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleExplain}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Explanation
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && <SkeletonLoader />}

            {/* Rendered Explanation View */}
            {!isLoading && explanation && (
              <ExplanationView
                result={explanation}
                query={query}
                dialect={dialect}
                depth={depth}
                onSelectStepLineRange={(range) => setSelectedStepRange(range)}
                selectedStepNumber={selectedStepNumber}
                setSelectedStepNumber={setSelectedStepNumber}
                onApplyOptimizedSql={handleApplyOptimizedSql}
              />
            )}

            {/* Empty State / Ready Banner */}
            {!isLoading && !explanation && !error && (
              <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 border-dashed rounded-2xl p-8 lg:p-12 text-center space-y-4 shadow-2xs">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 rounded-2xl flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-slate-100">
                    Ready to Explain Your SQL Query
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Paste any SQL query on the left or click <button onClick={() => setActiveTab('samples')} className="text-purple-600 dark:text-purple-400 font-bold underline">Sample Queries</button> above, then click{' '}
                    <strong className="text-purple-600 dark:text-purple-400 font-bold">Explain Query</strong> to generate a step-by-step plain-English walkthrough.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce text-purple-500" />
                  <span>Supports CTEs, Subqueries, Window Functions, and Joins</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Controls Pill */}
      <div className="fixed bottom-5 left-5 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-lg p-1.5 flex items-center gap-1 transition-all">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800" />

        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
          title="About SQL Explainer & Help"
        >
          <HelpCircle className="w-4 h-4 text-purple-500" />
        </button>
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">About SQL Explainer</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              <p>
                <strong>SQL Explainer</strong> turns complex SQL queries into clear, logical, clause-by-clause walkthroughs in seconds.
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 font-medium">
                <p>• <strong>Multi-dialect support:</strong> PostgreSQL, MySQL, SQLite, SQL Server</p>
                <p>• <strong>Performance Inspector:</strong> Detects anti-patterns & offers 1-click optimized SQL</p>
                <p>• <strong>Visual Pipeline:</strong> Interactive data flow stages from source to output</p>
                <p>• <strong>Export suite:</strong> Annotated SQL, Markdown report, and print preview</p>
              </div>
              <p className="pt-2 text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                Created by <strong>Faisal Zazai</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        query={query}
        dialect={dialect}
        depth={depth}
        explanationResult={explanation}
      />
    </div>
  );
}
