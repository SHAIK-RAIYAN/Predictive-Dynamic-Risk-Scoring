# Multi-stage Dockerfile for Predictive Risk Scoring System

# Stage 1: Frontend Build
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY "Predictive Risk Scoring/package*.json" ./
COPY "Predictive Risk Scoring/src/" ./src/
COPY "Predictive Risk Scoring/public/" ./public/
COPY "Predictive Risk Scoring/vite.config.js" ./
COPY "Predictive Risk Scoring/tailwind.config.js" ./
COPY "Predictive Risk Scoring/postcss.config.js" ./
COPY "Predictive Risk Scoring/eslint.config.js" ./

# Install dependencies and build
RUN npm ci --production=false
RUN npm run build

# Stage 2: Backend Build
FROM maven:3.8.6-openjdk-17 AS backend-builder

WORKDIR /app/backend

# Copy backend files
COPY backend/pom.xml ./
COPY backend/src ./src

# Build backend
RUN mvn clean package -DskipTests

# Stage 3: Production Runtime
FROM openjdk:17-jre-alpine

# Install nginx for serving frontend
RUN apk add --no-cache nginx

# Create app directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy built backend
COPY --from=backend-builder /app/backend/target/predictive-risk-scoring-*.jar ./app.jar

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting Predictive Risk Scoring System..."' >> /app/start.sh && \
    echo 'nginx' >> /app/start.sh && \
    echo 'java -jar app.jar' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/risk/dashboard/stats || exit 1

# Start the application
CMD ["/app/start.sh"] 