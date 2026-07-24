import React from 'react';
import { Sparkles } from 'lucide-react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Top Summary Card Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-6 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-lg" />
          <div className="h-6 w-3/4 bg-slate-200/80 dark:bg-slate-800/80 rounded-lg" />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
      </div>

      {/* Loading indicator bar */}
      <div className="flex items-center justify-between px-2 text-xs text-indigo-600 dark:text-indigo-400 font-mono">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Parsing SQL structure & building logical walkthrough...</span>
        </span>
        <span className="text-slate-400">Step 2 of 3</span>
      </div>

      {/* Steps List Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/60" />
            <div className="h-4 w-5/6 bg-slate-200/80 dark:bg-slate-800/80 rounded" />
            <div className="h-4 w-2/3 bg-slate-200/80 dark:bg-slate-800/80 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
