import React, { useState } from 'react';
import { ExplanationResult, Depth, Dialect } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Table,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Zap,
  Printer,
  Code,
  Gauge,
  ArrowRightLeft
} from 'lucide-react';
import { generateMarkdownExplanation, generateTextExplanation, generateCommentedSql } from '../utils/markdown';
import { VisualFlow } from './VisualFlow';
import { QueryOptimizer } from './QueryOptimizer';
import { SchemaPreview } from './SchemaPreview';
import { ComplexityCard } from './ComplexityCard';
import { DialectTranspiler } from './DialectTranspiler';
import { analyzeComplexity } from '../utils/complexity';

interface ExplanationViewProps {
  result: ExplanationResult;
  query: string;
  dialect: Dialect;
  depth: Depth;
  onSelectStepLineRange: (range: { start: number; end: number }) => void;
  selectedStepNumber: number | null;
  setSelectedStepNumber: (num: number | null) => void;
  onApplyOptimizedSql?: (sql: string) => void;
}

export const ExplanationView: React.FC<ExplanationViewProps> = ({
  result,
  query,
  dialect,
  depth,
  onSelectStepLineRange,
  selectedStepNumber,
  setSelectedStepNumber,
  onApplyOptimizedSql = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'visual' | 'optimizer' | 'schema' | 'complexity' | 'transpiler'>('walkthrough');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedCommentedSql, setCopiedCommentedSql] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const computedComplexity = result.complexityInfo || analyzeComplexity(query);

  React.useEffect(() => {
    if (result.steps) {
      const initial: Record<number, boolean> = {};
      result.steps.forEach((s) => {
        initial[s.stepNumber] = true;
      });
      setExpandedSteps(initial);
    }
  }, [result]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const handleToggleExpandAll = () => {
    if (!result.steps) return;
    const allExpanded = result.steps.every((s) => expandedSteps[s.stepNumber]);
    const updated: Record<number, boolean> = {};
    result.steps.forEach((s) => {
      updated[s.stepNumber] = !allExpanded;
    });
    setExpandedSteps(updated);
  };

  const handleCopyMd = () => {
    const md = generateMarkdownExplanation(query, result, dialect, depth);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyCommentedSql = () => {
    const commented = generateCommentedSql(query, result);
    navigator.clipboard.writeText(commented);
    setCopiedCommentedSql(true);
    setTimeout(() => setCopiedCommentedSql(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // If Invalid SQL was returned
  if (!result.isValidSql) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-6 shadow-sm text-rose-900 dark:text-rose-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/60 rounded-xl border border-rose-300 dark:border-rose-700/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-heading font-extrabold text-rose-900 dark:text-rose-100 mb-1">
              Invalid or Unparseable SQL Query
            </h3>
            <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-4 font-sans">
              {result.errorMessage || 'The input could not be recognized as valid SQL syntax. Please check for typos, unclosed quotes, or missing clauses.'}
            </p>
            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-rose-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 overflow-x-auto">
              <code>{query}</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Overview Card */}
      <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid SQL
            </span>
            {result.detectedDialect && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                <Layers className="w-3.5 h-3.5" /> {result.detectedDialect}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {depth} Depth
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Gauge className="w-3.5 h-3.5" /> {computedComplexity.rating} Complexity
            </span>
          </div>

          {result.provider && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              <span>Engine: {result.provider}</span>
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-heading font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Plain-English Query Overview
            </h3>
            <p className="text-sm sm:text-base font-heading font-extrabold text-slate-900 dark:text-slate-100 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {result.tablesInvolved && result.tablesInvolved.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-purple-500" />
                Referenced Tables:
              </span>
              {result.tablesInvolved.map((tbl) => (
                <span
                  key={tbl}
                  className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {tbl}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs for Deep Analysis */}
      <div className="bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-slate-800/80 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('walkthrough')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'walkthrough'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Walkthrough</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'visual'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visual Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('optimizer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'optimizer'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Optimizer</span>
            {result.antiPatterns && result.antiPatterns.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('complexity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'complexity'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Complexity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transpiler')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'transpiler'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transpiler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Output Schema</span>
          </button>
        </div>

        {/* Quick Exports Suite */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={handleCopyCommentedSql}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"
            title="Copy SQL with step explanations embedded as comments"
          >
            {copiedCommentedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code className="w-3.5 h-3.5 text-purple-500" />}
            <span>{copiedCommentedSql ? 'Copied' : 'Annotated SQL'}</span>
          </button>

          <button
            onClick={handleCopyMd}
            className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900 border border-purple-200 dark:border-purple-800 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5"
            title="Copy formatted Markdown report"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied' : 'Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Print or save as PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab 1: Walkthrough View */}
      {activeTab === 'walkthrough' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h3 className="text-xs font-heading font-extrabold text-slate-700 dark:text-slate-300 tracking-wide uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Step-by-Step Logical Execution
            </h3>

            <button
              onClick={handleToggleExpandAll}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            >
              {result.steps?.every((s) => expandedSteps[s.stepNumber]) ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="space-y-3">
            {result.steps?.map((step) => {
              const isExpanded = expandedSteps[step.stepNumber] ?? true;
              const isSelected = selectedStepNumber === step.stepNumber;

              return (
                <div
                  key={step.stepNumber}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'bg-white dark:bg-[#0f1118] border-purple-500 shadow-md ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-[#0f1118] hover:border-purple-300 dark:hover:border-purple-800 border-slate-200 dark:border-slate-800/80 shadow-xs'
                  }`}
                >
                  {/* Step Header */}
                  <div
                    onClick={() => {
                      toggleStep(step.stepNumber);
                      setSelectedStepNumber(step.stepNumber);
                      if (step.lineStart && step.lineEnd) {
                        onSelectStepLineRange({ start: step.lineStart, end: step.lineEnd });
                      }
                    }}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {step.stepNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-heading font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{step.title}</span>
                          {step.lineStart && step.lineEnd && (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                              Lines {step.lineStart}-{step.lineEnd}
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hidden sm:inline opacity-0 hover:opacity-100 transition-opacity">
                        Highlight code lines
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Step Body */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                      {/* Clause Snippet */}
                      {step.clause && (
                        <div className="relative group">
                          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl font-mono text-xs text-purple-700 dark:text-purple-300 overflow-x-auto">
                            <code>{step.clause}</code>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (step.lineStart && step.lineEnd) {
                                onSelectStepLineRange({ start: step.lineStart, end: step.lineEnd });
                                setSelectedStepNumber(step.stepNumber);
                              }
                            }}
                            className="absolute right-2 top-2 text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-purple-600 text-slate-700 dark:text-slate-300 hover:text-white px-2 py-1 rounded-lg transition flex items-center gap-1 font-bold shadow-xs"
                            title="Highlight clause in SQL editor"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Locate Lines</span>
                          </button>
                        </div>
                      )}

                      {/* Explanation Text */}
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                        {step.explanation}
                      </p>

                      {/* Technical Tip */}
                      {step.performanceTip && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5">Performance Note:</span>
                            <span>{step.performanceTip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Flow */}
      {activeTab === 'visual' && (
        <VisualFlow
          nodes={result.flowNodes}
          tablesInvolved={result.tablesInvolved}
          summary={result.summary}
        />
      )}

      {/* Tab 3: Query Optimizer */}
      {activeTab === 'optimizer' && (
        <QueryOptimizer
          originalSql={query}
          antiPatterns={result.antiPatterns}
          optimizedSql={result.optimizedSql}
          optimizationNotes={result.optimizationNotes}
          onApplyOptimizedSql={onApplyOptimizedSql}
        />
      )}

      {/* Tab 4: Complexity Meter */}
      {activeTab === 'complexity' && (
        <ComplexityCard complexity={computedComplexity} />
      )}

      {/* Tab 5: Multi-Dialect Transpiler */}
      {activeTab === 'transpiler' && (
        <DialectTranspiler
          originalSql={query}
          sourceDialect={result.detectedDialect || dialect}
          onApplySql={onApplyOptimizedSql}
        />
      )}

      {/* Tab 6: Schema Simulator */}
      {activeTab === 'schema' && (
        <SchemaPreview
          columns={result.outputSchema}
          tablesInvolved={result.tablesInvolved}
        />
      )}
    </div>
  );
};
