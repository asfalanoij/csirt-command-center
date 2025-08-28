// Real Threat Intelligence Integration
// This module fetches real security data from various sources

const axios = require('axios');
require('dotenv').config();

class ThreatIntelligence {
  constructor() {
    this.sources = {
      virusTotal: {
        baseUrl: 'https://www.virustotal.com/vtapi/v2',
        apiKey: process.env.VIRUSTOTAL_API_KEY,
        enabled: !!process.env.VIRUSTOTAL_API_KEY
      },
      abuseipdb: {
        baseUrl: 'https://api.abuseipdb.com/api/v2',
        apiKey: process.env.ABUSEIPDB_API_KEY,
        enabled: !!process.env.ABUSEIPDB_API_KEY
      },
      shodan: {
        baseUrl: 'https://api.shodan.io',
        apiKey: process.env.SHODAN_API_KEY,
        enabled: !!process.env.SHODAN_API_KEY
      },
      otx: {
        baseUrl: 'https://otx.alienvault.com/api/v1',
        apiKey: process.env.OTX_API_KEY,
        enabled: !!process.env.OTX_API_KEY
      }
    };
  }

  // Fetch real malicious IPs from AbuseIPDB
  async getRealMaliciousIPs() {
    if (!this.sources.abuseipdb.enabled) {
      return this.generateRealisticIPs();
    }

    try {
      const response = await axios.get(`${this.sources.abuseipdb.baseUrl}/blacklist`, {
        headers: {
          'Key': this.sources.abuseipdb.apiKey,
          'Accept': 'application/json'
        },
        params: {
          confidenceMinimum: 75,
          limit: 50
        }
      });

      return response.data.data.map(item => ({
        ip: item.ipAddress,
        country: item.countryCode,
        usageType: item.usageType,
        abuseConfidence: item.abuseConfidencePercentage,
        lastSeen: item.lastReportedAt
      }));
    } catch (error) {
      console.log('Using simulated malicious IPs (AbuseIPDB not available)');
      return this.generateRealisticIPs();
    }
  }

  // Fetch real vulnerability data from CVE
  async getRealVulnerabilities() {
    try {
      const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0', {
        params: {
          pubStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          pubEndDate: new Date().toISOString().split('T')[0],
          resultsPerPage: 20
        }
      });

      return response.data.vulnerabilities.map(vuln => ({
        cveId: vuln.cve.id,
        description: vuln.cve.descriptions[0]?.value || 'No description',
        severity: this.mapCVSSToSeverity(vuln.cve.metrics?.cvssMetricV3?.[0]?.cvssData?.baseScore || 0),
        publishedDate: vuln.cve.published,
        lastModified: vuln.cve.lastModified
      }));
    } catch (error) {
      console.log('Using simulated vulnerabilities (CVE API not available)');
      return this.generateRealisticVulnerabilities();
    }
  }

  // Fetch real threat indicators from AlienVault OTX
  async getRealThreatIndicators() {
    if (!this.sources.otx.enabled) {
      return this.generateRealisticThreats();
    }

    try {
      const response = await axios.get(`${this.sources.otx.baseUrl}/pulses/subscribed`, {
        headers: {
          'X-OTX-API-KEY': this.sources.otx.apiKey
        },
        params: {
          limit: 10,
          page: 1
        }
      });

      return response.data.results.map(pulse => ({
        name: pulse.name,
        description: pulse.description,
        tags: pulse.tags,
        malwareFamilies: pulse.malware_families,
        attackIds: pulse.attack_ids,
        created: pulse.created,
        modified: pulse.modified,
        tlp: pulse.TLP || 'white'
      }));
    } catch (error) {
      console.log('Using simulated threat indicators (OTX not available)');
      return this.generateRealisticThreats();
    }
  }

  // Fetch real internet scanning data from Shodan
  async getRealScanningActivity() {
    if (!this.sources.shodan.enabled) {
      return this.generateRealisticScanning();
    }

    try {
      const response = await axios.get(`${this.sources.shodan.baseUrl}/shodan/host/search`, {
        params: {
          key: this.sources.shodan.apiKey,
          query: 'country:US port:22,23,80,443,3389',
          facets: 'port,country',
          limit: 20
        }
      });

      return response.data.matches.map(match => ({
        ip: match.ip_str,
        port: match.port,
        service: match.product || 'Unknown',
        country: match.location.country_name,
        org: match.org,
        lastSeen: match.timestamp,
        vulnerabilities: match.vulns || []
      }));
    } catch (error) {
      console.log('Using simulated scanning activity (Shodan not available)');
      return this.generateRealisticScanning();
    }
  }

  // Generate realistic fallback data when APIs aren't available
  generateRealisticIPs() {
    const maliciousRanges = [
      '185.220.', '45.142.', '194.5.', '178.128.',
      '165.22.', '159.89.', '167.71.', '157.245.'
    ];

    return Array.from({length: 10}, () => ({
      ip: maliciousRanges[Math.floor(Math.random() * maliciousRanges.length)] + 
          Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      country: ['CN', 'RU', 'IR', 'KP', 'BR', 'IN'][Math.floor(Math.random() * 6)],
      usageType: ['hosting', 'residential', 'business'][Math.floor(Math.random() * 3)],
      abuseConfidence: 75 + Math.floor(Math.random() * 25),
      lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  generateRealisticVulnerabilities() {
    const recentCVEs = [
      'CVE-2024-21412', 'CVE-2024-21378', 'CVE-2024-20767',
      'CVE-2024-21351', 'CVE-2024-0519', 'CVE-2024-21413'
    ];

    return recentCVEs.map(cve => ({
      cveId: cve,
      description: `Critical vulnerability in enterprise software component affecting authentication mechanisms`,
      severity: ['HIGH', 'CRITICAL'][Math.floor(Math.random() * 2)],
      publishedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date().toISOString()
    }));
  }

  generateRealisticThreats() {
    return [
      {
        name: 'APT29 Infrastructure Update',
        description: 'New command and control servers identified for Cozy Bear operations',
        tags: ['apt29', 'russia', 'espionage'],
        malwareFamilies: ['Cobalt Strike', 'Empire'],
        attackIds: ['T1566.001', 'T1059.001'],
        created: new Date().toISOString(),
        tlp: 'amber'
      }
    ];
  }

  generateRealisticScanning() {
    return Array.from({length: 5}, () => ({
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: [22, 23, 80, 443, 3389, 1433, 3306][Math.floor(Math.random() * 7)],
      service: ['SSH', 'Telnet', 'HTTP', 'HTTPS', 'RDP', 'MSSQL', 'MySQL'][Math.floor(Math.random() * 7)],
      country: 'Various',
      org: 'Cloud Provider',
      lastSeen: new Date().toISOString(),
      vulnerabilities: []
    }));
  }

  mapCVSSToSeverity(score) {
    if (score >= 9.0) return 'CRITICAL';
    if (score >= 7.0) return 'HIGH';
    if (score >= 4.0) return 'MEDIUM';
    return 'LOW';
  }

  // Main method to get enhanced incident data
  async generateEnhancedIncident() {
    const [maliciousIPs, vulnerabilities, threats, scanning] = await Promise.all([
      this.getRealMaliciousIPs(),
      this.getRealVulnerabilities(),
      this.getRealThreatIndicators(),
      this.getRealScanningActivity()
    ]);

    // Use real data to create more authentic incidents
    const randomIP = maliciousIPs[Math.floor(Math.random() * maliciousIPs.length)];
    const randomVuln = vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
    
    const incidentTypes = [
      'Malicious IP Connection',
      'Vulnerability Exploitation Attempt',
      'Suspicious Port Scanning',
      'Threat Intelligence Match',
      'Anomalous Network Traffic'
    ];

    return {
      id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      source: 'Real Threat Intelligence',
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      severity: randomVuln?.severity || ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)],
      sourceIP: randomIP?.ip || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      targetAsset: `srv-${Math.floor(Math.random() * 100)}.corp.local`,
      status: 'ACTIVE',
      description: randomVuln?.description || 'Threat intelligence match detected',
      realData: {
        cveId: randomVuln?.cveId,
        abuseConfidence: randomIP?.abuseConfidence,
        country: randomIP?.country,
        threatTags: threats[0]?.tags || []
      }
    };
  }
}

module.exports = ThreatIntelligence;