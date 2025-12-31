import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';
import crypto from 'crypto';

// Optional nodemailer import
let nodemailer: any = null;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('⚠️  nodemailer not installed - password reset emails disabled');
}

const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('nodemailer not available');
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'citylife32@outlook.com',
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get user from database
    const user = db.getUserByEmail(email) as any;

    if (!user) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    // Save token to database
    db.createPasswordResetToken(user.id, resetToken, expiresAt);

    // Send email if nodemailer is available
    if (!nodemailer || !process.env.SMTP_PASSWORD) {
      console.log('📧 Password reset token generated (email disabled):', resetToken);
      return res.status(200).json({
        success: true,
        message: 'Password reset token generated. Check server logs for token (email disabled).',
        token: resetToken // Remove in production!
      });
    }

    const transporter = createTransporter();
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'citylife32@outlook.com',
      to: email,
      subject: 'Password Reset Request - CityLyfe LLC',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password for your CityLyfe LLC account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                Or copy and paste this link into your browser:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </p>
              <div class="footer">
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${user.name},

We received a request to reset your password for your CityLyfe LLC account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

- CityLyfe LLC Team
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
