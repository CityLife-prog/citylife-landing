# CityLyfe LLC - Vercel Deployment Guide

Complete guide for deploying your CityLyfe website to Vercel via GitHub.

## 🎯 Pre-Deployment Checklist

### ✅ Local Testing
- [ ] Production build completes: `npm run build`
- [ ] All features tested locally
- [ ] Quote request form working
- [ ] Email notifications configured (optional)
- [ ] Project images displaying correctly

### ✅ GitHub Setup
- [ ] Code pushed to GitHub repository
- [ ] `.env.local` added to `.gitignore` (already done)
- [ ] Repository is public or you have Vercel Pro (for private repos)

### ✅ Vercel Account
- [ ] Create account at https://vercel.com
- [ ] Install Vercel CLI: `npm i -g vercel` (optional)

---

## 🚀 Deployment Steps

### Step 1: Connect GitHub to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Authorize Vercel to access your GitHub
   - Select your `citylife-landing` repository

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (should auto-detect)

**Build & Development Settings**:
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

**Root Directory**: `./` (leave as default)

### Step 3: Environment Variables

⚠️ **IMPORTANT**: Add these in Vercel project settings before deploying.

Go to: **Project Settings** → **Environment Variables**

#### Required Variables

```env
# Node Environment
NODE_ENV=production

# Site URL (update after deployment)
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
# Change to your custom domain later: https://citylyfe.net
```

#### Email Notifications (Optional but Recommended)

```env
# SMTP Configuration for Outlook
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=citylife32@outlook.com
SMTP_PASSWORD=your-outlook-app-password-here

# Email Settings
NEXT_PUBLIC_BASE_URL=https://your-site.vercel.app
```

**📧 How to Get SMTP_PASSWORD:**

1. Visit https://account.microsoft.com/security
2. Go to **Security** → **Advanced security options**
3. Under **App passwords**, click **Create a new app password**
4. Copy the generated password
5. Paste it as `SMTP_PASSWORD` value in Vercel

> **Note**: Without `SMTP_PASSWORD`, the app will work fine but won't send email notifications. Quote requests will still be saved to the database.

#### Optional Variables

```env
# Custom Configuration (if needed)
DATABASE_PATH=./data/citylife.db
```

### Step 4: Deploy

1. **Click "Deploy"**
   - Vercel will automatically build and deploy your site
   - First deployment takes 2-3 minutes

2. **Monitor Build**
   - Watch the build logs for any errors
   - Build should complete successfully

3. **Get Your URL**
   - Vercel assigns: `https://citylife-landing-xxx.vercel.app`
   - Visit this URL to see your site live!

### Step 5: Update Environment Variables with Final URL

1. Go to **Project Settings** → **Environment Variables**
2. Update these with your actual Vercel URL:
   ```env
   NEXT_PUBLIC_SITE_URL=https://citylife-landing-xxx.vercel.app
   NEXT_PUBLIC_BASE_URL=https://citylife-landing-xxx.vercel.app
   ```
3. **Redeploy** for changes to take effect:
   - Go to **Deployments** tab
   - Click **⋯** on latest deployment → **Redeploy**

---

## 🌐 Custom Domain Setup (citylyfe.net)

### Option 1: Domain Purchased Through Vercel

1. **Buy domain in Vercel**:
   - Go to **Domains** tab
   - Search for `citylyfe.net`
   - Purchase directly through Vercel
   - Vercel auto-configures everything

### Option 2: External Domain (GoDaddy, Namecheap, etc.)

1. **Add Domain in Vercel**:
   - Go to **Project Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `citylyfe.net` and `www.citylyfe.net`

2. **Configure DNS Records** (in your domain registrar):

   **For Apex Domain** (`citylyfe.net`):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For WWW Subdomain** (`www.citylyfe.net`):
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Verify DNS Propagation**:
   - Can take 24-48 hours
   - Check status in Vercel Domains tab
   - Use https://dnschecker.org to verify

4. **SSL Certificate**:
   - Vercel automatically provisions SSL
   - Usually ready within 24 hours
   - Status shown in Domains tab

5. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_SITE_URL=https://citylyfe.net
   NEXT_PUBLIC_BASE_URL=https://citylyfe.net
   ```

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

### Production Deployments (main branch)

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

- Automatically builds and deploys
- Usually takes 1-2 minutes
- No manual intervention needed

### Preview Deployments (feature branches)

```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
```

- Creates preview URL for testing
- Perfect for reviewing changes before merging

---

## 📊 Database Considerations

### ⚠️ Important: SQLite on Vercel

Vercel is a **serverless platform** with ephemeral file systems. Your SQLite database won't persist between deployments.

### Recommended Solutions:

#### Option 1: Use Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
npm install @vercel/postgres
```

**Benefits**:
- Fully managed by Vercel
- Persistent storage
- Automatic backups
- Easy to set up

**Setup**: https://vercel.com/docs/storage/vercel-postgres

#### Option 2: External Database (Supabase, PlanetScale)

**Supabase (PostgreSQL)**:
- Free tier available
- Real-time features
- RESTful API
- https://supabase.com

**PlanetScale (MySQL)**:
- Serverless MySQL
- Free tier
- Branch-based workflow
- https://planetscale.com

#### Option 3: Keep SQLite (Development Only)
- Current SQLite setup works for testing
- Data resets on each deployment
- **Not suitable for production**

### Migration Path

When ready to migrate from SQLite:

1. **Export current data**:
   ```bash
   sqlite3 data/citylife.db .dump > backup.sql
   ```

2. **Set up new database** (Vercel Postgres/Supabase)

3. **Update database connection** in `lib/database.ts`

4. **Import data** to new database

5. **Add database credentials** to Vercel environment variables

---

## 📧 Email Notifications Setup

### Complete SMTP Configuration

1. **Get Outlook App Password** (see Step 3 above)

2. **Add to Vercel Environment Variables**:
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=citylife32@outlook.com
   SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

3. **Redeploy** after adding variables

4. **Test Quote Request**:
   - Fill out quote form on your site
   - Check email inbox
   - Verify notification received

### Troubleshooting Email Issues

**Emails not sending?**

1. **Check environment variables** are set in Vercel
2. **Verify app password** is correct
3. **Check Vercel function logs**:
   - Go to **Deployments** → Select deployment → **Function Logs**
   - Look for email-related errors
4. **Test SMTP locally first**:
   ```bash
   npm run dev
   # Submit quote request
   # Check console logs
   ```

**Common Issues**:
- `SMTP_PASSWORD` not set → Emails silently fail (by design)
- Wrong password → Check Outlook account
- Port blocked → Try port `587` (TLS) or `465` (SSL)

---

## 🔧 Advanced Configuration

### Vercel.json Configuration

Create `vercel.json` in project root (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 0 * * *"
  }]
}
```

### Environment Variable Types

Vercel supports 3 environment types:

1. **Production**: Live site (`main` branch)
2. **Preview**: Feature branches
3. **Development**: Local development

**Pro Tip**: Set different email addresses for each:
```env
# Production
SMTP_USER=citylife32@outlook.com

# Preview/Development
SMTP_USER=test@citylyfe.net
```

---

## 📈 Monitoring & Analytics

### Built-in Vercel Analytics

1. **Enable in Project Settings**:
   - Go to **Analytics** tab
   - Click **Enable Web Analytics**

2. **View metrics**:
   - Page views
   - Unique visitors
   - Top pages
   - Referrers

### Custom Monitoring

**Add Vercel Speed Insights**:
```bash
npm install @vercel/speed-insights
```

In `_app.tsx`:
```typescript
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  )
}
```

---

## 🔒 Security Best Practices

### Environment Variables Security

✅ **DO**:
- Use Vercel environment variables for secrets
- Never commit `.env.local` to Git
- Rotate passwords regularly
- Use different credentials for production/preview

❌ **DON'T**:
- Hardcode API keys in code
- Share environment variable values
- Use same password across environments

### Content Security

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

## 🐛 Troubleshooting

### Build Failures

**Error: "Command failed"**
```bash
# Test build locally first
npm run build

# Check specific error in Vercel logs
# Usually package.json scripts or dependencies
```

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Runtime Errors

**500 Internal Server Error**

1. Check **Function Logs** in Vercel dashboard
2. Look for error stack traces
3. Test API endpoint locally
4. Verify environment variables are set

**Database Errors**

- Remember: SQLite doesn't persist on Vercel
- Migrate to Vercel Postgres or external DB
- Check database connection in logs

### Deployment Issues

**Domain not working**

1. Verify DNS records in domain registrar
2. Check DNS propagation: https://dnschecker.org
3. Wait 24-48 hours for full propagation
4. Check Vercel Domains tab for status

**SSL Certificate Pending**

- Usually takes up to 24 hours
- Verify domain ownership
- Check DNS is correctly configured

---

## 📞 Support & Resources

### Vercel Documentation
- Deployment: https://vercel.com/docs/deployments
- Environment Variables: https://vercel.com/docs/environment-variables
- Custom Domains: https://vercel.com/docs/custom-domains
- Serverless Functions: https://vercel.com/docs/functions

### Project Documentation
- Email Setup: `EMAIL_SETUP.md`
- Review Integration: `REVIEWS_INTEGRATION.md`
- Project Screenshots: `public/projects/README.md`

### Quick Help
- Vercel Community: https://github.com/vercel/vercel/discussions
- Next.js Discord: https://nextjs.org/discord
- Vercel Support: support@vercel.com (Pro/Enterprise)

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Site loads at Vercel URL
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Quote request form works
- [ ] Email notifications tested
- [ ] All pages load correctly
- [ ] Images displaying properly
- [ ] Admin dashboard accessible
- [ ] Environment variables set
- [ ] Analytics enabled
- [ ] Database solution decided

---

## 🎉 You're Live!

Your CityLyfe website is now deployed on Vercel!

**Next Steps**:
1. Share your site with clients
2. Monitor analytics
3. Collect feedback
4. Iterate and improve

**Remember**: Every push to `main` branch automatically deploys to production!

---

**Deployed:** [Date]
**URL:** https://your-site.vercel.app
**Custom Domain:** https://citylyfe.net (when configured)
