@echo off
chcp 65001 >nul
echo 🚀 Starting Predictive Dynamic Risk Scoring Platform...
echo ==================================================

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Maven is not installed. Please install Maven 3.8 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

echo 🔧 Starting Spring Boot Backend...
cd backend
echo 📦 Building backend with Maven...
call mvn clean compile -q
echo 🚀 Starting backend server...
start "Backend Server" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo 🎨 Starting React Frontend...
cd "Predictive Risk Scoring"
echo 📦 Installing dependencies...
call npm install --silent
echo 🚀 Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Predictive Dynamic Risk Scoring Platform is starting!
echo ==================================================
echo 📊 Frontend Dashboard: http://localhost:5173
echo 🔧 Backend API: http://localhost:8080/api/v1
echo 🗄️  H2 Database Console: http://localhost:8080/h2-console
echo 📈 Actuator Endpoints: http://localhost:8080/actuator
echo.
echo 🔑 Default Credentials:
echo    Username: admin
echo    Password: admin123
echo.
echo 📋 Available API Endpoints:
echo    GET  /api/v1/risk-scoring/dashboard
echo    POST /api/v1/risk-scoring/assess/{entityId}
echo    GET  /api/v1/risk-scoring/entities
echo    GET  /api/v1/risk-scoring/analytics
echo    GET  /api/v1/risk-scoring/recommendations
echo.
echo 🛑 Close the command windows to stop the services
echo.
pause 