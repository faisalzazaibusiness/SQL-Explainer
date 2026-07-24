import React from 'react';
import { SAMPLE_QUERIES } from '../data/samples';
import { SampleQuery } from '../types';
import { Sparkles, Code, ArrowRight } from 'lucide-react';

interface SampleGalleryProps {
  onSelectSample: (sample: SampleQuery) => void;
}

export const SampleGallery: React.FC<SampleGalleryProps> = ({ onSelectSample }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
          Sample Queries Gallery
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          • Try one click to see how it works
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SAMPLE_QUERIES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample)}
            className="group relative bg-slate-50 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl text-left transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/60 dark:border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                  {sample.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  {sample.dialect}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                {sample.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {sample.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-semibold">
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3" /> Load Query
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
