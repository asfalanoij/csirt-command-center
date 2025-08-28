# 🚀 Setup & Installation Guide

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/csirt-command-center.git
cd csirt-command-center
```

### 2. Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies  
cd client
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your API keys (see API Keys section below)
nano .env  # or use your preferred editor
```

### 4. Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run server    # Backend only (port 5001)
npm run client    # Frontend only (port 3000)
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api

---

## API Keys Setup

### Required API Keys (Free Tiers Available)

#### 1. VirusTotal API
1. Visit: https://www.virustotal.com/gui/join-us
2. Create free account
3. Go to API Key section
4. Copy key to `.env` file:
```
VIRUSTOTAL_API_KEY="your_key_here"
```

#### 2. AbuseIPDB API  
1. Visit: https://www.abuseipdb.com/register
2. Create account and verify email
3. Generate API key
4. Add to `.env`:
```
ABUSEIPDB_API_KEY="your_key_here"
```

#### 3. Shodan API
1. Visit: https://account.shodan.io/register  
2. Create account
3. Get API key from account page
4. Add to `.env`:
```
SHODAN_API_KEY="your_key_here"
```

#### 4. AlienVault OTX API
1. Visit: https://otx.alienvault.com/
2. Create account  
3. Go to Settings → API Integration
4. Copy API key:
```
OTX_API_KEY="your_key_here"
```

### Optional Integrations

#### Discord Notifications
1. Create Discord server or use existing
2. Go to Server Settings → Integrations → Webhooks
3. Create New Webhook
4. Copy webhook URL to `.env`:
```
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN"
DISCORD_CHANNEL_NAME="security-incidents"
```

---

## Development Commands

```bash
# Development with hot reload
npm run dev

# Start backend only
npm run server

# Start frontend only  
npm run client

# Build for production
npm run build

# Start production server
npm start

# Install new dependency
npm install package-name

# Security audit
npm audit
```

---

## Project Structure

```
csirt-command-center/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── config/                # Configuration files
│   └── constants.js       # App constants
├── utils/                 # Utility functions
│   └── mockData.js        # Mock data generators
├── docs/                  # Documentation
├── server.js              # Backend server
├── threat-intelligence.js # Threat API integration
├── discord-notifier.js    # Discord integration
├── .env.example          # Environment template
├── .env                  # Your environment (not tracked)
├── .gitignore           # Git ignore rules
└── package.json         # Backend dependencies
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000  
lsof -ti:3000 | xargs kill -9
```

#### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Client dependencies
cd client
rm -rf node_modules package-lock.json  
npm install
cd ..
```

#### Environment Variables Not Loading
- Ensure `.env` file is in root directory
- Check file is not named `.env.txt`
- Restart server after changes
- Verify no extra spaces in variable assignments

#### API Keys Not Working
- Check API key validity on respective platforms
- Verify no extra quotes or spaces in `.env`
- Ensure API keys have proper permissions
- Check rate limits haven't been exceeded

### Performance Issues

#### Slow API Responses
- Threat intelligence APIs have rate limits
- Free tiers have usage quotas
- Check network connectivity
- Monitor API status pages

#### High Memory Usage
- Restart development server
- Clear browser cache
- Check for memory leaks in console

---

## Next Steps

1. **Configure all API keys** for full functionality
2. **Set up Discord notifications** for real-time alerts  
3. **Review security settings** in server configuration
4. **Test all endpoints** using the API documentation
5. **Deploy to production** using deployment guide

---

## Support

For issues and questions:
- Check existing documentation
- Review console logs for errors
- Verify environment configuration
- Test API connectivity individually

**Need help?** Contact via portfolio website or create an issue in the repository.