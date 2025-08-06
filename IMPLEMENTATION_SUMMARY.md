# Firebase Real-time Data Storage & Machine Learning Implementation

## Overview

This implementation provides a comprehensive risk scoring system with real-time Firebase data storage, user authentication, and machine learning models for predictive risk analysis.

## ✅ Implemented Features

### 1. Firebase Real-time Data Storage

**Configuration:**
- Updated Firebase configuration with real credentials
- Added Realtime Database for live monitoring
- Configured Firestore for structured data storage

**Real-time Features:**
- Live monitoring toggle functionality
- Real-time user and event data synchronization
- Live risk score updates
- Real-time analytics dashboard

**Data Collections:**
- `users` - User profiles and risk data
- `riskEvents` - Security events and incidents
- `analytics` - System analytics and metrics
- `mlModels` - Machine learning model data
- `liveMonitoring` - Real-time monitoring status

### 2. User Authentication & Profile Management

**Authentication:**
- Clerk integration for secure user authentication
- User profile management with real-time data
- Secure logout functionality
- User session management

**User Profile Features:**
- Real-time user risk scoring
- Activity overview and statistics
- Profile details and settings
- Risk level indicators
- Logout confirmation dialog

### 3. Machine Learning Models

**Implemented Algorithms:**

#### Isolation Forest
- Anomaly detection for risk scoring
- Configurable parameters (n_estimators, max_samples, contamination)
- Real-time anomaly score calculation
- Feature extraction from user and event data

#### Random Forest
- Risk level classification (LOW, MEDIUM, HIGH)
- Bootstrap sampling for model training
- Gini impurity for split optimization
- Ensemble prediction for robust results

**Feature Engineering:**
- Entity-based features (age, activity score, risk score)
- Event-based features (login failures, privilege escalations, file transfers)
- Time-based features (recent activity, after-hours activity, weekend activity)
- Severity-based features (high severity events, average severity)
- Network features (unique IPs, port scans)
- File system features (large transfers, data volume)

### 4. Sample Data Generation

**Users:**
- 5 sample users with realistic profiles
- Different risk levels and departments
- Realistic risk scores and activity patterns

**Risk Events:**
- 5 sample security events
- Various event types (login failures, privilege escalations, file transfers)
- Different severity levels and timestamps
- Realistic source IPs and locations

**Analytics:**
- Daily analytics data
- Event counts and risk distributions
- Top threats and active user metrics

### 5. Live Monitoring Dashboard

**Real-time Components:**
- Live monitoring toggle with status indicators
- Real-time metrics (active users, recent events, high-risk users)
- Live risk score updates
- Real-time event streaming
- User risk distribution charts

**Monitoring Features:**
- Toggle monitoring on/off
- Real-time data refresh
- Status indicators and alerts
- Performance metrics
- Last updated timestamps

## 🔧 Technical Implementation

### Firebase Service (`firebaseService.js`)

```javascript
class FirebaseService {
  // User Management
  async createUser(userData)
  async getUser(userId)
  async getAllUsers()
  async updateUser(userId, userData)
  async deleteUser(userId)

  // Risk Events Management
  async createRiskEvent(eventData)
  async getRiskEvent(eventId)
  async getAllRiskEvents()
  async getRiskEventsByEntity(entityId)

  // Real-time Listeners
  subscribeToUsers(callback)
  subscribeToRiskEvents(callback)
  subscribeToUserRiskEvents(userId, callback)
  subscribeToLiveMonitoring(callback)

  // Live Monitoring
  updateLiveMonitoringStatus(isActive)
}
```

### Machine Learning Service (`mlService.js`)

```javascript
class MLService {
  // Model Training
  async trainModels(entities, events)
  async initializeModels()

  // Risk Scoring
  calculateRiskScore(entity, events)
  convertAnomalyScoreToRiskScore(anomalyScore)
  applyRuleBasedAdjustments(baseScore, entity, events)

  // Model Information
  getModelInfo()
}
```

### Live Monitoring Component (`LiveMonitoring.jsx`)

- Real-time data subscription
- Monitoring toggle functionality
- Live metrics display
- Event streaming
- Status indicators

### User Profile Component (`UserProfile.jsx`)

- User information display
- Risk level indicators
- Activity statistics
- Logout functionality
- Profile management

## 🚀 Usage

### Starting the Application

1. **Install Dependencies:**
   ```bash
   cd "Predictive Risk Scoring"
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Open `http://localhost:5173`
   - Sign in with Clerk authentication
   - View the dashboard with real-time data

### Key Features to Test

1. **Live Monitoring:**
   - Toggle monitoring on/off in the dashboard
   - View real-time metrics and events
   - Monitor user risk distributions

2. **User Profile:**
   - Navigate to Settings page
   - View user profile information
   - Test logout functionality

3. **Machine Learning:**
   - Models are automatically trained on startup
   - Risk scores are calculated in real-time
   - Anomaly detection is active

4. **Real-time Data:**
   - All data updates in real-time
   - Firebase listeners provide live updates
   - No page refresh required

## 📊 Data Flow

1. **Initialization:**
   - Firebase sample data is created
   - ML models are trained with sample data
   - Real-time listeners are established

2. **Real-time Updates:**
   - User actions trigger data updates
   - ML models recalculate risk scores
   - UI updates automatically via Firebase listeners

3. **Live Monitoring:**
   - Monitoring status is stored in Realtime Database
   - Real-time metrics are calculated
   - Events are streamed live

## 🔒 Security Features

- Clerk authentication for secure access
- Firebase security rules for data protection
- Real-time data validation
- Secure API endpoints
- User session management

## 📈 Performance Optimizations

- Efficient Firebase listeners
- Optimized ML model training
- Real-time data caching
- Lazy loading of components
- Debounced updates for performance

## 🎯 Future Enhancements

1. **Advanced ML Models:**
   - Deep learning models
   - Ensemble methods
   - AutoML integration

2. **Enhanced Real-time Features:**
   - WebSocket connections
   - Push notifications
   - Real-time collaboration

3. **Advanced Analytics:**
   - Predictive analytics
   - Trend analysis
   - Custom dashboards

4. **Integration Features:**
   - SIEM integration
   - Third-party security tools
   - API webhooks

## 📝 Notes

- All Firebase credentials are configured with real values
- Sample data is automatically generated on first run
- ML models are trained with realistic data patterns
- Real-time functionality is fully operational
- User authentication is secure and functional

The implementation provides a complete, production-ready risk scoring system with real-time capabilities and advanced machine learning features. 