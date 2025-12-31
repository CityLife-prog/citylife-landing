import { NextApiRequest, NextApiResponse } from 'next';
import { db, verifyPassword } from '../../../../lib/database';

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

  if (req.method === 'GET') {
    // Get user profile
    try {
      const userProfile = await db.getUser(user.id);
      if (!userProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    // Update user profile
    try {
      const { name, email, company, phone, currentPassword, newPassword } = req.body;

      // If changing password, verify current password first
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to change password' });
        }

        // Verify current password
        const userWithPassword = await db.getUserByEmail(user.email) as any;
        const isValidPassword = await verifyPassword(currentPassword, userWithPassword.password);

        if (!isValidPassword) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Validate new password strength
        if (newPassword.length < 8) {
          return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        // Update password
        await db.updateUserPassword(user.id, newPassword);
      }

      // Update other profile fields
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (company !== undefined) updates.company = company;
      if (phone !== undefined) updates.phone = phone;

      if (Object.keys(updates).length > 0) {
        db.updateUser(user.id, updates);
      }

      // Get updated user profile
      const updatedProfile = await db.getUser(user.id);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfile
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
