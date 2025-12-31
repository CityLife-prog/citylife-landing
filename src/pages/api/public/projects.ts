import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all projects for public display
    const allProjects = await db.getProjects();
    
    // Filter and format for public consumption
    const publicProjects = allProjects.map((project: any) => ({
      id: project.id,
      name: project.name,
      client: project.client,
      status: project.status,
      budget: project.budget,
      timeline: project.timeline,
      progress: project.progress
    }));

    // Calculate stats
    const totalProjects = allProjects.length;
    const completedProjects = allProjects.filter((p: any) => p.status === 'completed');
    const totalRevenue = completedProjects.reduce((sum: number, p: any) => sum + p.budget, 0);
    
    // Get client satisfaction (assuming 100% for completed projects)
    const satisfactionRate = completedProjects.length > 0 ? 100 : 0;

    res.status(200).json({
      success: true,
      projects: publicProjects,
      stats: {
        totalProjects,
        completedProjects: completedProjects.length,
        totalRevenue,
        satisfactionRate,
        foundingYear: 2025
      }
    });

  } catch (error) {
    console.error('Error fetching public projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}