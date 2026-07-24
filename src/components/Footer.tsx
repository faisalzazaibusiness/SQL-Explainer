import React from 'react';
import { Database, Heart, Sparkles, Github, Code2, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 px-4 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand & Credit */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold shadow-sm">
            <Database className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              SQL Explainer
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by{' '}
              <strong className="text-slate-900 dark:text-white font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                Faisal Zazai
              </strong>
            </span>
          </div>
        </div>

        {/* Feature Badges / Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] border border-slate-200/60 dark:border-slate-700/60">
            <Cpu className="w-3 h-3 text-indigo-500" /> AI Engine v2.5
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] border border-slate-200/60 dark:border-slate-700/60">
            <Code2 className="w-3 h-3 text-emerald-500" /> Multi-Dialect
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">
            © {new Date().getFullYear()} SQL Explainer
          </span>
        </div>
      </div>
    </footer>
  );
};
