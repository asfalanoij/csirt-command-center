# 📡 API Documentation

## Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://your-domain.com/api`

## Endpoints

### 📊 Security Metrics

#### GET `/api/metrics`
Retrieves current security metrics and KPIs.

**Response:**
```json
{
  "totalIncidents": 1247,
  "activeThreats": 23,
  "resolvedToday": 15,
  "avgResponseTime": "4.2m"
}
```

---

### 🚨 Security Incidents

#### GET `/api/incidents`
Retrieves recent security incidents.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "timestamp": "2025-08-28T12:30:45.123Z",
    "source": "VirusTotal API",
    "type": "Malware Detection",
    "severity": "HIGH",
    "sourceIP": "192.168.1.100",
    "targetAsset": "srv-42.corp.local",
    "status": "ACTIVE",
    "description": "Suspicious outbound connections detected"
  }
]
```

#### POST `/api/incidents/:id/resolve`
Resolves a specific security incident.

**Parameters:**
- `id` (string): Incident UUID

**Response:**
```json
{
  "success": true,
  "message": "Incident resolved successfully",
  "incident": {
    "id": "uuid-string",
    "status": "RESOLVED",
    "resolvedAt": "2025-08-28T12:35:22.456Z"
  }
}
```

---

### 🔔 Discord Integration

#### GET `/api/discord/test`
Tests Discord webhook connection.

**Response:**
```json
{
  "success": true,
  "message": "Discord connection successful"
}
```

#### POST `/api/discord/send-summary`
Sends security metrics summary to Discord.

**Response:**
```json
{
  "success": true,
  "message": "Summary sent to Discord successfully"
}
```

#### POST `/api/discord/system-status`
Updates system status in Discord.

**Request Body:**
```json
{
  "status": "online" // or "offline", "maintenance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "System status updated"
}
```

---

## WebSocket Events

### Client → Server

| Event | Description | Payload |
|-------|-------------|---------|
| `connection` | Client connects to dashboard | - |
| `disconnect` | Client disconnects | - |

### Server → Client

| Event | Description | Payload |
|-------|-------------|---------|
| `newIncident` | New security incident created | `Incident` object |
| `incidentResolved` | Incident has been resolved | `{id: string, status: 'RESOLVED'}` |
| `metricsUpdate` | Security metrics updated | `Metrics` object |

---

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Headers

All API responses include security headers via Helmet:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)
- `Content-Security-Policy`

---

## Rate Limiting

- **Development**: No rate limiting
- **Production**: 1000 requests/hour per IP

---

## Authentication

Currently using IP-based access control. For production:
- API Key authentication recommended
- JWT tokens for session management
- Role-based access control (RBAC)