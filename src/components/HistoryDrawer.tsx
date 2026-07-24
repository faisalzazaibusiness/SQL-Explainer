import React, { useState } from 'react';
import { QueryHistoryItem } from '../types';
import {
  X,
  History,
  Trash2,
  Search,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryHistoryItem[];
  onLoadItem: (item: QueryHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.query.toLowerCase().includes(term) ||
      (item.summary && item.summary.toLowerCase().includes(term)) ||
      item.dialect.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Query History</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {history.length} {history.length === 1 ? 'saved query' : 'saved queries'} in localStorage
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Actions */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history by query or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-2 rounded-xl focus:border-indigo-500 outline-none transition placeholder:text-slate-400"
              />
            </div>

            {history.length > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Showing {filteredHistory.length} items</span>
                <button
                  onClick={onClearAll}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All History
                </button>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/40">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {searchTerm ? 'No history matching your search.' : 'No saved query history yet.'}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  When you explain queries, they will automatically be saved here for quick reloading.
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="pt-3 first:pt-0 group bg-slate-50/80 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-300 dark:border-slate-700">
                          {item.dialect}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-slate-300 dark:border-slate-700">
                          {item.depth}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.summary ? (
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {item.summary}
                      </p>
                    ) : (
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.query}
                      </p>
                    )}

                    <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 overflow-hidden">
                      {item.query}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      {item.isValidSql ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                      )}
                      <span>{item.isValidSql ? 'Valid SQL' : 'Syntax Issue'}</span>
                    </span>

                    <button
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1 transition"
                    >
                      <span>Load Query</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
