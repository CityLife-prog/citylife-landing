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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Only admins can access notifications
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied - admin only' });
  }

  if (req.method === 'GET') {
    try {
      const { unreadOnly } = req.query;
      const notifications = await db.getNotifications(unreadOnly === 'true');
      res.status(200).json({ success: true, notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, markAllRead } = req.body;

      if (markAllRead) {
        await db.markAllNotificationsRead();
      } else if (id) {
        await db.markNotificationRead(parseInt(id));
      } else {
        return res.status(400).json({ error: 'Missing id or markAllRead parameter' });
      }

      res.status(200).json({ success: true, message: 'Notification(s) marked as read' });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
      }

      await db.deleteNotification(parseInt(id));
      res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
