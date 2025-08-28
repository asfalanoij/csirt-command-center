// Security operation constants
const THREAT_SOURCES = [
  'VirusTotal API', 'Shodan', 'AbuseIPDB', 'AlienVault OTX', 
  'MISP Feed', 'Internal Honeypots', 'Email Security Gateway'
];

const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const THREAT_TYPES = [
  'Malware Detection', 'Phishing Attempt', 'DDoS Attack', 
  'Vulnerability Scan', 'Brute Force', 'Data Exfiltration',
  'Suspicious DNS Query', 'Port Scan'
];

const THREAT_DESCRIPTIONS = [
  "Suspicious outbound connections detected",
  "Multiple failed authentication attempts", 
  "Malicious payload identified in email attachment",
  "Anomalous network traffic pattern observed",
  "Unauthorized privilege escalation attempt",
  "Potential data exfiltration activity",
  "Known malware hash detected",
  "Suspicious DNS resolution requests"
];

const DEFAULT_METRICS = {
  totalIncidents: 1247,
  activeThreats: 23,
  resolvedToday: 15,
  avgResponseTime: '4.2m'
};

module.exports = {
  THREAT_SOURCES,
  SEVERITY_LEVELS, 
  THREAT_TYPES,
  THREAT_DESCRIPTIONS,
  DEFAULT_METRICS
};