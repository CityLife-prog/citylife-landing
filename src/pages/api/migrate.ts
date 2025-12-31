import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security: Only allow in development or with secret key
  const secret = req.headers['x-migration-secret'];

  if (process.env.NODE_ENV === 'production' && secret !== process.env.MIGRATION_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await initializeDatabase();
    res.status(200).json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    res.status(500).json({
      error: 'Migration failed',
      details: error.message
    });
  }
}
