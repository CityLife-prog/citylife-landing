# CityLyfe LLC Project TODO Commands

## 🚀 Development Commands

### Start Development Server
```bash
npm run dev
# Application runs on http://localhost:3001
```

### Build for Production
```bash
npm run build
npm run start
```

### Code Quality
```bash
npm run lint          # Check for linting errors
npm run lint -- --fix # Auto-fix linting issues
```

## 📁 Database Management

### Reset Database (if needed)
```bash
rm -rf data/citylife.db
# Database will be recreated automatically on next startup
```

### Backup Database
```bash
mkdir -p backups
cp data/citylife.db backups/citylife-$(date +%Y%m%d-%H%M%S).db
```

## 🔧 File Management

### Check Upload Directory
```bash
ls -la public/uploads/
```

### Clean Upload Directory (careful!)
```bash
# Remove all uploaded files (be careful!)
rm -rf public/uploads/*
```

### Set Proper Permissions
```bash
chmod 755 public/uploads/
```

## 🌐 Domain & Deployment Setup

### Update Domain References
```bash
# Update any remaining localhost references to citylyfe.net
grep -r "localhost" src/ --exclude-dir=node_modules
grep -r "3001" src/ --exclude-dir=node_modules
```

### Environment Configuration
```bash
# Create production environment file
cat > .env.production.local << EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://citylyfe.net
DATABASE_URL=./data/citylife.db
EOF
```

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
npm prune --production
```

### PM2 Deployment (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "citylyfe" -- start

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor application
pm2 status
pm2 logs citylyfe
```

### Docker Deployment (Alternative)
```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build and run
docker build -t citylyfe-app .
docker run -d -p 3000:3000 --name citylyfe citylyfe-app
```

## 🔒 Security & SSL Setup

### Install Certbot (Let's Encrypt)
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Generate SSL Certificate
```bash
sudo certbot --nginx -d citylyfe.net
```

### Auto-renew SSL
```bash
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
curl -I http://localhost:3001
```

### Monitor Logs
```bash
pm2 logs citylyfe --lines 100
tail -f ~/.pm2/logs/citylyfe-out.log
```

### System Resource Check
```bash
df -h              # Disk usage
free -h            # Memory usage
top                # CPU usage
```

### Database Maintenance
```bash
# Check database size
ls -lh data/citylife.db

# Vacuum database (optimize)
sqlite3 data/citylife.db "VACUUM;"
```

## 🔧 Troubleshooting Commands

### Clear Node Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run build
```

### Check Port Usage
```bash
lsof -i :3001
netstat -tulpn | grep :3001
```

### Restart Services
```bash
pm2 restart citylyfe
# or
pm2 reload citylyfe
```

## 📝 Content Management

### Add New Project (Database)
```sql
-- Connect to database
sqlite3 data/citylife.db

-- Add project
INSERT INTO projects (name, client, status, budget, timeline, progress)
VALUES ('New Project', 'Client Name', 'planning', 5000, '8 weeks', 0);

-- View projects
SELECT * FROM projects;
```

### Backup User Data
```bash
# Export projects
sqlite3 data/citylife.db ".mode csv" ".headers on" ".output projects.csv" "SELECT * FROM projects;"

# Export clients
sqlite3 data/citylife.db ".mode csv" ".headers on" ".output clients.csv" "SELECT * FROM clients;"
```

## 🔄 Git Management

### Commit Changes
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### Create Backup Branch
```bash
git checkout -b backup-$(date +%Y%m%d)
git push -u origin backup-$(date +%Y%m%d)
git checkout main
```

## 📈 Performance Optimization

### Analyze Bundle Size
```bash
npm install -g @next/bundle-analyzer
npm run build
npx @next/bundle-analyzer
```

### Image Optimization
```bash
# Install imagemin for image compression
npm install imagemin imagemin-webp
```

## 🎯 Quick Start Checklist

1. **Setup Development:**
   ```bash
   npm install
   npm run dev
   ```

2. **Test File Upload:**
   - Go to http://localhost:3001/login
   - Login as admin (admin@citylyfe.net / admin123)
   - Go to projects, click "Files" button
   - Test upload functionality

3. **Test Client Portal:**
   - Login as client (client@demo.com / client123)
   - Test file management

4. **Production Deploy:**
   ```bash
   npm run build
   pm2 start npm --name "citylyfe" -- start
   ```

## 📞 Support

If you need help with any of these commands or run into issues:
1. Check the logs: `pm2 logs citylyfe`
2. Verify the application is running: `pm2 status`
3. Check database connectivity: `ls -la data/`
4. Verify uploads work: `ls -la public/uploads/`

---
*Last updated: $(date)*