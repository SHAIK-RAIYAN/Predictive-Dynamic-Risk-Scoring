# Production Deployment Guide

## 🚀 Predictive Risk Scoring System - Production Deployment

This guide provides step-by-step instructions for deploying the Predictive Risk Scoring system to production.

## 📋 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+ recommended) or Windows Server 2019+
- **CPU**: 4+ cores
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 50GB+ available space
- **Network**: Stable internet connection

### Software Requirements
- **Docker**: 20.10+ with Docker Compose
- **Java**: OpenJDK 17+ (for backend)
- **Node.js**: 18+ (for frontend builds)
- **Nginx**: 1.18+ (for reverse proxy)

## 🔧 Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Predictive-Dynamic-Risk-Scoring
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
# API Configuration
VITE_API_BASE_URL=https://your-domain.com/api/risk

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key

# Database Configuration (if using PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=risk_scoring
DB_USER=risk_user
DB_PASSWORD=secure_password_123
```

### 3. SSL Certificate Setup (Recommended)
For HTTPS deployment, obtain SSL certificates:
```bash
# Using Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

## 🐳 Docker Deployment (Recommended)

### 1. Build and Deploy with Docker Compose
```bash
# Build the application
docker-compose -f docker-compose.prod.yml build

# Start the services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### 2. Monitor the Deployment
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health status
curl http://localhost/health
curl http://localhost:8080/api/risk/dashboard/stats
```

## 🏗️ Manual Deployment

### 1. Backend Deployment
```bash
# Navigate to backend directory
cd backend

# Build the application
mvn clean package -DskipTests

# Run the application
java -jar target/predictive-risk-scoring-1.0.0.jar \
  --spring.profiles.active=production \
  --server.port=8080
```

### 2. Frontend Deployment
```bash
# Navigate to frontend directory
cd "Predictive Risk Scoring"

# Install dependencies
npm ci --production=false

# Build for production
npm run build

# Deploy to web server
# Copy dist/ contents to your web server directory
```

### 3. Nginx Configuration
Copy the provided `nginx.conf` to your server and configure:
```bash
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Security Configuration

### 1. Firewall Setup
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Database Security
```bash
# Change default passwords
# Enable SSL connections
# Configure connection pooling
# Set up regular backups
```

### 3. API Security
- Enable rate limiting
- Implement API key authentication
- Use HTTPS for all communications
- Regular security audits

## 📊 Monitoring and Logging

### 1. Application Monitoring
```bash
# Health checks
curl http://your-domain.com/health
curl http://your-domain.com:8080/api/risk/dashboard/stats

# Log monitoring
docker-compose -f docker-compose.prod.yml logs -f risk-scoring-app
```

### 2. System Monitoring
```bash
# CPU and Memory usage
htop
free -h

# Disk usage
df -h

# Network connections
netstat -tulpn
```

### 3. Log Rotation
Configure log rotation in `/etc/logrotate.d/`:
```
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nginx nginx
}
```

## 🔄 Backup and Recovery

### 1. Database Backups
```bash
# PostgreSQL backup
pg_dump -h localhost -U risk_user risk_scoring > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U risk_user risk_scoring > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### 2. Application Backups
```bash
# Backup application data
tar -czf app_backup_$(date +%Y%m%d).tar.gz /app/data

# Backup configuration files
cp production.config.js backup/
cp nginx.conf backup/
```

## 🚀 Scaling and Performance

### 1. Horizontal Scaling
```bash
# Scale the application
docker-compose -f docker-compose.prod.yml up -d --scale risk-scoring-app=3

# Load balancer configuration
# Update nginx.conf for multiple backend instances
```

### 2. Performance Optimization
- Enable gzip compression
- Configure caching headers
- Optimize database queries
- Use CDN for static assets

### 3. Resource Limits
```bash
# Set Docker resource limits
docker-compose -f docker-compose.prod.yml up -d \
  --scale risk-scoring-app=2 \
  --limit-cpus=2 \
  --limit-memory=4g
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs risk-scoring-app

# Check port conflicts
netstat -tulpn | grep :8080

# Verify environment variables
docker-compose -f docker-compose.prod.yml config
```

#### 2. Database Connection Issues
```bash
# Test database connectivity
psql -h localhost -U risk_user -d risk_scoring

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

#### 3. Frontend Not Loading
```bash
# Check nginx configuration
nginx -t

# Check nginx logs
tail -f /var/log/nginx/error.log

# Verify static files
ls -la /var/www/html/
```

## 📈 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Database secured and backed up
- [ ] Monitoring and logging set up
- [ ] Health checks implemented
- [ ] Backup strategy in place
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Documentation updated

## 🆘 Support

For deployment issues:
1. Check the logs: `docker-compose logs -f`
2. Verify configuration: `docker-compose config`
3. Test connectivity: `curl http://localhost/health`
4. Review this guide for common solutions

## 📞 Contact

For additional support or questions about deployment, please refer to the project documentation or contact the development team. 