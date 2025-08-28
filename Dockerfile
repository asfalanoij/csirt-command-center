# Multi-stage Docker build for CSIRT Command Center
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Production backend
FROM node:18-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY server.js ./
COPY .env.example ./

# Copy built frontend
COPY --from=frontend-build /app/client/build ./client/build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S csirt -u 1001
USER csirt

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]