import React, { useState } from 'react';
import { Dialect, Depth, ExplanationResult } from '../types';
import { X, Link, Check, Copy, FileText, Share2 } from 'lucide-react';
import { generateMarkdownExplanation } from '../utils/markdown';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  dialect: Dialect;
  depth: Depth;
  explanationResult: ExplanationResult | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  query,
  dialect,
  depth,
  explanationResult,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'markdown'>('link');

  if (!isOpen) return null;

  // Build encoded share URL
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (dialect) params.set('dialect', dialect);
  if (depth) params.set('depth', depth);
  const shareUrl = `${baseUrl}?${params.toString()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMarkdown = () => {
    if (!explanationResult) return;
    const md = generateMarkdownExplanation(query, explanationResult, dialect, depth);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Share SQL Explanation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share query link or copy formatted Markdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-1">
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('link')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeTab === 'link'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" /> Shareable Link
            </button>
            {explanationResult && (
              <button
                onClick={() => setActiveTab('markdown')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                  activeTab === 'markdown'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Markdown Walkthrough
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'link' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Anyone with this URL will load this exact SQL query with pre-configured dialect and explanation depth settings.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-slate-100 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700 px-3 py-2.5 rounded-xl outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Copy the complete walkthrough formatted as Markdown for Notion, GitHub PRs, or documentation.
              </p>

              {explanationResult && (
                <div className="max-h-48 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 whitespace-pre-wrap">
                  {generateMarkdownExplanation(query, explanationResult, dialect, depth)}
                </div>
              )}

              <button
                onClick={handleCopyMarkdown}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                {copiedMd ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMd ? 'Copied Markdown' : 'Copy All as Markdown'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
