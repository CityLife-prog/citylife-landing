import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all projects and reviews for public display
    const allProjects = await db.getProjects();
    const allReviews = await db.getReviews(true); // Only active reviews

    console.log('All projects:', allProjects.length);
    console.log('All reviews:', allReviews.length);
    console.log('Sample project IDs:', allProjects.slice(0, 3).map((p: any) => ({ id: p.id, type: typeof p.id })));
    console.log('Sample review project_ids:', allReviews.slice(0, 3).map((r: any) => ({ project_id: r.project_id, type: typeof r.project_id })));

    // Filter for completed projects only
    const completedProjects = allProjects
      .filter((p: any) => p.status === 'completed')
      .sort((a: any, b: any) => {
        // Sort by featured status first, then by updated_at
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

    // Map reviews to projects
    const projectsWithReviews = completedProjects.map((project: any) => {
      // Find review for this project - convert both to numbers for comparison
      const review = allReviews.find((r: any) => Number(r.project_id) === Number(project.id));
      console.log(`Project ${project.id} (${project.name}): Found review = ${!!review}`);

      return {
        id: project.id,
        name: project.name,
        display_title: project.display_title,
        client: project.client,
        description: project.description,
        technologies: project.technologies,
        key_results: project.key_results,
        live_url: project.live_url,
        category: project.category,
        status: project.status,
        budget: project.budget,
        timeline: project.timeline,
        progress: project.progress,
        review: review ? {
          id: review.id,
          client_name: review.client_name,
          client_title: review.client_title,
          client_company: review.client_company,
          rating: review.rating,
          review_text: review.review_text,
          image_url: review.image_url,
          featured: review.featured
        } : null
      };
    });

    // Calculate stats
    const totalProjects = allProjects.length;
    const totalCompleted = completedProjects.length;
    const totalRevenue = completedProjects.reduce((sum: number, p: any) => sum + (p.total_spent || p.budget || 0), 0);

    // Clients satisfied = number of completed projects
    const clientsSatisfied = totalCompleted;

    // Calculate average star rating from reviews
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length
      : 5.0;

    res.status(200).json({
      success: true,
      projects: projectsWithReviews,
      stats: {
        totalProjects,
        completedProjects: totalCompleted,
        clientsSatisfied,
        totalRevenue,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: allReviews.length,
        foundingYear: 2025
      }
    });

  } catch (error) {
    console.error('Error fetching public projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}