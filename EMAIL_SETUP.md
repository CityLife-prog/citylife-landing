# Email Notification Setup Guide

This guide explains how to configure email notifications for quote requests.

## Quick Setup

1. **Get an App Password from Outlook**

   - Go to https://account.microsoft.com/security
   - Click on "Security" > "Advanced security options"
   - Under "App passwords", click "Create a new app password"
   - Copy the generated password

2. **Add Environment Variables**

   Create or update your `.env.local` file with these variables:

   ```bash
   # Email Configuration for Quote Request Notifications
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=citylife32@outlook.com
   SMTP_PASSWORD=ptqckyxojxxkisqn

   # Optional: Base URL for links in emails
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

3. **Test the Configuration**

   After setting up the environment variables, quote request emails will be sent automatically to `citylife32@outlook.com`.

## Environment Variables Explained

### Required Variables

- **SMTP_PASSWORD**: Your Outlook app password (required for emails to send)
  - Without this, the system will log a warning and skip email sending
  - The quote request will still be saved in the database

### Optional Variables (with defaults)

- **SMTP_HOST**: SMTP server address

  - Default: `smtp-mail.outlook.com`
  - Use this for Outlook/Office365 accounts

- **SMTP_PORT**: SMTP port number

  - Default: `587`
  - Port 587 uses STARTTLS encryption

- **SMTP_USER**: Email address to send from

  - Default: `citylife32@outlook.com`
  - Should match your Outlook account

- **NEXT_PUBLIC_BASE_URL**: Your website's URL
  - Default: `http://localhost:3000`
  - Used for links in email notifications

## Email Features

When a quote request is submitted, an email is sent with:

- **Formatted HTML email** with CityLyfe branding
- **Plain text fallback** for email clients that don't support HTML
- **All quote request details**: name, email, phone, company, message
- **Direct link** to view the request in the admin dashboard
- **Project ID** for easy reference

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**

   ```bash
   # Verify variables are set
   echo $SMTP_PASSWORD
   ```

2. **Check Server Logs**

   - Look for "Quote request email sent successfully" in console
   - Or "SMTP_PASSWORD not configured" warning

3. **Test SMTP Connection**
   - Ensure your Outlook account allows app passwords
   - Verify the app password is correct
   - Check if your account has 2FA enabled (required for app passwords)

### Common Errors

**"Authentication failed"**

- Your app password is incorrect
- Regenerate a new app password from Outlook

**"Connection timeout"**

- Check SMTP_HOST and SMTP_PORT values
- Ensure your server can reach smtp-mail.outlook.com

**"SMTP_PASSWORD not configured"**

- Add SMTP_PASSWORD to your .env.local file
- Restart your Next.js dev server

## Security Notes

- ✅ **Never commit** `.env.local` to git
- ✅ App passwords are safer than your main password
- ✅ Email sending is non-blocking (won't slow down quote submissions)
- ✅ Failed email sends won't prevent quote requests from being saved
- ✅ Errors are logged but don't expose sensitive information to users

## Production Deployment

For production deployments:

1. Set environment variables in your hosting platform:

   - Vercel: Project Settings > Environment Variables
   - Railway: Variables tab
   - Docker: Pass as environment variables

2. Set `NEXT_PUBLIC_BASE_URL` to your production domain

3. Monitor email delivery through server logs

## Alternative SMTP Providers

While this is configured for Outlook, you can use other providers by updating:

```bash
# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SendGrid
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key

# Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
```

## Testing

To test email functionality:

1. Ensure environment variables are set
2. Start your development server: `npm run dev`
3. Fill out the quote request form on your website
4. Check your console for: "Quote request email sent successfully"
5. Check citylife32@outlook.com inbox for the email

---

Need help? The email sending code is in `/lib/email.ts` and the quote request handler is in `/src/pages/api/quote-request.ts`.
