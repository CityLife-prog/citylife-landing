import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all projects and reviews
    const projects = await db.getProjects();
    const reviews = await db.getReviews(false); // Get all reviews including inactive

    let updatedCount = 0;
    const updates = [];

    // Try to match reviews to projects by project_name
    for (const review of reviews) {
      if (!review.project_id && review.project_name) {
        // Find matching project by name
        const matchingProject = projects.find((p: any) =>
          p.name.toLowerCase() === review.project_name.toLowerCase()
        );

        if (matchingProject) {
          updates.push({
            reviewId: review.id,
            projectId: matchingProject.id,
            reviewName: review.project_name,
            projectName: matchingProject.name
          });

          // Update the review with the project_id
          await db.updateReview(review.id, { project_id: matchingProject.id });
          updatedCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully linked ${updatedCount} reviews to projects`,
      updates: updates
    });
  } catch (error) {
    console.error('Error fixing reviews:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
