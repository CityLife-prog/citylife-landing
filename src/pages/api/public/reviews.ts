import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get only active reviews for public display
    const reviews = await db.getReviews(true);

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching public reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
