import React, { useState } from 'react';
import { transpileQuery } from '../utils/transpiler';
import { Layers, Copy, Check, Info, ArrowRight, Sparkles } from 'lucide-react';

interface DialectTranspilerProps {
  originalSql: string;
  sourceDialect: string;
  onApplySql?: (sql: string) => void;
}

export const DialectTranspiler: React.FC<DialectTranspilerProps> = ({
  originalSql,
  sourceDialect,
  onApplySql,
}) => {
  const dialects = ['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'BigQuery'];
  const [targetDialect, setTargetDialect] = useState<string>('PostgreSQL');
  const [copied, setCopied] = useState(false);

  const result = transpileQuery(originalSql, targetDialect);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header & Dialect Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Multi-Dialect Transpiler</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full font-sans font-bold">
                Auto-convert
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert syntax between PostgreSQL, MySQL, SQLite, T-SQL, and BigQuery
            </p>
          </div>
        </div>

        {/* Target Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          {dialects.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setTargetDialect(d)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                targetDialect === d
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Transpiled Code Output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-heading font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Transpiled Output ({targetDialect}):
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onApplySql && (
              <button
                onClick={() => onApplySql(result.sql)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
              >
                <span>Use in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto shadow-inner leading-relaxed">
          <code>{result.sql}</code>
        </div>

        {/* Transpilation Notes */}
        {result.notes.length > 0 && (
          <div className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 p-3 rounded-xl space-y-1">
            <span className="text-[11px] font-heading font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-purple-500" /> Dialect Translation Notes:
            </span>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
              {result.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
