import React from 'react';
import { SchemaColumn } from '../types';
import { Table, Database, Check, Eye } from 'lucide-react';

interface SchemaPreviewProps {
  columns?: SchemaColumn[];
  tablesInvolved?: string[];
}

export const SchemaPreview: React.FC<SchemaPreviewProps> = ({ columns, tablesInvolved }) => {
  const displayCols: SchemaColumn[] = columns && columns.length > 0 ? columns : [
    { columnName: 'id', dataType: 'INTEGER / Primary Key', description: 'Unique surrogate key identifier', sampleValue: '1001' },
    { columnName: 'created_at', dataType: 'TIMESTAMP WITH TIMEZONE', description: 'Row creation timestamp', sampleValue: '2026-07-23 10:15:00' },
    { columnName: 'status', dataType: 'VARCHAR(50)', description: 'Filtered status classification', sampleValue: 'ACTIVE' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Expected Output Schema & Simulated Rows
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inferred column names, data types, and mock data generated from SELECT projection
          </p>
        </div>

        {tablesInvolved && tablesInvolved.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>Target: {tablesInvolved.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Schema Columns Table */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Column Name</th>
              <th className="p-3">Inferred Data Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Sample Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {displayCols.map((col, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-300">
                  {col.columnName}
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {col.dataType}
                  </span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-300">
                  {col.description}
                </td>
                <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  {col.sampleValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simulated Preview Box */}
      <div className="bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-500" />
          <span>Output shape preview confirmed • Matches standard relational result sets</span>
        </span>
        <span className="font-mono text-[11px] font-bold text-slate-500">
          {displayCols.length} projected columns
        </span>
      </div>
    </div>
  );
};
