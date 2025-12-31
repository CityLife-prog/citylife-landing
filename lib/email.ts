// Optional nodemailer import - gracefully handle if not installed
let nodemailer: any = null;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('⚠️  nodemailer not installed - email notifications disabled');
  console.warn('   Run "npm install" to enable email functionality');
}

interface QuoteRequestEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  projectId: number;
}

// Create reusable transporter using SMTP
const createTransporter = () => {
  if (!nodemailer) {
    throw new Error('nodemailer not available');
  }

  // For Outlook/Office365
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'citylife32@outlook.com',
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function sendQuoteRequestEmail(data: QuoteRequestEmailData): Promise<boolean> {
  try {
    // Skip if nodemailer not installed
    if (!nodemailer) {
      console.log('📧 Quote request received (email notifications disabled - run npm install)');
      return false;
    }

    // Skip if no SMTP password configured
    if (!process.env.SMTP_PASSWORD) {
      console.warn('SMTP_PASSWORD not configured, skipping email notification');
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_USER || 'citylife32@outlook.com',
      to: 'citylife32@outlook.com',
      subject: `New Quote Request from ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
            .value { background: white; padding: 12px; border-radius: 4px; border-left: 3px solid #2563eb; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎯 New Quote Request</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>

              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>

              ${data.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
              </div>
              ` : ''}

              ${data.company ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${data.company}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>

              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard" class="button">
                View in Admin Dashboard →
              </a>

              <div class="footer">
                <p><strong>Project ID:</strong> #${data.projectId}</p>
                <p>This quote request has been automatically added to your CityLyfe dashboard.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
New Quote Request

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.company ? `Company: ${data.company}` : ''}

Message:
${data.message}

Project ID: #${data.projectId}

View in dashboard: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
    console.log('Quote request email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending quote request email:', error);
    return false;
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    if (!nodemailer) {
      console.error('nodemailer not installed - run npm install');
      return false;
    }

    if (!process.env.SMTP_PASSWORD) {
      console.error('SMTP_PASSWORD not configured');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
}
