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

### Client Management System

The enhanced client management system includes:
- **Required Fields**: name, email, company
- **Optional Fields**: phone, website, business_name, address
- **Contact Management**: Multiple contacts per client via client_contacts table

#### API Endpoints

**Create Client** (Admin only)
```bash
curl -X POST http://localhost:3001/api/clients/create \
  -H "Content-Type: application/json" \
  -H "x-user-data: {\"id\":\"admin-1\",\"email\":\"admin@citylyfe.net\",\"role\":\"admin\"}" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "phone": "+1-555-0123",
    "website": "https://example.com",
    "business_name": "Example Corporation LLC",
    "address": "123 Main St, City, State 12345"
  }'
```

**Get Client Contacts**
```bash
curl http://localhost:3001/api/clients/contacts/1 \
  -H "x-user-data: {\"id\":\"admin-1\",\"email\":\"admin@citylyfe.net\",\"role\":\"admin\"}"
```

**Add Contact to Client** (Admin only)
```bash
curl -X POST http://localhost:3001/api/clients/contacts/1 \
  -H "Content-Type: application/json" \
  -H "x-user-data: {\"id\":\"admin-1\",\"email\":\"admin@citylyfe.net\",\"role\":\"admin\"}" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-0124",
    "role": "Project Manager",
    "is_primary": true
  }'
```

#### Add New Client (via Admin Dashboard)
1. Go to http://localhost:3001/admin/dashboard
2. Click "+ New Client" button in Clients section
3. Fill in required fields (name, email, company)
4. Optionally add: phone, website, business name, address
5. Save to create client

#### Add New Client (Database)
```sql
-- Connect to database
sqlite3 data/citylife.db

-- Add client with all fields
INSERT INTO clients (name, email, company, phone, website, business_name, address, projects, total_spent)
VALUES ('John Doe', 'john@example.com', 'Example Corp', '+1-555-0123', 'https://example.com', 'Example Corporation LLC', '123 Main St, City, State 12345', 0, 0);

-- View clients
SELECT * FROM clients;

-- Add contact to client
INSERT INTO client_contacts (client_id, name, email, phone, role, is_primary)
VALUES (1, 'Jane Smith', 'jane@example.com', '+1-555-0124', 'Project Manager', 1);

-- View client contacts
SELECT * FROM client_contacts WHERE client_id = 1;
```

#### Database Schema
```sql
-- Clients table
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  business_name TEXT,
  address TEXT,
  projects INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Client contacts table
CREATE TABLE client_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  is_primary BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
);
```

### Add New Project (Database)
```sql
-- Connect to database
sqlite3 data/citylife.db

-- Add project
INSERT INTO projects (name, client, client_id, status, budget, timeline, progress)
VALUES ('New Project', 'Example Corp', 1, 'planning', 5000, '8 weeks', 0);

-- View projects
SELECT * FROM projects;

-- View projects with client details
SELECT p.*, c.email, c.phone, c.website
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id;
```

### Backup User Data
```bash
# Export projects
sqlite3 data/citylife.db ".mode csv" ".headers on" ".output projects.csv" "SELECT * FROM projects;"

# Export clients
sqlite3 data/citylife.db ".mode csv" ".headers on" ".output clients.csv" "SELECT * FROM clients;"

# Export client contacts
sqlite3 data/citylife.db ".mode csv" ".headers on" ".output client_contacts.csv" "SELECT * FROM client_contacts;"
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