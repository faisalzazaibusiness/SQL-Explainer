import { ExplanationResult, Dialect, Depth } from '../types';

export function generateMarkdownExplanation(
  query: string,
  result: ExplanationResult,
  dialect: Dialect,
  depth: Depth
): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  let md = `# SQL Query Explanation Walkthrough\n\n`;
  md += `**Generated on:** ${dateStr}  \n`;
  md += `**Target Dialect:** ${result.detectedDialect || dialect}  \n`;
  md += `**Explanation Depth:** ${depth}  \n`;
  if (result.provider) {
    md += `**AI Engine:** ${result.provider}  \n`;
  }
  md += `\n---\n\n`;

  if (!result.isValidSql) {
    md += `### ⚠️ Invalid SQL Query\n\n`;
    md += `${result.errorMessage || 'The query could not be parsed as valid SQL syntax.'}\n\n`;
    md += `\`\`\`sql\n${query}\n\`\`\`\n`;
    return md;
  }

  md += `## 📌 Summary\n\n`;
  md += `${result.summary || 'Summary not available.'}\n\n`;

  if (result.tablesInvolved && result.tablesInvolved.length > 0) {
    md += `**Tables & Views Referenced:** \`${result.tablesInvolved.join('`, `')}\`  \n\n`;
  }

  md += `## 🔍 Step-by-Step Execution Walkthrough\n\n`;

  if (result.steps && result.steps.length > 0) {
    result.steps.forEach((step) => {
      md += `### Step ${step.stepNumber}: ${step.title}\n\n`;
      if (step.clause) {
        md += `\`\`\`sql\n${step.clause}\n\`\`\`\n\n`;
      }
      md += `${step.explanation}\n\n`;

      if (step.performanceTip) {
        md += `> 💡 **Performance Note:** ${step.performanceTip}\n\n`;
      }
    });
  }

  md += `---\n\n`;
  md += `## 📄 Original SQL Query\n\n`;
  md += `\`\`\`sql\n${query}\n\`\`\`\n\n`;
  md += `*Generated with [SQL Explainer](https://sqlexplainer.app)*\n`;

  return md;
}

export function generateTextExplanation(
  query: string,
  result: ExplanationResult
): string {
  if (!result.isValidSql) {
    return `SQL Explainer Error:\n${result.errorMessage || 'Invalid SQL'}\n\nOriginal Query:\n${query}`;
  }

  let text = `SQL QUERY EXPLANATION SUMMARY:\n`;
  text += `${result.summary}\n\n`;
  if (result.tablesInvolved?.length) {
    text += `Tables Referenced: ${result.tablesInvolved.join(', ')}\n\n`;
  }

  text += `STEP-BY-STEP BREAKDOWN:\n`;
  result.steps?.forEach((step) => {
    text += `[Step ${step.stepNumber}] ${step.title}\n`;
    text += `Clause: ${step.clause}\n`;
    text += `Explanation: ${step.explanation}\n`;
    if (step.performanceTip) {
      text += `Performance Note: ${step.performanceTip}\n`;
    }
    text += `\n`;
  });

  return text.trim();
}

export function generateCommentedSql(
  query: string,
  result: ExplanationResult
): string {
  if (!result.steps || result.steps.length === 0) return query;

  let header = `-- ==========================================\n`;
  header += `-- SQL EXPLAINER WALKTHROUGH\n`;
  header += `-- Summary: ${result.summary || 'SQL Query Execution'}\n`;
  header += `-- ==========================================\n\n`;

  let commentedSteps = result.steps
    .map((s) => {
      let block = `-- Step ${s.stepNumber}: ${s.title}\n`;
      block += `-- ${s.explanation.replace(/\n/g, '\n-- ')}\n`;
      if (s.clause) {
        block += `${s.clause};\n`;
      }
      return block;
    })
    .join('\n');

  return header + commentedSteps;
}
