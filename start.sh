#!/bin/bash

# 🛡️ Predictive Dynamic Risk Scoring Platform - Quick Start Script
# National Hackathon 2024

echo "🚀 Starting Predictive Dynamic Risk Scoring Platform..."
echo "=================================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.8 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Function to start backend
start_backend() {
    echo "🔧 Starting Spring Boot Backend..."
    cd backend
    echo "📦 Building backend with Maven..."
    mvn clean compile -q
    echo "🚀 Starting backend server..."
    mvn spring-boot:run &
    BACKEND_PID=$!
    cd ..
    echo "✅ Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting React Frontend..."
    cd "Predictive Risk Scoring"
    echo "📦 Installing dependencies..."
    npm install --silent
    echo "🚀 Starting frontend development server..."
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "✅ Frontend started with PID: $FRONTEND_PID"
}

# Function to wait for services
wait_for_services() {
    echo "⏳ Waiting for services to start..."
    
    # Wait for backend
    echo "🔍 Checking backend health..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/api/v1/risk-scoring/health > /dev/null; then
            echo "✅ Backend is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ Backend failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    # Wait for frontend
    echo "🔍 Checking frontend health..."
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null; then
            echo "✅ Frontend is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ Frontend failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
    done
}

# Function to show status
show_status() {
    echo ""
    echo "🎉 Predictive Dynamic Risk Scoring Platform is running!"
    echo "=================================================="
    echo "📊 Frontend Dashboard: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:8080/api/v1"
    echo "🗄️  H2 Database Console: http://localhost:8080/h2-console"
    echo "📈 Actuator Endpoints: http://localhost:8080/actuator"
    echo ""
    echo "🔑 Default Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📋 Available API Endpoints:"
    echo "   GET  /api/v1/risk-scoring/dashboard"
    echo "   POST /api/v1/risk-scoring/assess/{entityId}"
    echo "   GET  /api/v1/risk-scoring/entities"
    echo "   GET  /api/v1/risk-scoring/analytics"
    echo "   GET  /api/v1/risk-scoring/recommendations"
    echo ""
    echo "🛑 To stop the services, press Ctrl+C"
    echo ""
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Check if Docker is available for alternative deployment
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected! You can also run with: docker-compose up -d"
    echo ""
fi

# Start services
start_backend
sleep 5
start_frontend

# Wait for services to be ready
wait_for_services

# Show status
show_status

# Keep script running
while true; do
    sleep 1
done 