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
  if (req.method === 'GET') {
    // GET - Fetch all reviews (admin only)
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only admins can view all reviews
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - admin only' });
    }

    try {
      const reviews = await db.getReviews(false); // Get all reviews, including inactive
      res.status(200).json({ success: true, reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // POST - Create new review
    const user = getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only admins can create reviews
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - admin only' });
    }

    try {
      const {
        client_name,
        client_title,
        client_company,
        rating,
        review_text,
        project_name,
        image_url,
        is_active,
        sort_order
      } = req.body;

      if (!client_name || !client_title || !client_company || !rating || !review_text) {
        return res.status(400).json({
          error: 'Client name, title, company, rating, and review text are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const result = await db.createReview({
        clientName: client_name,
        clientTitle: client_title,
        clientCompany: client_company,
        rating: parseInt(rating),
        reviewText: review_text,
        projectName: project_name || null,
        imageUrl: image_url || '/api/placeholder/80/80',
        isActive: is_active !== undefined ? (is_active ? 1 : 0) : 1,
        sortOrder: parseInt(sort_order) || 0
      });

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        reviewId: result.lastInsertRowid
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
