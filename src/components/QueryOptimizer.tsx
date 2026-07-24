import React, { useState } from 'react';
import { AntiPatternItem } from '../types';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface QueryOptimizerProps {
  originalSql: string;
  antiPatterns?: AntiPatternItem[];
  optimizedSql?: string | null;
  optimizationNotes?: string | null;
  onApplyOptimizedSql: (sql: string) => void;
}

export const QueryOptimizer: React.FC<QueryOptimizerProps> = ({
  originalSql,
  antiPatterns = [],
  optimizedSql,
  optimizationNotes,
  onApplyOptimizedSql,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!optimizedSql) return;
    navigator.clipboard.writeText(optimizedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 px-2 py-0.5 rounded-md">
            <ShieldAlert className="w-3 h-3" /> High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-2 py-0.5 rounded-md">
            <Info className="w-3 h-3" /> Advisory
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-purple-900/10 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Performance & Anti-Pattern Inspector</span>
              {antiPatterns.length === 0 ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-sans font-bold">
                  All Clear
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-sans font-bold">
                  {antiPatterns.length} {antiPatterns.length === 1 ? 'Optimization Found' : 'Optimizations Found'}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              Scans your query for high-latency SQL anti-patterns, redundant clauses, unindexed scans, or memory bottlenecks.
            </p>
          </div>
        </div>
      </div>

      {/* Anti-Patterns List */}
      {antiPatterns.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-heading font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Detected Anti-Patterns & Pitfalls
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {antiPatterns.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-2xs space-y-2 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.issue}
                  </h5>
                  {getRiskBadge(item.riskLevel)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Recommendation:</strong> {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>No severe performance anti-patterns detected. Your query structure adheres to standard database best practices!</span>
        </div>
      )}

      {/* Optimized Query Comparison Card */}
      {optimizedSql && (
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Recommended Optimized SQL Query
              </h4>
              {optimizationNotes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {optimizationNotes}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => onApplyOptimizedSql(optimizedSql)}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-[0.98]"
              >
                <span>Apply to Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto shadow-inner leading-relaxed">
            <code>{optimizedSql}</code>
          </div>
        </div>
      )}
    </div>
  );
};
