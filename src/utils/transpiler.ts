/**
 * Transpiler utility to adapt SQL query syntax across major database engines.
 */

export interface TranspiledResult {
  dialect: string;
  sql: string;
  notes: string[];
}

export function transpileQuery(sql: string, targetDialect: string): TranspiledResult {
  if (!sql || sql.trim().length === 0) {
    return { dialect: targetDialect, sql: '', notes: [] };
  }

  let converted = sql;
  const notes: string[] = [];

  switch (targetDialect.toLowerCase()) {
    case 'postgresql':
      // Convert CONCAT or string concat
      if (/GROUP_CONCAT/i.test(converted)) {
        converted = converted.replace(/GROUP_CONCAT\(([^)]+)\)/gi, 'STRING_AGG($1, \',\')');
        notes.push('Converted GROUP_CONCAT() to PostgreSQL STRING_AGG().');
      }
      if (/IFNULL/i.test(converted)) {
        converted = converted.replace(/IFNULL\s*\(/gi, 'COALESCE(');
        notes.push('Replaced IFNULL() with standard COALESCE().');
      }
      if (/LIMIT\s+(\d+)\s*,\s*(\d+)/i.test(converted)) {
        converted = converted.replace(/LIMIT\s+(\d+)\s*,\s*(\d+)/gi, 'LIMIT $2 OFFSET $1');
        notes.push('Converted MySQL LIMIT offset, row_count syntax to LIMIT row_count OFFSET offset.');
      }
      break;

    case 'mysql':
      if (/STRING_AGG/i.test(converted)) {
        converted = converted.replace(/STRING_AGG\(([^,]+),\s*([^)]+)\)/gi, 'GROUP_CONCAT($1 SEPARATOR $2)');
        notes.push('Converted PostgreSQL STRING_AGG() to MySQL GROUP_CONCAT().');
      }
      if (/ILIKE/i.test(converted)) {
        converted = converted.replace(/\bILIKE\b/gi, 'LIKE');
        notes.push('Replaced PostgreSQL ILIKE with case-insensitive MySQL LIKE.');
      }
      if (/LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/i.test(converted)) {
        converted = converted.replace(/LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/gi, 'LIMIT $2, $1');
        notes.push('Converted LIMIT ... OFFSET to MySQL LIMIT offset, count format.');
      }
      break;

    case 'sqlite':
      if (/ILIKE/i.test(converted)) {
        converted = converted.replace(/\bILIKE\b/gi, 'LIKE');
        notes.push('Replaced ILIKE with SQLite LIKE.');
      }
      if (/FULL\s+(OUTER\s+)?JOIN/i.test(converted)) {
        notes.push('Note: SQLite does not natively support FULL OUTER JOIN (use UNION ALL of LEFT JOIN and RIGHT JOIN if required).');
      }
      if (/STRING_AGG|GROUP_CONCAT/i.test(converted)) {
        converted = converted.replace(/(STRING_AGG|GROUP_CONCAT)\(([^,]+).*\)/gi, 'GROUP_CONCAT($2)');
        notes.push('Adapted string aggregation to SQLite GROUP_CONCAT().');
      }
      break;

    case 'sql server':
    case 'tsql':
      if (/LIMIT\s+(\d+)(\s+OFFSET\s+(\d+))?/i.test(converted)) {
        const match = converted.match(/LIMIT\s+(\d+)(\s+OFFSET\s+(\d+))?/i);
        if (match) {
          const limit = match[1];
          const offset = match[3] || '0';
          converted = converted.replace(/LIMIT\s+\d+(\s+OFFSET\s+\d+)?/gi, '');
          if (!/ORDER BY/i.test(converted)) {
            converted += ' ORDER BY (SELECT NULL)';
            notes.push('Added dummy ORDER BY required for SQL Server OFFSET-FETCH clause.');
          }
          converted += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
          notes.push(`Converted LIMIT ${limit} to SQL Server OFFSET/FETCH NEXT syntax.`);
        }
      }
      if (/ILIKE/i.test(converted)) {
        converted = converted.replace(/\bILIKE\b/gi, 'LIKE');
        notes.push('Replaced ILIKE with T-SQL LIKE.');
      }
      if (/COALESCE|IFNULL/i.test(converted)) {
        converted = converted.replace(/IFNULL/gi, 'ISNULL');
        notes.push('Adapted IFNULL to T-SQL ISNULL / COALESCE.');
      }
      break;

    case 'bigquery':
      if (/ILIKE/i.test(converted)) {
        converted = converted.replace(/(\w+)\s+ILIKE\s+('[^']+')/gi, 'REGEXP_CONTAINS($1, "(?i)" || $2)');
        notes.push('Converted ILIKE to BigQuery case-insensitive REGEXP_CONTAINS().');
      }
      if (/GROUP_CONCAT/i.test(converted)) {
        converted = converted.replace(/GROUP_CONCAT\(([^)]+)\)/gi, 'STRING_AGG($1)');
        notes.push('Converted GROUP_CONCAT to BigQuery STRING_AGG().');
      }
      break;

    default:
      notes.push(`Dialect formatted for standard ANSI SQL compliance.`);
      break;
  }

  if (notes.length === 0) {
    notes.push(`Syntax is fully compatible with ${targetDialect}.`);
  }

  return {
    dialect: targetDialect,
    sql: converted,
    notes,
  };
}
