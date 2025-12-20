import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messageId, userId } = req.body;

    if (!messageId || !userId) {
      return res.status(400).json({ error: 'Message ID and User ID are required' });
    }

    // Mark message as read in database
    const result = db.markMessageRead(parseInt(messageId), userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Message marked as read' 
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}