# Risk Scoring System Documentation

## 🔍 Risk Score Evaluation Factors

### **Primary Risk Factors (Weighted Scoring)**

The system evaluates risk based on the following factors with their respective weights:

#### 1. **Unusual Login Time** (Weight: 15%)
- **Description**: Login attempts outside normal business hours
- **Score Range**: 5-15 points
- **Detection**: Time-based analysis of login patterns
- **Risk Level**: Medium

#### 2. **Large File Transfer** (Weight: 25%)
- **Description**: Transfer of files larger than 100MB
- **Score Range**: 8-20 points
- **Detection**: File size monitoring and transfer analysis
- **Risk Level**: High

#### 3. **Failed Authentication** (Weight: 20%)
- **Description**: Multiple failed login attempts
- **Score Range**: 3-15 points
- **Detection**: Authentication failure tracking
- **Risk Level**: Medium-High

#### 4. **Privilege Escalation** (Weight: 30%)
- **Description**: Access to restricted resources or admin panels
- **Score Range**: 10-25 points
- **Detection**: Permission level monitoring
- **Risk Level**: Critical

#### 5. **Network Anomaly** (Weight: 10%)
- **Description**: Unusual network traffic patterns
- **Score Range**: 2-10 points
- **Detection**: Network traffic analysis
- **Risk Level**: Low-Medium

### **Risk Level Classification**

| Risk Score Range | Level | Color | Action Required |
|------------------|-------|-------|-----------------|
| 0-19 | Low | Green | Monitor |
| 20-29 | Medium | Yellow | Review |
| 30-39 | High | Orange | Investigate |
| 40+ | Critical | Red | Immediate Action |

### **Dynamic Risk Calculation Formula**

```javascript
// Base risk score calculation
const baseScore = Math.abs(entityId.hashCode() % 50) + 5;

// Factor-based scoring
const factorScore = factors.reduce((total, factor) => {
  return total + (factor.score * factor.weight);
}, 0);

// Final risk score
const finalRiskScore = Math.max(5, Math.min(50, baseScore + factorScore));
```

## 🤖 Gemini AI Integration for Recommendations

### **AI-Powered Risk Reduction Recommendations**

The system uses Google's Gemini AI to generate contextual security recommendations:

#### **Prompt Structure**
```javascript
const prompt = `
  Based on the following security risk data, provide specific, actionable security recommendations:
  
  Entity ID: ${entityId}
  Risk Score: ${riskData.overallScore}
  Risk Level: ${riskData.riskLevel}
  Risk Factors: ${JSON.stringify(riskData.factors)}
  
  Please provide 3-5 specific, actionable security recommendations with:
  1. Clear action items
  2. Priority level (High/Medium/Low)
  3. Estimated effort (Low/Medium/High)
  4. Expected impact on risk reduction
  5. Implementation timeline
  
  Format as JSON array with objects containing: title, description, priority, effort, impact, timeline
`;
```

#### **AI Recommendation Categories**

1. **Authentication Enhancements**
   - Multi-Factor Authentication (MFA)
   - Password policy strengthening
   - Biometric authentication

2. **Access Control Improvements**
   - Least privilege principle
   - Role-based access control (RBAC)
   - Privilege escalation monitoring

3. **Network Security**
   - Firewall rule optimization
   - Network segmentation
   - Intrusion detection systems

4. **Data Protection**
   - Data loss prevention (DLP)
   - Encryption implementation
   - Backup and recovery

5. **Monitoring & Detection**
   - Enhanced logging
   - Real-time threat detection
   - Security information and event management (SIEM)

### **Fallback Recommendations**

When AI is unavailable, the system provides fallback recommendations:

```javascript
getFallbackRecommendations(riskData) {
  const recommendations = [];
  
  if (riskData.overallScore > 35) {
    recommendations.push({
      title: 'Immediate Security Review',
      description: 'Conduct comprehensive security audit for high-risk entity',
      priority: 'High',
      effort: 'High',
      impact: 'Critical',
      timeline: '1-2 weeks'
    });
  }
  
  recommendations.push({
    title: 'Enhanced Monitoring',
    description: 'Implement additional logging and monitoring for suspicious activities',
    priority: 'Medium',
    effort: 'Medium',
    impact: 'High',
    timeline: '1 week'
  });
  
  return recommendations;
}
```

## 📊 Real-Time Data Flow

### **Firebase Data Structure**

#### **Entities Collection**
```javascript
{
  id: 'user-john.doe',
  name: 'John Doe',
  type: 'User',
  department: 'Engineering',
  riskScore: 45,
  status: 'High',
  lastActivity: '2 min ago',
  ipAddress: '192.168.1.100',
  email: 'john.doe@company.com',
  createdAt: serverTimestamp()
}
```

#### **Risk Events Collection**
```javascript
{
  entityId: 'user-john.doe',
  eventType: 'LOGIN_FAILURE',
  severity: 'HIGH',
  description: 'Multiple failed login attempts',
  riskScore: 15,
  timestamp: serverTimestamp(),
  ipAddress: '192.168.1.100'
}
```

#### **Analytics Collection**
```javascript
{
  riskTrends: [
    { month: 'Jan', avgScore: 28, highRisk: 15, mediumRisk: 45, lowRisk: 120 },
    // ... more months
  ],
  departmentRisk: [
    { department: 'Engineering', avgScore: 35, entities: 45 },
    // ... more departments
  ],
  threatTypes: [
    { type: 'Privilege Escalation', count: 45, percentage: 35 },
    // ... more threat types
  ]
}
```

## 🔄 Machine Learning Integration

### **Isolation Forest Algorithm**
- **Purpose**: Anomaly detection
- **Implementation**: Detects unusual behavior patterns
- **Output**: Anomaly scores for entities

### **Random Forest Algorithm**
- **Purpose**: Risk classification
- **Implementation**: Classifies entities into risk levels
- **Output**: Risk level predictions

### **Feature Engineering**
```javascript
const features = {
  entityAge: calculateEntityAge(entity),
  activityScore: calculateActivityScore(entity),
  eventCount: getEventCount(entity),
  timeBasedFeatures: extractTimeFeatures(entity),
  networkFeatures: extractNetworkFeatures(entity)
};
```

## 🎯 Risk Assessment Process

### **Step 1: Entity Identification**
- Extract entity ID from input
- Query Firebase for entity data
- Validate entity existence

### **Step 2: Factor Analysis**
- Analyze login patterns
- Check file transfer activities
- Review authentication failures
- Monitor privilege access
- Assess network behavior

### **Step 3: Score Calculation**
- Apply weighted factor scoring
- Calculate base risk score
- Normalize to 0-50 range
- Determine risk level

### **Step 4: Recommendation Generation**
- Query Gemini AI for contextual recommendations
- Apply fallback recommendations if AI unavailable
- Prioritize recommendations by impact
- Estimate implementation effort

### **Step 5: Real-Time Updates**
- Subscribe to Firebase changes
- Update risk scores dynamically
- Trigger alerts for high-risk events
- Log all activities for audit

## 🚨 Alert System

### **High-Risk Alerts**
- Risk score > 40: Immediate notification
- Risk score > 30: Hourly review
- Risk score > 20: Daily monitoring

### **Event-Based Alerts**
- Failed authentication attempts
- Large file transfers
- Privilege escalation attempts
- Unusual login times
- Network anomalies

## 📈 Performance Metrics

### **System Metrics**
- Total entities monitored
- Active users count
- System uptime percentage
- Average response time
- CPU and memory usage

### **Risk Metrics**
- Overall risk score trend
- High-risk entity count
- Recent alerts count
- False positive rate
- Risk reduction percentage

## 🔧 Configuration Options

### **Risk Thresholds**
```javascript
const riskThresholds = {
  low: 20,
  medium: 30,
  high: 40,
  critical: 50
};
```

### **Factor Weights**
```javascript
const factorWeights = {
  unusualLoginTime: 0.15,
  largeFileTransfer: 0.25,
  failedAuthentication: 0.20,
  privilegeEscalation: 0.30,
  networkAnomaly: 0.10
};
```

### **AI Configuration**
```javascript
const aiConfig = {
  apiKey: 'AIzaSyDq4UeHyhxoeSpWrZBwvYEjQAdrwnFPgnk',
  model: 'gemini-pro',
  maxTokens: 1000,
  temperature: 0.7
};
```

This comprehensive risk scoring system provides real-time threat assessment with AI-powered recommendations for effective security management. 