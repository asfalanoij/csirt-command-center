// Discord Alert Notifier for CSIRT Automation Platform
// Sends real-time security incidents to Discord channels

const axios = require('axios');
require('dotenv').config();

class DiscordNotifier {
  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    this.enabled = !!this.webhookUrl;
    this.channelName = process.env.DISCORD_CHANNEL_NAME || 'csirt-alerts';
    
    if (this.enabled) {
      console.log('🔔 Discord notifications enabled');
    } else {
      console.log('⚠️  Discord webhook not configured - alerts will be logged only');
    }
  }

  // Main method to send incident alerts to Discord
  async sendIncidentAlert(incident) {
    if (!this.enabled) {
      console.log(`📝 [DISCORD-DISABLED] ${incident.severity} incident: ${incident.type}`);
      return { success: false, reason: 'Discord webhook not configured' };
    }

    try {
      const embed = this.createIncidentEmbed(incident);
      const payload = {
        username: 'CSIRT Security Bot',
        avatar_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png',
        embeds: [embed]
      };

      const response = await axios.post(this.webhookUrl, payload);
      
      console.log(`🔔 Discord alert sent: ${incident.severity} - ${incident.type}`);
      return { success: true, response: response.status };
      
    } catch (error) {
      console.error('❌ Discord notification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Create Discord embed for security incident
  createIncidentEmbed(incident) {
    const severityColors = {
      'LOW': 3066993,      // Green
      'MEDIUM': 16776960,  // Yellow  
      'HIGH': 16753920,    // Orange
      'CRITICAL': 15158332 // Red
    };

    const severityEmojis = {
      'LOW': '🟢',
      'MEDIUM': '🟡', 
      'HIGH': '🟠',
      'CRITICAL': '🔴'
    };

    const typeEmojis = {
      'Malicious IP Connection': '🌐',
      'Vulnerability Exploitation Attempt': '⚡',
      'Suspicious Port Scanning': '🔍',
      'Threat Intelligence Match': '🎯',
      'Anomalous Network Traffic': '📊',
      'DDoS Attack': '💥',
      'Phishing Attempt': '🎣',
      'Malware Detection': '🦠'
    };

    const embed = {
      title: `🚨 CRITICAL: ${incident.type}`,
      description: `**${incident.sourceIP}** → \`${incident.targetAsset}\`\nValidated threat - immediate action required`,
      color: severityColors[incident.severity] || 15158332,
      fields: [
        {
          name: 'Action Required',
          value: `Investigate \`${incident.id}\` - [Dashboard](http://localhost:3000)`,
          inline: false
        }
      ],
      footer: {
        text: 'CSIRT Automation Platform • Real-time Security Monitoring',
        icon_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f512.png'
      }
    };

    // Add threat intelligence context if available
    if (incident.realData) {
      const contextFields = [];
      
      if (incident.realData.cveId) {
        contextFields.push({
          name: '🔗 CVE Reference',
          value: `[\`${incident.realData.cveId}\`](https://nvd.nist.gov/vuln/detail/${incident.realData.cveId})`,
          inline: true
        });
      }
      
      if (incident.realData.abuseConfidence) {
        contextFields.push({
          name: '🎯 Abuse Confidence',
          value: `${incident.realData.abuseConfidence}%`,
          inline: true
        });
      }
      
      if (incident.realData.country) {
        contextFields.push({
          name: '🌍 Source Country',
          value: incident.realData.country,
          inline: true
        });
      }

      if (contextFields.length > 0) {
        embed.fields.push(...contextFields);
      }
    }

    // Add description field
    if (incident.description) {
      embed.fields.push({
        name: '📝 Description',
        value: incident.description.length > 100 
          ? incident.description.substring(0, 100) + '...'
          : incident.description,
        inline: false
      });
    }

    return embed;
  }

  // Send critical incident summary
  async sendCriticalSummary(metrics) {
    if (!this.enabled) return { success: false, reason: 'Discord webhook not configured' };

    try {
      const embed = {
        title: '🚨 CRITICAL Security Alert Summary',
        description: 'Multiple high-severity incidents detected',
        color: 15158332, // Red
        fields: [
          {
            name: '📊 Active Threats',
            value: `**${metrics.activeThreats}** incidents requiring attention`,
            inline: true
          },
          {
            name: '📈 Total Today',
            value: `**${metrics.totalIncidents}** total incidents processed`,
            inline: true
          },
          {
            name: '⚡ Response Time',
            value: `Average: **${metrics.avgResponseTime}**`,
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'CSIRT Command Center • Automated Security Operations'
        }
      };

      const payload = {
        username: 'CSIRT Security Bot',
        avatar_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png',
        content: '🚨 **ATTENTION: Multiple critical security incidents detected!**',
        embeds: [embed]
      };

      await axios.post(this.webhookUrl, payload);
      console.log('🔔 Critical summary sent to Discord');
      return { success: true };

    } catch (error) {
      console.error('❌ Critical summary Discord notification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Send system status update
  async sendSystemStatus(status = 'online') {
    if (!this.enabled) return { success: false };

    try {
      const statusEmojis = {
        'online': '✅',
        'offline': '🔴', 
        'maintenance': '🔧',
        'warning': '⚠️'
      };

      const embed = {
        title: `${statusEmojis[status]} CSIRT System Status Update`,
        description: `Security monitoring system is now **${status.toUpperCase()}**`,
        color: status === 'online' ? 3066993 : 15158332,
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: '🖥️ System',
            value: 'CSIRT Command Center',
            inline: true
          },
          {
            name: '📍 Status',
            value: `**${status.toUpperCase()}**`,
            inline: true
          },
          {
            name: '⏰ Timestamp',
            value: new Date().toLocaleString(),
            inline: true
          }
        ]
      };

      const payload = {
        username: 'CSIRT System Monitor',
        avatar_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5a5.png',
        embeds: [embed]
      };

      await axios.post(this.webhookUrl, payload);
      console.log(`🔔 System status (${status}) sent to Discord`);
      return { success: true };

    } catch (error) {
      console.error('❌ System status Discord notification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Test Discord webhook connection
  async testConnection() {
    if (!this.enabled) {
      return { success: false, message: 'Discord webhook URL not configured' };
    }

    try {
      const testEmbed = {
        title: '🧪 CSIRT Discord Integration Test',
        description: 'Testing Discord webhook connection for security alerts',
        color: 3066993, // Green
        fields: [
          {
            name: '✅ Connection Status',
            value: 'Successfully connected to Discord',
            inline: false
          },
          {
            name: '⚙️ Configuration',
            value: `Channel: #${this.channelName}\nWebhook: Configured`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'CSIRT Automation Platform • Discord Integration Test'
        }
      };

      const payload = {
        username: 'CSIRT Setup Assistant',
        avatar_url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2699.png',
        embeds: [testEmbed]
      };

      const response = await axios.post(this.webhookUrl, payload);
      
      console.log('✅ Discord connection test successful');
      return { 
        success: true, 
        message: 'Discord webhook connection successful!',
        status: response.status 
      };

    } catch (error) {
      console.error('❌ Discord connection test failed:', error.message);
      return { 
        success: false, 
        message: `Discord webhook test failed: ${error.message}` 
      };
    }
  }
}

module.exports = DiscordNotifier;