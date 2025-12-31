import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/database';

// Simulate email sending function
async function sendEmailNotification(to: string, from: string, subject: string, message: string, projectName: string) {
  // In production, you would integrate with SendGrid, Nodemailer, etc.
  console.log(`
EMAIL NOTIFICATION:
To: ${to}
From: ${from}
Subject: ${subject}
Project: ${projectName}
Message: ${message}
  `);
  
  // For demo purposes, we'll just log it
  // In production, you would do something like:
  /*
  await sendGrid.send({
    to,
    from: 'noreply@citylifellc.com',
    subject: `CityLyfe LLC - ${subject}`,
    html: `
      <h3>New message for project: ${projectName}</h3>
      <p><strong>From:</strong> ${from}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><a href="https://citylifellc.com/login">View in Portal</a></p>
    `
  });
  */
  
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      senderId, 
      senderName, 
      senderEmail, 
      recipientId, 
      recipientName, 
      recipientEmail, 
      projectId, 
      projectName, 
      subject, 
      message 
    } = req.body;

    // Validate required fields
    if (!senderId || !recipientId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new message in database
    const result = await db.createMessage({
      senderId,
      senderName,
      senderEmail,
      recipientId,
      recipientName,
      recipientEmail,
      projectId,
      projectName,
      subject: subject || 'New Message',
      message
    });

    // Send email notifications
    try {
      await sendEmailNotification(
        recipientEmail,
        senderEmail,
        subject || 'New Message',
        message,
        projectName
      );
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue anyway - don't fail the message send if email fails
    }

    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully',
      messageId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

