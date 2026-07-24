import { ComplexityInfo } from '../types';

/**
 * Utility to analyze cognitive and execution complexity of a SQL query.
 */
export function analyzeComplexity(query: string): ComplexityInfo {
  if (!query || query.trim().length === 0) {
    return {
      score: 10,
      rating: 'Low',
      reasoning: 'Simple query with minimal operations.',
      estimatedJoinDepth: 0,
      subqueryNestingLevel: 0,
    };
  }

  const uppercaseQuery = query.toUpperCase();

  // 1. Calculate Join Depth
  const joinMatches = uppercaseQuery.match(/\b(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN)\b/g);
  const estimatedJoinDepth = joinMatches ? joinMatches.length : 0;

  // 2. Subquery Nesting Level
  const subqueries = uppercaseQuery.match(/\(\s*SELECT/g);
  const subqueryNestingLevel = subqueries ? subqueries.length : 0;

  // 3. Aggregations & Grouping
  const hasGroupBy = uppercaseQuery.includes('GROUP BY');
  const hasHaving = uppercaseQuery.includes('HAVING');
  const aggMatches = uppercaseQuery.match(/\b(COUNT|SUM|AVG|MIN|MAX|ARRAY_AGG|STRING_AGG|GROUP_CONCAT)\b\s*\(/g);
  const aggCount = aggMatches ? aggMatches.length : 0;

  // 4. Window functions
  const windowMatches = uppercaseQuery.match(/\b(OVER|PARTITION BY|ROW_NUMBER|DENSE_RANK|RANK|LAG|LEAD)\b/g);
  const windowCount = windowMatches ? windowMatches.length : 0;

  // 5. CTEs & Set Operations
  const hasCte = uppercaseQuery.includes('WITH ');
  const setOpsMatches = uppercaseQuery.match(/\b(UNION|INTERSECT|EXCEPT)\b/g);
  const setOpsCount = setOpsMatches ? setOpsMatches.length : 0;

  // 6. Wildcards & Potential Full Scans
  const selectStar = uppercaseQuery.includes('SELECT *') || uppercaseQuery.includes('SELECT  *');
  const wildcardLike = uppercaseQuery.match(/LIKE\s+['"]%[^'"]+['"]/g);

  // Compute total raw score (capped at 100)
  let rawScore = 15;
  rawScore += estimatedJoinDepth * 15;
  rawScore += subqueryNestingLevel * 20;
  rawScore += (hasGroupBy ? 10 : 0) + (hasHaving ? 12 : 0) + aggCount * 5;
  rawScore += windowCount * 12;
  rawScore += (hasCte ? 15 : 0) + setOpsCount * 15;
  rawScore += (selectStar ? 8 : 0) + (wildcardLike ? 10 : 0);

  const score = Math.min(100, Math.max(10, rawScore));

  let rating: 'Low' | 'Moderate' | 'High' | 'Critical' = 'Low';
  if (score >= 80) rating = 'Critical';
  else if (score >= 60) rating = 'High';
  else if (score >= 35) rating = 'Moderate';

  // Build reasoning text
  const reasons: string[] = [];
  if (estimatedJoinDepth > 0) reasons.push(`${estimatedJoinDepth} JOIN operation(s)`);
  if (subqueryNestingLevel > 0) reasons.push(`${subqueryNestingLevel} nested subquery/subqueries`);
  if (windowCount > 0) reasons.push(`Window functions / analytics clauses`);
  if (hasGroupBy) reasons.push(`Aggregation & GROUP BY processing`);
  if (hasCte) reasons.push(`Common Table Expression (CTE) pipeline`);
  if (setOpsCount > 0) reasons.push(`Set operations (${setOpsCount})`);
  if (reasons.length === 0) reasons.push('Basic single-table selection');

  const reasoning = `Query involves ${reasons.join(', ')}.`;

  return {
    score,
    rating,
    reasoning,
    estimatedJoinDepth,
    subqueryNestingLevel,
  };
}
