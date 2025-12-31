import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/database';
import { sendQuoteRequestEmail } from '../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if client already exists
    const existingClients = db.getClients();
    const existingClient = (existingClients as any[]).find((c: any) => c.email === email);

    let clientId;

    if (existingClient) {
      // Client exists, just use their ID
      clientId = existingClient.id;
    } else {
      // Create new client
      const result = db.createClient({
        name,
        email,
        company: company || null,
        phone: phone || null,
        website: null,
        business_name: null,
        address: null,
        projects: 0,
        totalSpent: 0
      });

      clientId = result.lastInsertRowid;
    }

    // Create project for quote request
    const projectName = `Quote Request: ${company || name}`;
    const projectResult = db.createProject({
      name: projectName,
      client: company || name,
      clientId: clientId,
      status: 'quote',
      budget: 0,
      timeline: 'TBD',
      progress: 0
    });

    const projectId = projectResult.lastInsertRowid;

    // Create notification for admin
    db.createNotification({
      type: 'quote_request',
      title: 'New Quote Request',
      message: `${name} (${email}) has requested a quote${company ? ` for ${company}` : ''}. Message: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`,
      link: `/admin/dashboard`
    });

    // Send email notification (non-blocking)
    sendQuoteRequestEmail({
      name,
      email,
      phone,
      company,
      message,
      projectId: projectId as number
    }).catch(err => console.error('Failed to send quote email:', err));

    res.status(200).json({
      success: true,
      message: 'Quote request received! We\'ll get back to you soon.',
      clientId: clientId,
      projectId: projectId
    });

  } catch (error) {
    console.error('Error processing quote request:', error);

    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'This email is already in our system. We\'ll review your request and contact you soon.' });
    } else {
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  }
}
