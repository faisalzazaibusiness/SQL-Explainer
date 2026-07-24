import React from 'react';
import { Dialect, Depth } from '../types';
import { Sparkles, Layers, BookOpen, Loader2 } from 'lucide-react';

interface ControlsProps {
  dialect: Dialect;
  onDialectChange: (dialect: Dialect) => void;
  depth: Depth;
  onDepthChange: (depth: Depth) => void;
  onExplain: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  dialect,
  onDialectChange,
  depth,
  onDepthChange,
  onExplain,
  isLoading,
  isDisabled,
}) => {
  const dialects: Dialect[] = ['Auto-detect', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'];
  const depths: Depth[] = ['Beginner', 'Technical'];

  return (
    <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {/* Dialect Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-heading font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Dialect:</span>
          </label>
          <select
            value={dialect}
            onChange={(e) => onDialectChange(e.target.value as Dialect)}
            className="bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-purple-500/40 outline-none transition cursor-pointer"
          >
            {dialects.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Depth Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-heading font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Depth:</span>
          </label>
          <div className="inline-flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {depths.map((d) => {
              const active = depth === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDepthChange(d)}
                  className={`px-3 py-1 text-xs font-bold font-heading rounded-lg transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <button
        type="button"
        onClick={onExplain}
        disabled={isDisabled || isLoading}
        className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-heading font-extrabold text-xs sm:text-sm transition-all shadow-md ${
          isDisabled || isLoading
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white shadow-purple-500/20 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Analyzing Query...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Explain Query</span>
          </>
        )}
      </button>
    </div>
  );
};
