# 🔐 CSIRT Command Center

> **Enterprise Security Operations Dashboard** - Real-time threat detection and incident response automation

Built by **Rudy Prasetiya** | [Portfolio](https://rudyprasetiya.com)

## 🚀 Live Demo

**Development**: http://localhost:3000  
*Real-time security operations dashboard showcasing enterprise cybersecurity automation*

## 🎯 What This Demonstrates

This portfolio project showcases advanced **cybersecurity engineering** and **full-stack development** skills:

### 🛡️ Cybersecurity Expertise
- **Real-time threat intelligence** integration with VirusTotal, Shodan, AbuseIPDB, OTX
- **CSIRT automation** workflows and response orchestration  
- **Security event correlation** and threat intelligence feeds
- **Discord/WhatsApp notifications** for critical incidents
- **Enterprise SOC** dashboard with live metrics and KPIs
- **Secure API design** with Helmet security headers and CORS

### 💻 Technical Stack
- **Backend**: Node.js, Express, Socket.io, Helmet (security), UUID
- **Frontend**: React 19, TypeScript, TailwindCSS 4.x, Lucide Icons, Recharts
- **Security Integration**: Multiple threat intelligence APIs, Discord webhooks
- **Real-time**: Live incident streaming via WebSocket, automated metrics
- **Scalable Architecture**: Modular structure, environment-based configuration

## 🔧 Features

✅ **Real-time Security Dashboard** - Live incident monitoring  
✅ **Automated Threat Classification** - Severity-based incident triage  
✅ **Interactive Incident Response** - One-click incident resolution  
✅ **Enterprise Metrics** - SOC KPIs and response time tracking  
✅ **Professional UI/UX** - Cybersecurity-themed dark interface  
✅ **WebSocket Integration** - Real-time updates without page refresh  

## 🚦 Quick Start

```bash
# Clone and setup
git clone <repository>
cd csirt_automation/mvp

# Install dependencies
npm install
cd client && npm install && cd ..

# Environment setup
cp .env.example .env

# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Complete installation and configuration
- **[API Documentation](docs/API.md)** - REST endpoints and WebSocket events  
- **[Security Architecture](docs/SECURITY.md)** - Security features and best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment options

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IMAP Monitor  │───▶│  CSIRT Engine   │───▶│   Dashboard     │
│   (Email Scan)  │    │  (Node.js API)  │    │   (React/TS)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Alert System   │
                       │ (WhatsApp/SMS)  │
                       └─────────────────┘
```

## 🎨 Screenshots

### Main Dashboard
![CSIRT Dashboard](https://via.placeholder.com/800x400/0a0e27/00d4ff?text=CSIRT+Command+Center)

*Real-time security operations center with threat monitoring and incident management*

### Key Metrics
- **Total Incidents**: Live tracking of security events
- **Active Threats**: Current high-priority incidents requiring attention  
- **Response Time**: Average incident resolution metrics
- **Resolution Rate**: Daily incident closure tracking

## 🌟 Why This Matters

This project demonstrates **enterprise-level cybersecurity engineering** capabilities:

1. **Real-world Problem Solving** - Automates tedious CSIRT manual processes
2. **Scalable Security Architecture** - Production-ready incident response system
3. **Modern Tech Stack** - Current industry-standard tools and frameworks
4. **Professional UI/UX** - Enterprise dashboard design and usability
5. **Full-Stack Competency** - Frontend, backend, real-time, and deployment skills

Perfect for **cybersecurity roles** requiring both security expertise and development skills.

## 📞 Contact

**Rudy Prasetiya**  
🌐 [rudyprasetiya.com](https://rudyprasetiya.com)  
💼 [LinkedIn](https://linkedin.com/in/rudyprasetiya)  
📧 Contact via website  

*Looking for opportunities in cybersecurity, full-stack development, or security automation roles.*

---

**Built with ❤️ for enterprise security operations** • Real-time threat detection • Automated incident response