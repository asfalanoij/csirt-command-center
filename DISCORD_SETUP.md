# 🔔 Discord Integration Setup Guide

## 🚨 Real-Time Security Alerts in Discord

Your CSIRT Command Center can now send **real-time security incident alerts** directly to Discord channels, perfect for:
- **SOC team notifications** 
- **Incident response coordination**
- **Security awareness for teams**
- **Portfolio demonstrations**

## 🛠️ **Quick Setup (3 minutes)**

### **Step 1: Create Discord Webhook**
1. **Open your Discord server** (or create one for testing)
2. **Right-click on a channel** (e.g., `#security-alerts` or `#csirt`)
3. **Select "Edit Channel"** → **"Integrations"** → **"Webhooks"**
4. **Click "New Webhook"**
5. **Name it**: `CSIRT Security Bot`
6. **Copy the Webhook URL** (looks like: `https://discord.com/api/webhooks/123456/abcdef...`)

### **Step 2: Configure Environment**
```bash
# Edit your .env file
nano .env

# Add your Discord webhook URL:
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ACTUAL_WEBHOOK_URL
DISCORD_CHANNEL_NAME=security-alerts
```

### **Step 3: Test the Integration**
```bash
# Test the connection (your server should be running)
curl http://localhost:5001/api/discord/test
```

## 🎯 **What You'll Get**

### **Real-Time Incident Alerts:**
```
🔴 CSIRT Security Alert
Vulnerability Exploitation Attempt detected from suspicious source

🚨 Severity Level: CRITICAL
🎯 Incident Type: ⚡ Vulnerability Exploitation Attempt  
🌐 Source IP: 185.220.166.236
💻 Target Asset: srv-45.corp.local
📋 Status: 🔴 ACTIVE
🆔 Incident ID: INC-1703621847234-a4b2
```

### **Professional Discord Embeds:**
- ✅ **Color-coded by severity** (Green → Red)
- ✅ **Rich formatting** with emojis and structured data
- ✅ **Threat intelligence context** (CVE links, confidence scores)
- ✅ **Clickable incident IDs** for tracking
- ✅ **Professional bot avatar** and branding

### **System Status Updates:**
```
✅ CSIRT System Status Update
Security monitoring system is now ONLINE

🖥️ System: CSIRT Command Center
📍 Status: ONLINE
⏰ Timestamp: [Current time]
```

## 🔧 **API Endpoints Available**

### **Test Discord Connection:**
```bash
GET http://localhost:5001/api/discord/test
# Returns: {"success": true, "message": "Discord webhook connection successful!"}
```

### **Send Critical Summary:**
```bash
POST http://localhost:5001/api/discord/send-summary
# Sends overview of active threats and metrics
```

### **Update System Status:**
```bash
POST http://localhost:5001/api/discord/system-status
Content-Type: application/json

{"status": "online"}  # Options: online, offline, maintenance, warning
```

## 🎮 **Discord Alert Types**

### **1. Individual Incident Alerts (Automatic)**
- Triggered for **every new security incident**
- **Color-coded by severity**: 🟢 LOW → 🔴 CRITICAL
- **Rich context**: Source IP, target, threat intelligence data
- **Professional formatting** with security-specific emojis

### **2. Critical Incident Summaries**
- **Batch alerts** for multiple high-severity incidents
- **Metrics overview**: Active threats, response times, totals
- **Executive-level** summary format

### **3. System Status Notifications**
- **Startup/shutdown** notifications
- **Maintenance mode** alerts
- **System health** status updates

## 🎨 **Customization Options**

### **Modify Alert Appearance:**
```javascript
// In discord-notifier.js, customize:
const severityColors = {
  'LOW': 3066993,      // Green
  'MEDIUM': 16776960,  // Yellow  
  'HIGH': 16753920,    // Orange
  'CRITICAL': 15158332 // Red
};

const typeEmojis = {
  'Malicious IP Connection': '🌐',
  'Vulnerability Exploitation Attempt': '⚡',
  'Suspicious Port Scanning': '🔍',
  // Add your own custom emoji mappings
};
```

### **Filter Alert Levels:**
```javascript
// Only send HIGH and CRITICAL alerts to Discord
if (incident.severity === 'HIGH' || incident.severity === 'CRITICAL') {
  await discordNotifier.sendIncidentAlert(incident);
}
```

## 🔐 **Security Best Practices**

### **Webhook Security:**
- ✅ **Keep webhook URLs secret** (never commit to git)
- ✅ **Use environment variables** for configuration
- ✅ **Regenerate webhooks** if compromised
- ✅ **Limit Discord permissions** to webhook-only access

### **Channel Organization:**
```
#security-alerts     // All incidents
#critical-only      // HIGH/CRITICAL only  
#system-status      // System notifications
#soc-coordination   // Team discussions
```

## 📱 **Mobile Integration**

Discord mobile app ensures **SOC analysts get alerts anywhere**:
- ✅ **Push notifications** for critical incidents
- ✅ **Rich embeds** display properly on mobile
- ✅ **Quick incident review** without opening dashboard
- ✅ **Team coordination** via Discord replies

## 🎯 **Perfect for Portfolio Demonstrations**

### **Live Demo Script:**
> *"As you can see on my Discord server, the CSIRT system is sending real-time security alerts. Each incident is automatically classified, formatted professionally, and includes threat intelligence context. This demonstrates how modern SOC teams can get immediate visibility into security events across all their communication channels."*

### **Interview Talking Points:**
1. **"I integrated Discord because SOC teams need alerts where they already communicate"**
2. **"The rich embed formatting shows attention to user experience in security tools"**
3. **"Real-time webhook integration demonstrates API development and event-driven architecture"**
4. **"This could easily be extended to Slack, Teams, or any webhook-based service"**

## 🚀 **Enterprise Extensions**

### **Advanced Features You Could Add:**
- **Role-based alert filtering** (@SOC-Team mentions for CRITICAL)
- **Incident acknowledgment** via Discord reactions
- **Automated playbook links** for common incident types
- **Integration with ticketing systems** (Jira, ServiceNow)
- **Threat hunting workflows** initiated from Discord

### **Scalability Considerations:**
- **Rate limiting** for high-volume environments
- **Alert aggregation** to prevent Discord spam
- **Multiple webhook targets** for different teams
- **Failover notification channels** if Discord is down

---

## 🎉 **Ready to Impress?**

Your CSIRT automation platform now has **enterprise-grade Discord integration** that demonstrates:
- ✅ **Real-time event processing**
- ✅ **Professional notification systems**  
- ✅ **API development skills**
- ✅ **User experience focus**
- ✅ **Production-ready features**

**Start receiving live security alerts in Discord and show employers how modern SOC automation should work!** 🛡️💼