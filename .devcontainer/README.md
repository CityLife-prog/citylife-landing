# CityLife Landing Page - DevContainer Setup

Complete development environment for the CityLife Media Solutions business website.

## 🎯 What's This?

A **Next.js 15** business website with:
- Company information & services
- Project portfolio
- Client testimonials
- Contact forms
- SEO optimization
- SQLite database

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## 🚀 Quick Start

### 1. Open in DevContainer

```bash
# Navigate to the project
cd /path/to/citylife-landing

# Open in VS Code
code .

# In VS Code:
# Press F1 → "Dev Containers: Reopen in Container"
```

### 2. Wait for Setup

The devcontainer will automatically:
- ✅ Build Node.js development environment
- ✅ Install all npm dependencies
- ✅ Configure VS Code extensions
- ✅ Set up development tools

**First time**: ~3-5 minutes

### 3. Start Development

Once inside the container:

```bash
# Development server (with hot reload)
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
citylife-landing/
├── .devcontainer/
│   ├── devcontainer.json    # VS Code config
│   ├── Dockerfile           # Multi-stage Docker build
│   └── README.md           # This file
├── src/
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── context/           # React context
│   └── styles/            # Global styles
├── public/                # Static assets
├── data/                  # SQLite database
└── docker-compose.prod.yml # Production deployment
```

---

## 🛠️ Available Commands

### Development
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Docker Commands
```bash
# Production build & deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Next.js Dev | http://localhost:3000 | Development server |
| Next.js Prod | http://localhost:3000 | Production build |

---

## 🔧 VS Code Extensions Included

Pre-installed in devcontainer:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript** - TS support
- **Error Lens** - Inline error display
- **GitLens** - Git integration
- **Docker** - Docker management

---

## 📝 Environment Variables

### Development

Create `.env.local` for development:
```bash
cp .env.local.example .env.local
# Edit .env.local with your values
```

### Production

```bash
# Set in your deployment platform (Vercel, Railway, etc.)
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://citylifellc.com
```

---

## 🚀 Production Deployment

### Option 1: Container Platforms (AWS ECS, Azure Container Apps)

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Tag for registry
docker tag citylife_landing_prod:latest <registry>/citylife-landing:latest

# Push to registry
docker push <registry>/citylife-landing:latest

# Deploy using your platform's CLI or console
```

### Option 2: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Option 4: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

---

## 🏗️ Multi-Stage Docker Build

The Dockerfile includes three stages:

1. **Development**: Full dev environment with hot reload
2. **Builder**: Optimized build stage
3. **Production**: Minimal runtime image (~100MB smaller)

```bash
# Build specific stage
docker build --target development -t citylife-landing:dev .
docker build --target production -t citylife-landing:prod .
```

---

## 🔐 Security Notes

### Environment Files
- ✅ `.env.local.example` - Committed (template)
- ✅ `.env.production.example` - Committed (template)
- ❌ `.env.local` - **NOT committed** (has secrets)
- ❌ `.env.production` - **NOT committed** (has secrets)

### Production Checklist
- [ ] Change default database credentials
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Set up monitoring/logging
- [ ] Enable rate limiting
- [ ] Review and remove debug logs

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Rebuild from scratch
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in package.json
```

### Dependencies not installing
```bash
# Inside devcontainer
rm -rf node_modules package-lock.json
npm install
```

### SQLite database issues
```bash
# Check database file exists
ls -la data/

# Reset database (⚠️ deletes all data)
rm data/*.db
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [VS Code DevContainers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review Docker logs
3. Check GitHub Issues
4. Contact development team

---

**🎉 Happy Coding!**

Built with ❤️ for CityLife Media Solutions
