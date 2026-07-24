import { Dialect, Depth, ExplanationResult } from '../types';

export async function explainSqlQuery(
  query: string,
  dialect: Dialect,
  depth: Depth
): Promise<ExplanationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        dialect,
        depth,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errJson: any = {};
      try {
        errJson = await response.json();
      } catch (e) {
        // ignore JSON parse error
      }

      throw new Error(
        errJson.error || errJson.details || `Server responded with status ${response.status}`
      );
    }

    const data: ExplanationResult = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Explanation request timed out after 45 seconds. Please try again.');
    }
    throw error;
  }
}
