const { v4: uuidv4 } = require('uuid');
const { 
  THREAT_SOURCES, 
  SEVERITY_LEVELS, 
  THREAT_TYPES, 
  THREAT_DESCRIPTIONS 
} = require('../config/constants');

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMockIncident() {
  const incident = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    source: getRandomElement(THREAT_SOURCES),
    type: getRandomElement(THREAT_TYPES),
    severity: getRandomElement(SEVERITY_LEVELS),
    sourceIP: generateRandomIP(),
    targetAsset: `srv-${Math.floor(Math.random() * 100)}.corp.local`,
    status: 'ACTIVE',
    description: getRandomElement(THREAT_DESCRIPTIONS)
  };
  
  return incident;
}

module.exports = {
  generateMockIncident,
  generateRandomIP
};