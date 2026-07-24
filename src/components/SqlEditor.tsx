import React, { useRef, useEffect } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { Copy, Check, Wand2, Eraser, Code2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatSqlQuick } from '../utils/formatter';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onExplain: () => void;
  selectedLineRange?: { start: number; end: number } | null;
  disabled?: boolean;
  isDarkMode?: boolean;
  maxCharLimit?: number;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onExplain,
  selectedLineRange,
  disabled = false,
  isDarkMode = true,
  maxCharLimit = 10000,
}) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const [copied, setCopied] = React.useState(false);

  const linesCount = value ? value.split('\n').length : 0;
  const charCount = value ? value.length : 0;
  const isOverLimit = charCount > maxCharLimit;
  const isNearLimit = charCount > maxCharLimit * 0.85;

  useEffect(() => {
    if (selectedLineRange && editorRef.current?.view) {
      const view = editorRef.current.view;
      const doc = view.state.doc;

      const startLine = Math.max(1, Math.min(selectedLineRange.start, doc.lines));
      const endLine = Math.max(startLine, Math.min(selectedLineRange.end, doc.lines));

      const lineStartObj = doc.line(startLine);
      const lineEndObj = doc.line(endLine);

      view.dispatch({
        selection: { anchor: lineStartObj.from, head: lineEndObj.to },
        scrollIntoView: true,
      });

      view.focus();
    }
  }, [selectedLineRange]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickFormat = () => {
    if (!value) return;
    const formatted = formatSqlQuick(value);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim().length >= 5 && !disabled && !isOverLimit) {
        onExplain();
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-[#0f1118] border rounded-2xl overflow-hidden shadow-xs transition-all duration-200 ${
        isOverLimit
          ? 'border-rose-500/80 ring-2 ring-rose-500/20'
          : 'border-slate-200 dark:border-slate-800/80 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/20'
      }`}
      onKeyDown={handleKeyDown}
    >
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-lg">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-heading font-extrabold text-slate-900 dark:text-white">
            SQL Query Input
          </span>
          {linesCount > 0 && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              ({linesCount} {linesCount === 1 ? 'line' : 'lines'})
            </span>
          )}
        </div>

        {/* Action Controls & Guardrail Stats */}
        <div className="flex items-center gap-2">
          {/* Character Guardrail Counter */}
          <div
            className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 ${
              isOverLimit
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : isNearLimit
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            {isOverLimit ? (
              <AlertTriangle className="w-3 h-3 text-rose-500" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            )}
            <span>
              {charCount.toLocaleString()} / {maxCharLimit.toLocaleString()} chars
            </span>
          </div>

          {value && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleQuickFormat}
                className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1 text-[11px] font-medium"
                title="Capitalize SQL Keywords"
              >
                <Wand2 className="w-3 h-3 text-purple-500" />
                <span className="hidden sm:inline">Format</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1 text-[11px] font-medium"
                title="Copy SQL text"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition text-[11px]"
                title="Clear input"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CodeMirror Text Area */}
      <div className="relative flex-1 min-h-[300px] text-sm font-mono overflow-auto bg-slate-50/40 dark:bg-slate-950/80 p-2">
        <CodeMirror
          ref={editorRef}
          value={value}
          height="100%"
          extensions={[sql()]}
          onChange={(val) => onChange(val)}
          placeholder="Type or paste any SQL query here... (e.g. SELECT u.id, COUNT(o.id) FROM users u JOIN orders o ON...)"
          theme={isDarkMode ? 'dark' : 'light'}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightActiveLine: true,
          }}
          className="h-full text-sm font-mono text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Footer bar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono border border-slate-300 dark:border-slate-700 text-[10px] font-bold">
            ⌘ + Enter
          </kbd>
          <span>to trigger explanation</span>
        </span>

        {selectedLineRange && (
          <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">
            Highlighting lines {selectedLineRange.start}-{selectedLineRange.end}
          </span>
        )}
      </div>
    </div>
  );
};
