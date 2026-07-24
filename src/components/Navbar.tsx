import React from 'react';
import { Database, History, Share2, Sparkles, Trash2, Sun, Moon, LayoutDashboard, Code, User } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenShare: () => void;
  onClearQuery: () => void;
  hasQuery: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeTab: 'explainer' | 'samples';
  setActiveTab: (tab: 'explainer' | 'samples') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onOpenShare,
  onClearQuery,
  hasQuery,
  isDarkMode,
  onToggleTheme,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#0b0c10]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & Navigation Pills */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                  SQL Explainer
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-purple-500" /> Pro AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                Plain-English SQL walkthroughs & performance optimizer
              </p>
            </div>
          </div>

          {/* Navigation Segmented Pills */}
          <nav className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-heading font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('explainer')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'explainer'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Explainer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'samples'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Sample Queries</span>
            </button>
          </nav>
        </div>

        {/* Right: Creator Credit & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Creator Credit */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <User className="w-3.5 h-3.5 text-purple-500" />
            <span>Built by <strong className="font-heading font-bold text-slate-900 dark:text-white">Faisal Zazai</strong></span>
          </div>

          {hasQuery && (
            <button
              type="button"
              onClick={onClearQuery}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              title="Clear SQL Editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenShare}
            className="text-xs font-heading font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 shadow-xs"
            title="Share query via link or Markdown"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative text-xs font-heading font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            title="View query history"
          >
            <History className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-800"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
