import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/database';

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

// Force cache invalidation - v2
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.method === 'GET') {
    try {
      const projects = await db.getProjects();
      console.log('[DEBUG] db.getProjects() returned:', typeof projects, Array.isArray(projects), projects);

      // Ensure projects is always an array
      const projectsArray = Array.isArray(projects) ? projects : [];
      console.log('[DEBUG] projectsArray:', projectsArray.length, 'items');

      // If client role, filter to only their projects
      const filteredProjects = user.role === 'client'
        ? projectsArray.filter((p: any) => p.client_id === user.id)
        : projectsArray;

      console.log('[DEBUG] filteredProjects:', filteredProjects.length, 'items');
      console.log('[DEBUG] user.role:', user.role);

      res.status(200).json({
        success: true,
        projects: filteredProjects,
        // Temporary debug info - will remove after diagnosing
        _debug: {
          rawType: typeof projects,
          isArray: Array.isArray(projects),
          rawLength: Array.isArray(projects) ? projects.length : 'N/A',
          arrayLength: projectsArray.length,
          filteredLength: filteredProjects.length,
          userRole: user.role,
          userId: user.id,
          rawProjects: projects
        }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
