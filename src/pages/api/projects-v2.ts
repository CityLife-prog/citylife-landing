import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

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
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'GET') {
    try {
      // Direct SQL query
      const result = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      const projects = result.rows || [];

      // If client role, filter to only their projects
      const filteredProjects = user.role === 'client'
        ? projects.filter((p: any) => p.client_id === user.id)
        : projects;

      res.status(200).json({
        success: true,
        projects: filteredProjects,
        _version: 'projects-v2',
        _timestamp: new Date().toISOString(),
        _count: filteredProjects.length
      });
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
