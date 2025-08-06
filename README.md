# 🛡️ Predictive Dynamic Risk Scoring Platform

A comprehensive full-stack cybersecurity platform that uses Machine Learning (Isolation Forest) and rule-based engines to dynamically assess and score security risks for organizational entities in real-time.

## 🎯 Problem Statement

**Insider threats are among the most critical challenges for any organisation. Identifying them at an early stage helps prevent data breaches, minimise downtime, and avoid financial loss.**

### Key Outcomes
- ✅ **Dynamic Risk Scoring**: Assign risk scores (5-50) to specific entities automatically
- ✅ **Pattern Recognition**: Identify rules and patterns that significantly impact each entity
- ✅ **Actionable Insights**: Provide recommendations for configuration adjustments and firewall tuning
- ✅ **Reduced False Positives**: Improve accuracy through better scoring and ML-enhanced detection

## 🏗️ Architecture Overview

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    REST    ┌─────────────────┐
│   React Frontend │ ──────────→ │  Spring Boot    │ ──────────→ │   H2 Database   │
│   (Material-UI)  │             │   Backend       │             │   (In-Memory)   │
└─────────────────┘             └─────────────────┘             └─────────────────┘
         │                               │                               │
         │                               │                               │
         ▼                               ▼                               ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│   Real-time     │             │   ML Engine     │             │   Event Stream  │
│   Dashboard     │             │ (Isolation      │             │   (Kafka Ready) │
│   & Analytics   │             │  Forest)        │             │                 │
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

## 🚀 Technology Stack

### Frontend (React)
- **React 18** with Vite for fast development
- **Material-UI (MUI)** for enterprise-grade components
- **Recharts** for advanced data visualization
- **React Query** for efficient data fetching
- **React Router** for navigation
- **Framer Motion** for smooth animations

### Backend (Java)
- **Spring Boot 3.2** with Java 17
- **Spring Security** for authentication
- **Spring Data JPA** for data persistence
- **Spring WebFlux** for reactive programming
- **Apache Commons Math** for mathematical operations
- **Drools** for rule engine (ready for integration)

### Machine Learning
- **Isolation Forest** algorithm for anomaly detection
- **Custom ML Service** with feature extraction
- **Real-time scoring** with caching
- **Model retraining** capabilities

### Infrastructure
- **H2 Database** (in-memory for development)
- **PostgreSQL** ready for production
- **Kafka** integration ready
- **Prometheus** metrics
- **Docker** support

## 🎨 Key Features

### 1. **Real-time Dashboard**
- Live risk score monitoring
- Interactive charts and visualizations
- Entity health overview
- Alert management

### 2. **Dynamic Risk Assessment**
- ML-powered scoring (5-50 range)
- Rule-based adjustments
- Real-time updates
- Historical trend analysis

### 3. **Entity Management**
- Comprehensive entity tracking
- Risk level categorization
- Activity monitoring
- Bulk operations

### 4. **Advanced Analytics**
- Risk trend analysis
- Department-wise breakdown
- Threat type distribution
- Time-based pattern analysis

### 5. **Actionable Recommendations**
- AI-generated security recommendations
- Priority-based suggestions
- Implementation guidance
- Risk reduction tracking

### 6. **System Settings**
- Configurable risk thresholds
- ML model parameters
- Integration settings
- Performance tuning

## 🛠️ Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- **Java 17** and **Maven 3.8+**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd predictive-risk-scoring
```

### 2. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

### 3. Start the Frontend
```bash
cd "Predictive Risk Scoring"
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/v1
- **H2 Console**: http://localhost:8080/h2-console
- **Actuator**: http://localhost:8080/actuator

## 📊 API Endpoints

### Core Risk Scoring
- `GET /api/v1/risk-scoring/dashboard` - Dashboard statistics
- `POST /api/v1/risk-scoring/assess/{entityId}` - Assess entity risk
- `GET /api/v1/risk-scoring/score/{entityId}` - Get entity risk score
- `GET /api/v1/risk-scoring/entities` - List all entities

### Analytics & Events
- `GET /api/v1/risk-scoring/analytics` - Risk analytics
- `GET /api/v1/risk-scoring/entities/{entityId}/events` - Entity events
- `POST /api/v1/risk-scoring/events` - Submit risk event

### Recommendations & ML
- `GET /api/v1/risk-scoring/recommendations` - Security recommendations
- `GET /api/v1/risk-scoring/ml/status` - ML model status
- `POST /api/v1/risk-scoring/ml/retrain` - Retrain ML models

### System
- `GET /api/v1/risk-scoring/health` - Health check
- `GET /api/v1/risk-scoring/metrics` - System metrics

## 🔧 Configuration

### Risk Scoring Parameters
```yaml
risk:
  scoring:
    ml:
      isolation-forest:
        contamination: 0.1
        n-estimators: 100
        max-samples: 256
    thresholds:
      high: 40
      medium: 25
      low: 15
```

### ML Model Features
The system extracts 20+ features including:
- Authentication patterns
- Network activity
- File access patterns
- Time-based behavior
- Privilege escalation attempts
- Data transfer volumes

## 🎯 Machine Learning Implementation

### Isolation Forest Algorithm
```java
// Simplified implementation for demonstration
public double predict(double[] features) {
    double totalPathLength = 0.0;
    for (IsolationTree tree : trees) {
        totalPathLength += tree.getPathLength(features);
    }
    double avgPathLength = totalPathLength / trees.size();
    return Math.exp(-avgPathLength / getExpectedPathLength(features.length));
}
```

### Feature Engineering
- **Entity Features**: Age, activity level, current risk score
- **Event Features**: Login failures, privilege escalations, file transfers
- **Temporal Features**: After-hours activity, weekend activity
- **Network Features**: Unique IPs, port scans, data transfers

## 🔒 Security Features

- **JWT Authentication** ready
- **CORS** configured for frontend
- **Input validation** and sanitization
- **Rate limiting** capabilities
- **Audit logging** for all operations

## 📈 Monitoring & Observability

- **Prometheus metrics** for system monitoring
- **Health checks** for all components
- **Structured logging** with SLF4J
- **Performance metrics** for ML models
- **Real-time dashboards** for operational insights

## 🚀 Production Deployment

### Docker Support
```bash
# Build backend
cd backend
mvn clean package
docker build -t risk-scoring-backend .

# Build frontend
cd "Predictive Risk Scoring"
npm run build
docker build -t risk-scoring-frontend .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables
```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/riskdb
DB_USERNAME=riskuser
DB_PASSWORD=riskpass

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Security
JWT_SECRET=your-jwt-secret
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd "Predictive Risk Scoring"
npm test
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:8080/api/v1/risk-scoring/health

# Test dashboard
curl http://localhost:8080/api/v1/risk-scoring/dashboard
```

## 📋 Development Roadmap

### Phase 1 (Current) ✅
- [x] Basic ML implementation
- [x] REST API endpoints
- [x] React frontend
- [x] Real-time dashboard

### Phase 2 (Next)
- [ ] Kafka integration
- [ ] Advanced ML models
- [ ] Real-time event processing
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] Cloud deployment
- [ ] Multi-tenant support
- [ ] Advanced threat detection
- [ ] Integration with SIEM systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is developed for the National Hackathon 2024.

## 👥 Team

- **Backend Developer**: Java/Spring Boot expert
- **Frontend Developer**: React/Material-UI specialist
- **ML Engineer**: Isolation Forest implementation
- **DevOps**: Infrastructure and deployment

## 🆘 Support

For hackathon support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the National Hackathon 2024**

*This platform demonstrates the power of Java in cybersecurity applications, combining traditional rule-based systems with modern machine learning techniques to create a comprehensive risk assessment solution.* 