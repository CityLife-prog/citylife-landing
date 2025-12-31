import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

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
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Only admins can delete clients
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied - admin only' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const result = await db.deleteClient(parseInt(id));

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}