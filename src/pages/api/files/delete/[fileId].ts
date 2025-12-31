import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../lib/database';
import fs from 'fs';
import path from 'path';

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

// Authorization helper
function canDeleteFile(user: any, fileId: number) {
  if (!user) return false;
  
  // Only admin can delete files
  if (user.role === 'admin') return true;
  
  // Clients cannot delete files
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId } = req.query;
  const user = getUserFromRequest(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const fileIdNum = parseInt(fileId as string);
  if (!canDeleteFile(user, fileIdNum)) {
    return res.status(403).json({ error: 'Access denied - only administrators can delete files' });
  }

  try {
    // Delete from database
    const result = await db.deleteFile(fileIdNum);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json({ success: true, message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}