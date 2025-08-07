#!/bin/bash

# Production Build Script for Predictive Risk Scoring System

echo "🚀 Starting Production Build Process..."

# Set production environment
export NODE_ENV=production
export VITE_NODE_ENV=production

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Build the application
echo "🏗️ Building application..."
npm run build

# Check build output
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size:"
    du -sh dist/
    
    # Create production manifest
    echo "📝 Creating production manifest..."
    cat > dist/manifest.json << EOF
{
  "appName": "Predictive Risk Scoring",
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "environment": "production",
  "features": {
    "aiRecommendations": true,
    "realTimeMonitoring": true,
    "analytics": true
  }
}
EOF
    
    echo "🎉 Production build ready!"
    echo "📁 Build location: ./dist/"
    echo "🌐 Deploy the contents of ./dist/ to your web server"
else
    echo "❌ Build failed!"
    exit 1
fi 