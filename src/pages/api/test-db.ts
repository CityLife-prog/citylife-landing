import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Direct database query test
    const result = await sql`SELECT * FROM projects ORDER BY created_at DESC`;

    res.status(200).json({
      success: true,
      test: 'test-db endpoint',
      timestamp: new Date().toISOString(),
      rowsType: typeof result.rows,
      isArray: Array.isArray(result.rows),
      rowsLength: Array.isArray(result.rows) ? result.rows.length : 'N/A',
      rows: result.rows,
      rawResult: {
        command: result.command,
        rowCount: result.rowCount,
        fields: result.fields?.map(f => f.name)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}
