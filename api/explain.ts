import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleExplainRequest } from '../src/server/explainService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { query, dialect = 'Auto-detect', depth = 'Beginner' } = req.body || {};

  try {
    const response = await handleExplainRequest(query, dialect, depth);
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(500).json({
      error: 'Failed to process SQL explanation on Vercel.',
      details: error?.message || 'Server error',
    });
  }
}
