import React from 'react';
import { ComplexityInfo } from '../types';
import { Gauge, Cpu, Layers, GitBranch, AlertCircle, ShieldCheck, CheckCircle2, Flame } from 'lucide-react';

interface ComplexityCardProps {
  complexity: ComplexityInfo;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40';
    if (score >= 35) return 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40';
    return 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40';
  };

  const getProgressWidth = (score: number) => `${Math.min(100, Math.max(5, score))}%`;

  return (
    <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-xl">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Cognitive & Execution Complexity Meter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates join depth, subqueries, and database parsing cost
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className={`px-3 py-1 rounded-xl border font-heading font-extrabold text-xs flex items-center gap-1.5 ${getScoreColor(complexity.score)}`}>
          <Flame className="w-3.5 h-3.5" />
          <span>{complexity.rating} Complexity ({complexity.score}/100)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>Low (Simple Scan)</span>
          <span>Moderate</span>
          <span>High (Multiple Joins)</span>
          <span>Critical</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              complexity.score >= 80
                ? 'bg-rose-500'
                : complexity.score >= 60
                ? 'bg-orange-500'
                : complexity.score >= 35
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: getProgressWidth(complexity.score) }}
          />
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
              Estimated Join Depth
            </span>
            <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-slate-100">
              {complexity.estimatedJoinDepth} {complexity.estimatedJoinDepth === 1 ? 'Table Join' : 'Table Joins'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
              Subquery Depth
            </span>
            <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-slate-100">
              {complexity.subqueryNestingLevel} {complexity.subqueryNestingLevel === 1 ? 'Subquery Level' : 'Subquery Levels'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
              Index / Scan Impact
            </span>
            <span className="text-sm font-heading font-extrabold text-slate-900 dark:text-slate-100">
              {complexity.score < 40 ? 'Optimal Scan' : complexity.score < 70 ? 'Moderate I/O' : 'High I/O Scan'}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Reasoning */}
      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 font-sans leading-relaxed">
        <strong className="text-slate-900 dark:text-white font-heading">Key Insight:</strong> {complexity.reasoning}
      </p>
    </div>
  );
};
