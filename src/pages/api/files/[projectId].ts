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

// Authorization helper
async function canAccessProject(user: any, projectId: number) {
  if (!user) return false;

  // Admin can access all projects
  if (user.role === 'admin') return true;

  // Client can only access their own projects
  if (user.role === 'client') {
    const project = await db.getProject(projectId) as any;
    return project && project.client_id === user.id;
  }

  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { projectId } = req.query;
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const projectIdNum = parseInt(projectId as string);
  if (!await canAccessProject(user, projectIdNum)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (req.method === 'GET') {
    try {
      const files = await db.getProjectFiles(projectIdNum);
      res.status(200).json({ success: true, files });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}