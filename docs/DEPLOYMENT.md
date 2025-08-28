# 🚀 Production Deployment Guide

## Deployment Options

### 1. **Vercel** (Recommended for Full-Stack)
### 2. **Railway** (Simple Node.js hosting)  
### 3. **DigitalOcean App Platform** (Scalable containers)
### 4. **Docker** (Self-hosted containers)

---

## 🔷 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository
- Environment variables ready

### Steps

#### 1. Prepare Repository
```bash
# Ensure vercel.json exists (already included)
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### 2. Deploy via Vercel Dashboard
1. Visit https://vercel.com
2. **Import Git Repository**
3. Select your GitHub repository
4. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm install && cd client && npm install`

#### 3. Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
NODE_ENV=production
PORT=5001
VIRUSTOTAL_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key
SHODAN_API_KEY=your_key
OTX_API_KEY=your_key
DISCORD_WEBHOOK_URL=your_webhook
```

#### 4. Custom Domain (Optional)
- Add your domain in Vercel dashboard
- Configure DNS records as instructed
- SSL automatically provided

**Live URL**: `https://your-app-name.vercel.app`

---

## 🚂 Railway Deployment

### Quick Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

### Environment Setup
```bash
# Set environment variables
railway variables:set NODE_ENV=production
railway variables:set VIRUSTOTAL_API_KEY=your_key
railway variables:set ABUSEIPDB_API_KEY=your_key
railway variables:set SHODAN_API_KEY=your_key
railway variables:set OTX_API_KEY=your_key
railway variables:set DISCORD_WEBHOOK_URL=your_webhook
```

**Live URL**: `https://your-app-name.up.railway.app`

---

## 🌊 DigitalOcean App Platform

### App Spec Configuration
Create `app.yaml`:
```yaml
name: csirt-command-center
services:
- name: web
  source_dir: /
  github:
    repo: your-username/csirt-command-center
    branch: main
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: professional-xs
  envs:
  - key: NODE_ENV
    value: production
  - key: VIRUSTOTAL_API_KEY
    value: your_key
    type: SECRET
  - key: ABUSEIPDB_API_KEY  
    value: your_key
    type: SECRET
  - key: SHODAN_API_KEY
    value: your_key
    type: SECRET
  - key: OTX_API_KEY
    value: your_key
    type: SECRET
  - key: DISCORD_WEBHOOK_URL
    value: your_webhook
    type: SECRET
```

### Deploy
1. Push `app.yaml` to repository
2. Connect GitHub in DigitalOcean dashboard
3. Select repository and deploy

**Live URL**: `https://your-app-name-xxxxx.ondigitalocean.app`

---

## 🐳 Docker Deployment

### Dockerfile (included)
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Frontend build
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci --only=production
RUN npm run build

# App files
WORKDIR /app
COPY . .

EXPOSE 5001
CMD ["npm", "start"]
```

### Build and Run
```bash
# Build image
docker build -t csirt-command-center .

# Run container
docker run -p 5001:5001 \
  -e NODE_ENV=production \
  -e VIRUSTOTAL_API_KEY=your_key \
  -e ABUSEIPDB_API_KEY=your_key \
  -e SHODAN_API_KEY=your_key \
  -e OTX_API_KEY=your_key \
  -e DISCORD_WEBHOOK_URL=your_webhook \
  csirt-command-center
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - VIRUSTOTAL_API_KEY=${VIRUSTOTAL_API_KEY}
      - ABUSEIPDB_API_KEY=${ABUSEIPDB_API_KEY}
      - SHODAN_API_KEY=${SHODAN_API_KEY}
      - OTX_API_KEY=${OTX_API_KEY}
      - DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}
    restart: unless-stopped
```

---

## 🔒 Production Security

### HTTPS Configuration
```javascript
// In production, ensure HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### Environment Variables
**Required for production:**
```bash
NODE_ENV=production
PORT=5001
VIRUSTOTAL_API_KEY=your_production_key
ABUSEIPDB_API_KEY=your_production_key
SHODAN_API_KEY=your_production_key
OTX_API_KEY=your_production_key
DISCORD_WEBHOOK_URL=your_production_webhook
```

### Security Headers
Already configured via Helmet.js:
- CSP policies adjusted for production
- CORS origins restricted to your domain
- Security headers enabled

---

## 📊 Monitoring & Logging

### Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});
```

### Production Monitoring
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, LogRocket  
- **Performance**: New Relic, DataDog
- **Logs**: Logtail, Papertrail

---

## 🚀 Performance Optimization

### Build Optimization
```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "build:optimize": "cd client && npm run build && npm run analyze"
  }
}
```

### Caching Strategy
```javascript
// Static file caching
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build', {
    maxAge: '1d',
    etag: true
  }));
}
```

### Database Optimization (if added)
- Connection pooling
- Query optimization
- Index creation
- Read replicas

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm ci
        cd client && npm ci
        
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🌐 Domain Configuration

### Custom Domain Setup
1. **Purchase domain** (Namecheap, GoDaddy, Cloudflare)
2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: @
   Value: your-app.vercel.app
   ```
3. **SSL Certificate**: Automatically provided by most platforms

### Subdomains
- `api.your-domain.com` → Backend API
- `dashboard.your-domain.com` → Frontend
- `status.your-domain.com` → Status page

---

## ✅ Pre-deployment Checklist

### Code Preparation
- [ ] Environment variables configured
- [ ] Security headers enabled  
- [ ] Error handling implemented
- [ ] API keys secured
- [ ] CORS configured for production
- [ ] Build process tested locally

### Infrastructure
- [ ] Hosting platform selected
- [ ] Domain configured (if custom)
- [ ] SSL certificate enabled
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Backup strategy implemented

### Post-deployment
- [ ] Application accessible via URL
- [ ] API endpoints responding correctly
- [ ] WebSocket connections working
- [ ] Threat intelligence APIs functional
- [ ] Discord notifications working
- [ ] Performance metrics acceptable

---

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check build logs
npm run build

# Common fixes
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure no extra spaces or quotes

#### API Connection Issues
- Verify API keys are valid
- Check rate limits
- Test API connectivity locally

#### Performance Issues
- Enable gzip compression
- Optimize bundle size
- Implement caching strategies
- Monitor resource usage

---

**Deployment Success!** 🎉

Your CSIRT Command Center is now live and ready to monitor security threats in real-time!