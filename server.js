const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const path = require('path');
const ThreatIntelligence = require('./threat-intelligence');
const DiscordNotifier = require('./discord-notifier');
const { DEFAULT_METRICS } = require('./config/constants');
const { generateMockIncident } = require('./utils/mockData');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ['https://your-domain.com'] : ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws://localhost:5001", "wss://localhost:5001"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://your-domain.com'] : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Threat Intelligence and Discord Notifier
const threatIntel = new ThreatIntelligence();
const discordNotifier = new DiscordNotifier();

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// Real-time security metrics
let securityMetrics = { ...DEFAULT_METRICS };

let recentIncidents = [];


// API Routes
app.get('/api/metrics', (req, res) => {
  res.json(securityMetrics);
});

app.get('/api/incidents', (req, res) => {
  res.json(recentIncidents);
});

// Discord integration endpoints
app.get('/api/discord/test', async (req, res) => {
  const result = await discordNotifier.testConnection();
  res.json(result);
});

app.post('/api/discord/send-summary', async (req, res) => {
  const result = await discordNotifier.sendCriticalSummary(securityMetrics);
  res.json(result);
});

app.post('/api/discord/system-status', async (req, res) => {
  const { status = 'online' } = req.body;
  const result = await discordNotifier.sendSystemStatus(status);
  res.json(result);
});

app.post('/api/incidents/:id/resolve', (req, res) => {
  const incidentId = req.params.id;
  const incidentIndex = recentIncidents.findIndex(inc => inc.id === incidentId);
  
  if (incidentIndex !== -1) {
    recentIncidents[incidentIndex].status = 'RESOLVED';
    recentIncidents[incidentIndex].resolvedAt = new Date().toISOString();
    
    securityMetrics.activeThreats = Math.max(0, securityMetrics.activeThreats - 1);
    securityMetrics.resolvedToday++;
    
    io.emit('incidentResolved', recentIncidents[incidentIndex]);
    io.emit('metricsUpdate', securityMetrics);
    
    res.json({ success: true, incident: recentIncidents[incidentIndex] });
  } else {
    res.status(404).json({ error: 'Incident not found' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected to CSIRT dashboard');
  
  socket.emit('initialData', {
    metrics: securityMetrics,
    incidents: recentIncidents
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Generate real-time security incidents with threat intelligence (every 10-30 seconds)
cron.schedule('*/20 * * * * *', async () => {
  if (Math.random() > 0.2) { // 80% chance of new incident
    try {
      const newIncident = await threatIntel.generateEnhancedIncident();
      recentIncidents.unshift(newIncident);
      
      // Keep only last 50 incidents
      if (recentIncidents.length > 50) {
        recentIncidents.pop();
      }
      
      // Update metrics
      securityMetrics.totalIncidents++;
      if (newIncident.severity === 'HIGH' || newIncident.severity === 'CRITICAL') {
        securityMetrics.activeThreats++;
      }
      
      console.log(`🚨 New ${newIncident.severity} incident: ${newIncident.type} from ${newIncident.sourceIP}`);
      
      // Send only CRITICAL incidents to Discord (after false positive testing)
      if (newIncident.severity === 'CRITICAL') {
        discordNotifier.sendIncidentAlert(newIncident);
      }
      
      io.emit('newIncident', newIncident);
      io.emit('metricsUpdate', securityMetrics);
    } catch (error) {
      console.error('Error generating threat intelligence incident:', error.message);
      // Fallback to original simulation
      const newIncident = generateMockIncident();
      recentIncidents.unshift(newIncident);
      
      securityMetrics.totalIncidents++;
      if (newIncident.severity === 'HIGH' || newIncident.severity === 'CRITICAL') {
        securityMetrics.activeThreats++;
      }
      
      // Send only CRITICAL incidents to Discord (after false positive testing)
      if (newIncident.severity === 'CRITICAL') {
        discordNotifier.sendIncidentAlert(newIncident);
      }
      
      io.emit('newIncident', newIncident);
      io.emit('metricsUpdate', securityMetrics);
    }
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 CSIRT Command Center running on port ${PORT}`);
  console.log(`📊 Security Operations Dashboard: http://localhost:${PORT}`);
  
  // Send system startup notification to Discord
  setTimeout(() => {
    discordNotifier.sendSystemStatus('online');
  }, 2000); // Wait 2 seconds for server to fully start
});