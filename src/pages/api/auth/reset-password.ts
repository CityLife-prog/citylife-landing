import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Get reset token from database
    const resetToken = await db.getPasswordResetToken(token) as any;

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update user password
    await db.updateUserPassword(resetToken.user_id, password);

    // Mark token as used
    await db.markPasswordResetTokenUsed(token);

    // Clean up expired tokens
    await db.deleteExpiredPasswordResetTokens();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
