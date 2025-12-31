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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Only admins can create projects
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied - admin only' });
  }

  try {
    const { name, client, client_id, status, budget, timeline, progress } = req.body;

    if (!name || !budget) {
      return res.status(400).json({ error: 'Name and budget are required' });
    }

    if (!client && !client_id) {
      return res.status(400).json({ error: 'Client selection is required' });
    }

    const result = await db.createProject({
      name,
      client: client || 'Unknown Client',
      clientId: client_id || 'admin-1', // Use provided client_id or default to admin
      status: status || 'planning',
      budget: parseInt(budget),
      timeline: timeline || '4 weeks',
      progress: progress || 0
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}