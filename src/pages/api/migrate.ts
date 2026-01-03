import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../../lib/database';

// Authentication helper
function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const userHeader = req.headers['x-user-data'];
    if (userHeader) {
      try {
        return JSON.parse(userHeader as string);
      } catch {
        return null;
      }
    }
    return null;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests for security
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Please use POST request to run migrations',
      hint: 'Use the admin dashboard or curl: curl -X POST https://www.citylyfe.net/api/migrate -H "x-user-data: {...}"'
    });
  }

  // Require admin authentication in production
  if (process.env.NODE_ENV === 'production') {
    const user = getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        error: 'Unauthorized - Admin access required',
        message: 'Please log in as admin to run migrations'
      });
    }
  }

  try {
    await initializeDatabase();
    res.status(200).json({
      success: true,
      message: 'Database migrations completed successfully! New fields added to projects table.'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    res.status(500).json({
      error: 'Migration failed',
      details: error.message
    });
  }
}
