import React from 'react';
import { FlowNode } from '../types';
import { Database, Filter, Layers, PieChart, ArrowRight, Table, Sparkles } from 'lucide-react';

interface VisualFlowProps {
  nodes?: FlowNode[];
  tablesInvolved?: string[];
  summary?: string;
}

export const VisualFlow: React.FC<VisualFlowProps> = ({ nodes, tablesInvolved, summary }) => {
  // If AI didn't return custom nodes, generate baseline pipeline nodes from tablesInvolved
  const displayNodes: FlowNode[] = nodes && nodes.length > 0 ? nodes : [
    {
      id: 'f1',
      label: tablesInvolved && tablesInvolved.length > 0 ? `Data Sources: ${tablesInvolved.join(', ')}` : 'Source Tables',
      type: 'source',
      details: 'Reads rows from target tables into memory buffer'
    },
    {
      id: 'f2',
      label: 'Joins & Key Matching',
      type: 'join',
      details: 'Evaluates relational ON conditions across tables'
    },
    {
      id: 'f3',
      label: 'WHERE Filtering & Predicates',
      type: 'filter',
      details: 'Filters non-matching rows prior to aggregation'
    },
    {
      id: 'f4',
      label: 'Projection & SELECT Result',
      type: 'output',
      details: summary || 'Returns formatted target column set'
    }
  ];

  const getNodeIcon = (type: FlowNode['type']) => {
    switch (type) {
      case 'source':
        return <Database className="w-4 h-4 text-emerald-500" />;
      case 'join':
        return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'filter':
        return <Filter className="w-4 h-4 text-amber-500" />;
      case 'aggregate':
        return <PieChart className="w-4 h-4 text-purple-500" />;
      case 'output':
        return <Table className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNodeBadgeColor = (type: FlowNode['type']) => {
    switch (type) {
      case 'source':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-emerald-700 dark:text-emerald-400';
      case 'join':
        return 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 text-indigo-700 dark:text-indigo-400';
      case 'filter':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-700 dark:text-amber-400';
      case 'aggregate':
        return 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 text-purple-700 dark:text-purple-400';
      case 'output':
        return 'bg-purple-100 dark:bg-purple-950 border-purple-300 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Visual SQL Pipeline & Data Flow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Step-by-step logical transformation of rows from source tables to output records
          </p>
        </div>
      </div>

      {/* Visual Flow Node Timeline */}
      <div className="relative space-y-4 before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {displayNodes.map((node, index) => (
          <div key={node.id || index} className="relative flex items-start gap-4 pl-2 group">
            {/* Step Icon Node */}
            <div className={`z-10 w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-110 ${getNodeBadgeColor(node.type)}`}>
              {getNodeIcon(node.type)}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl transition-all group-hover:border-purple-500/40">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {node.label}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Stage {index + 1}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                {node.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
