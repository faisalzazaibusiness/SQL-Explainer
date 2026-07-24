/**
 * SQL Keyword Capitalization and Formatting Engine
 */
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
  'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'INTERSECT',
  'EXCEPT', 'WITH', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'ILIKE', 'IS NULL',
  'IS NOT NULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST', 'OVER', 'PARTITION BY', 'DENSE_RANK',
  'ROW_NUMBER', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF', 'DATE_TRUNC', 'ASC', 'DESC'
];

const MAJOR_CLAUSES = [
  'SELECT', 'FROM', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
  'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'WITH'
];

export function formatSqlQuick(sql: string): string {
  if (!sql || sql.trim().length === 0) return sql;

  let formatted = sql.trim();

  // 1. Capitalize keywords
  SQL_KEYWORDS.forEach((kw) => {
    const regex = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  });

  // 2. Put major clauses on newlines if query is single-line or unformatted
  MAJOR_CLAUSES.forEach((clause) => {
    const regex = new RegExp(`(?<!^|\\n)\\s+(${clause})\\b`, 'g');
    formatted = formatted.replace(regex, `\n$1`);
  });

  // 3. Clean trailing whitespace per line
  formatted = formatted
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  return formatted;
}
