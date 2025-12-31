import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../lib/database';

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

  const { clientId } = req.query;

  if (req.method === 'GET') {
    // Get client contacts
    try {
      const contacts = db.getClientContacts(parseInt(clientId as string));
      res.status(200).json({
        success: true,
        contacts
      });
    } catch (error) {
      console.error('Error fetching client contacts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Create new contact for client
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - admin only' });
    }

    try {
      const { name, email, phone, role, is_primary } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const result = db.createClientContact({
        clientId: parseInt(clientId as string),
        name,
        email,
        phone: phone || null,
        role: role || null,
        isPrimary: is_primary || false
      });

      res.status(201).json({
        success: true,
        message: 'Contact created successfully',
        contactId: result.lastInsertRowid
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
