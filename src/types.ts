export type Dialect = 'Auto-detect' | 'PostgreSQL' | 'MySQL' | 'SQLite' | 'SQL Server';

export type Depth = 'Beginner' | 'Technical';

export interface ExplanationStep {
  stepNumber: number;
  title: string;
  clause: string;
  explanation: string;
  lineStart?: number;
  lineEnd?: number;
  performanceTip?: string;
}

export interface AntiPatternItem {
  issue: string;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface FlowNode {
  id: string;
  label: string;
  type: 'source' | 'join' | 'filter' | 'aggregate' | 'output';
  details: string;
}

export interface SchemaColumn {
  columnName: string;
  dataType: string;
  description: string;
  sampleValue: string;
}

export interface ComplexityInfo {
  score: number;
  rating: 'Low' | 'Moderate' | 'High' | 'Critical';
  reasoning: string;
  estimatedJoinDepth: number;
  subqueryNestingLevel: number;
}

export interface DialectConversions {
  postgresql?: string;
  mysql?: string;
  sqlite?: string;
  sqlServer?: string;
}

export interface ExplanationResult {
  isValidSql: boolean;
  errorMessage?: string | null;
  summary?: string;
  tablesInvolved?: string[];
  detectedDialect?: string;
  steps?: ExplanationStep[];
  provider?: string;
  // Advanced Value-Add Features
  antiPatterns?: AntiPatternItem[];
  optimizedSql?: string | null;
  optimizationNotes?: string | null;
  flowNodes?: FlowNode[];
  outputSchema?: SchemaColumn[];
  complexityInfo?: ComplexityInfo;
  dialectConversions?: DialectConversions;
}

export interface QueryHistoryItem {
  id: string;
  timestamp: number;
  query: string;
  dialect: Dialect;
  depth: Depth;
  summary?: string;
  isValidSql: boolean;
  stepCount?: number;
}

export interface SampleQuery {
  id: string;
  title: string;
  description: string;
  badge: string;
  dialect: Dialect;
  query: string;
}
