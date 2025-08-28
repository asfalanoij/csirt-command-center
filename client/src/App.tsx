import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { Shield, AlertTriangle, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import './App.css';

interface SecurityIncident {
  id: string;
  timestamp: string;
  source: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceIP: string;
  targetAsset: string;
  status: 'ACTIVE' | 'RESOLVED';
  description: string;
  resolvedAt?: string;
}

interface SecurityMetrics {
  totalIncidents: number;
  activeThreats: number;
  resolvedToday: number;
  avgResponseTime: string;
}

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5001';

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalIncidents: 0,
    activeThreats: 0,
    resolvedToday: 0,
    avgResponseTime: '0m'
  });
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('Connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
    });

    newSocket.on('initialData', (data: any) => {
      setMetrics(data.metrics);
      setIncidents(data.incidents);
    });

    newSocket.on('newIncident', (incident: SecurityIncident) => {
      setIncidents(prev => [incident, ...prev.slice(0, 49)]);
    });

    newSocket.on('metricsUpdate', (newMetrics: SecurityMetrics) => {
      setMetrics(newMetrics);
    });

    newSocket.on('incidentResolved', (resolvedIncident: SecurityIncident) => {
      setIncidents(prev => 
        prev.map(inc => 
          inc.id === resolvedIncident.id ? resolvedIncident : inc
        )
      );
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleResolveIncident = async (incidentId: string) => {
    try {
      const response = await fetch(`${SOCKET_URL}/api/incidents/${incidentId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error('Failed to resolve incident');
      }
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'green';
      case 'MEDIUM': return 'yellow';
      case 'HIGH': return 'orange';
      case 'CRITICAL': return 'red';
      default: return 'gray';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    },
    header: {
      borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
      backgroundColor: 'rgba(10, 14, 39, 0.5)',
      padding: '1rem 0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    titleText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#00d4ff',
      margin: 0
    },
    subtitle: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      margin: 0
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontFamily: 'JetBrains Mono, monospace'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem 1rem'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    metricCard: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)'
    },
    metricCardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    metricValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#00d4ff',
      margin: '0.25rem 0'
    },
    metricLabel: {
      color: '#9ca3af',
      fontSize: '0.875rem',
      margin: 0
    },
    incidentsPanel: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    },
    incidentsHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid rgba(0, 212, 255, 0.3)'
    },
    incidentsTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#00d4ff',
      margin: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const
    },
    tableHeader: {
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      padding: '0.75rem 1.5rem',
      textAlign: 'left' as const,
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#9ca3af',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
    },
    tableRow: {
      borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
    },
    tableCell: {
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      color: '#d1d5db'
    },
    severityBadge: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '0.25rem',
      border: '1px solid'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      borderRadius: '0.25rem',
      border: '1px solid'
    },
    resolveButton: {
      color: '#00ff88',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    footer: {
      marginTop: '2rem',
      textAlign: 'center' as const,
      color: '#9ca3af',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.title}>
            <Shield size={32} color="#00d4ff" />
            <div>
              <h1 style={styles.titleText}>CSIRT Command Center</h1>
              <p style={styles.subtitle}>Real-time Security Operations Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              ...styles.status,
              color: connectionStatus === 'Connected' ? '#00ff88' : '#ff0055'
            }}>
              <Activity size={16} />
              <span>{connectionStatus}</span>
            </div>
            <div style={styles.subtitle}>
              by <span style={{ color: '#00d4ff', fontWeight: '600' }}>Rudy Prasetiya</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Metrics Grid */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricCardContent}>
              <div>
                <p style={styles.metricLabel}>Total Incidents</p>
                <p style={styles.metricValue}>{metrics.totalIncidents.toLocaleString()}</p>
              </div>
              <Shield size={32} color="#00d4ff" opacity={0.6} />
            </div>
          </div>

          <div style={{...styles.metricCard, borderColor: 'rgba(255, 0, 85, 0.3)'}}>
            <div style={styles.metricCardContent}>
              <div>
                <p style={styles.metricLabel}>Active Threats</p>
                <p style={{...styles.metricValue, color: '#ff0055'}}>{metrics.activeThreats}</p>
              </div>
              <AlertTriangle size={32} color="#ff0055" opacity={0.6} />
            </div>
          </div>

          <div style={{...styles.metricCard, borderColor: 'rgba(0, 255, 136, 0.3)'}}>
            <div style={styles.metricCardContent}>
              <div>
                <p style={styles.metricLabel}>Resolved Today</p>
                <p style={{...styles.metricValue, color: '#00ff88'}}>{metrics.resolvedToday}</p>
              </div>
              <CheckCircle size={32} color="#00ff88" opacity={0.6} />
            </div>
          </div>

          <div style={{...styles.metricCard, borderColor: 'rgba(255, 170, 0, 0.3)'}}>
            <div style={styles.metricCardContent}>
              <div>
                <p style={styles.metricLabel}>Avg Response</p>
                <p style={{...styles.metricValue, color: '#ffaa00'}}>{metrics.avgResponseTime}</p>
              </div>
              <Clock size={32} color="#ffaa00" opacity={0.6} />
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div style={styles.incidentsPanel}>
          <div style={styles.incidentsHeader}>
            <h2 style={styles.incidentsTitle}>Recent Security Incidents</h2>
            <p style={{...styles.subtitle, marginTop: '0.25rem'}}>Live monitoring of security events and threats</p>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Time</th>
                  <th style={styles.tableHeader}>Severity</th>
                  <th style={styles.tableHeader}>Type</th>
                  <th style={styles.tableHeader}>Source</th>
                  <th style={styles.tableHeader}>Target</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 20).map((incident) => (
                  <tr key={incident.id} style={styles.tableRow}>
                    <td style={{...styles.tableCell, fontFamily: 'JetBrains Mono, monospace'}}>
                      {formatTime(incident.timestamp)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.severityBadge,
                        color: getSeverityColor(incident.severity),
                        borderColor: getSeverityColor(incident.severity),
                        backgroundColor: `${getSeverityColor(incident.severity)}20`
                      }}>
                        {incident.severity}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{incident.type}</td>
                    <td style={{...styles.tableCell, fontFamily: 'JetBrains Mono, monospace'}}>
                      {incident.sourceIP}
                    </td>
                    <td style={{...styles.tableCell, fontFamily: 'JetBrains Mono, monospace'}}>
                      {incident.targetAsset}
                    </td>
                    <td style={styles.tableCell}>
                      {incident.status === 'ACTIVE' ? (
                        <span style={{
                          ...styles.statusBadge,
                          color: '#ff0055',
                          borderColor: '#ff0055',
                          backgroundColor: 'rgba(255, 0, 85, 0.1)'
                        }}>
                          <XCircle size={12} />
                          ACTIVE
                        </span>
                      ) : (
                        <span style={{
                          ...styles.statusBadge,
                          color: '#00ff88',
                          borderColor: '#00ff88',
                          backgroundColor: 'rgba(0, 255, 136, 0.1)'
                        }}>
                          <CheckCircle size={12} />
                          RESOLVED
                        </span>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {incident.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleResolveIncident(incident.id)}
                          style={styles.resolveButton}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>🔐 CSIRT Automation Platform • Built by Rudy Prasetiya • Enterprise Security Operations</p>
          <p style={{ marginTop: '0.25rem' }}>Real-time threat detection, automated incident response, and security orchestration</p>
        </div>
      </div>
    </div>
  );
}

export default App;