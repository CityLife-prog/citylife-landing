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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Only admins can create clients
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied - admin only' });
  }

  try {
    const { name, email, company, phone, website, business_name, address, projects, totalSpent } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await db.createClient({
      name,
      email,
      company,
      phone: phone || null,
      website: website || null,
      business_name: business_name || null,
      address: address || null,
      projects: projects || 0,
      totalSpent: totalSpent || 0
    });

    res.status(201).json({ 
      success: true, 
      message: 'Client created successfully',
      clientId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error creating client:', error);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}