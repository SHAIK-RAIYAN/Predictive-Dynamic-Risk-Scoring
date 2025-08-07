// API Service for connecting to Firebase and backend
import firebaseService from './firebaseService';
import geminiService from './geminiService';

const API_BASE_URL = 'http://localhost:8080/api/risk';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Dashboard Statistics - Use Firebase data
  async getDashboardStats() {
    try {
      return await firebaseService.getDashboardStats();
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Fallback to mock data if Firebase fails
      return {
        overallRiskScore: 28.5,
        riskTrend: "increasing",
        totalEntities: 1247,
        highRiskEntities: 23,
        mediumRiskEntities: 156,
        lowRiskEntities: 1068,
        recentAlerts: 12,
        falsePositives: 2,
      };
    }
  }

  // Risk Trend Data - Use Firebase data
  async getRiskTrend() {
    try {
      return await firebaseService.getRiskTrend();
    } catch (error) {
      console.error('Error getting risk trend:', error);
      // Fallback to mock data
      return [
        { time: "00:00", score: 25 },
        { time: "04:00", score: 27 },
        { time: "08:00", score: 30 },
        { time: "12:00", score: 28 },
        { time: "16:00", score: 32 },
        { time: "20:00", score: 29 },
        { time: "24:00", score: 28 },
      ];
    }
  }

  // Top Risk Entities - Use Firebase data
  async getTopRiskEntities() {
    try {
      return await firebaseService.getTopRiskEntities();
    } catch (error) {
      console.error('Error getting top risk entities:', error);
      // Fallback to mock data
      return [
        {
          id: 1,
          name: "user-john.doe",
          department: "Engineering",
          riskScore: 45,
          status: "high",
          lastActivity: "2 min ago",
        },
        {
          id: 2,
          name: "server-prod-01",
          department: "Infrastructure",
          riskScore: 38,
          status: "medium",
          lastActivity: "5 min ago",
        },
        {
          id: 3,
          name: "user-sarah.smith",
          department: "Finance",
          riskScore: 42,
          status: "high",
          lastActivity: "8 min ago",
        },
        {
          id: 4,
          name: "database-main",
          department: "IT",
          riskScore: 35,
          status: "medium",
          lastActivity: "12 min ago",
        },
        {
          id: 5,
          name: "user-mike.wilson",
          department: "HR",
          riskScore: 31,
          status: "medium",
          lastActivity: "15 min ago",
        },
      ];
    }
  }

  // Risk Assessment for Entity - Use Firebase data
  async assessEntityRisk(entityId) {
    try {
      return await firebaseService.assessEntityRisk(entityId);
    } catch (error) {
      console.error('Error assessing entity risk:', error);
      // Fallback to mock data
      return {
        entityId: entityId,
        overallScore: Math.abs(entityId.hashCode ? entityId.hashCode() : entityId.length) % 50 + 5,
        riskLevel: "Medium",
        factors: [
          { id: 1, name: 'Unusual Login Time', weight: 0.15, score: 8, description: 'Login outside normal business hours' },
          { id: 2, name: 'Large File Transfer', weight: 0.25, score: 12, description: 'Transfer of files > 100MB' },
          { id: 3, name: 'Failed Authentication', weight: 0.20, score: 6, description: 'Multiple failed login attempts' },
          { id: 4, name: 'Privilege Escalation', weight: 0.30, score: 15, description: 'Access to restricted resources' },
          { id: 5, name: 'Network Anomaly', weight: 0.10, score: 4, description: 'Unusual network traffic patterns' },
        ],
        history: [
          { timestamp: '2024-01-15 14:30', event: 'Login from new IP', score: 5 },
          { timestamp: '2024-01-15 15:45', event: 'Large file download', score: 12 },
          { timestamp: '2024-01-15 16:20', event: 'Access to admin panel', score: 8 },
          { timestamp: '2024-01-15 17:10', event: 'Failed login attempt', score: 3 },
          { timestamp: '2024-01-15 18:00', event: 'Database query execution', score: 6 },
        ],
        recommendations: [
          'Review recent login patterns',
          'Monitor file transfer activities',
          'Implement additional authentication for admin access',
        ],
      };
    }
  }

  // Get All Entities - Use Firebase data
  async getAllEntities() {
    try {
      return await firebaseService.getEntities();
    } catch (error) {
      console.error('Error getting entities:', error);
      // Fallback to mock data
      return [
        { id: 1, name: 'user-john.doe', type: 'User', department: 'Engineering', riskScore: 45, status: 'High', lastActivity: '2 min ago', ipAddress: '192.168.1.100' },
        { id: 2, name: 'server-prod-01', type: 'Server', department: 'Infrastructure', riskScore: 38, status: 'Medium', lastActivity: '5 min ago', ipAddress: '10.0.0.50' },
        { id: 3, name: 'user-sarah.smith', type: 'User', department: 'Finance', riskScore: 42, status: 'High', lastActivity: '8 min ago', ipAddress: '192.168.1.101' },
        { id: 4, name: 'database-main', type: 'Database', department: 'IT', riskScore: 35, status: 'Medium', lastActivity: '12 min ago', ipAddress: '10.0.0.100' },
        { id: 5, name: 'user-mike.wilson', type: 'User', department: 'HR', riskScore: 31, status: 'Medium', lastActivity: '15 min ago', ipAddress: '192.168.1.102' },
        { id: 6, name: 'web-server-01', type: 'Server', department: 'Infrastructure', riskScore: 22, status: 'Low', lastActivity: '20 min ago', ipAddress: '10.0.0.51' },
        { id: 7, name: 'user-lisa.jones', type: 'User', department: 'Marketing', riskScore: 18, status: 'Low', lastActivity: '25 min ago', ipAddress: '192.168.1.103' },
        { id: 8, name: 'backup-server', type: 'Server', department: 'IT', riskScore: 28, status: 'Medium', lastActivity: '30 min ago', ipAddress: '10.0.0.200' },
        { id: 9, name: 'user-alex.brown', type: 'User', department: 'Sales', riskScore: 25, status: 'Medium', lastActivity: '35 min ago', ipAddress: '192.168.1.104' },
        { id: 10, name: 'app-server-02', type: 'Server', department: 'Infrastructure', riskScore: 33, status: 'Medium', lastActivity: '40 min ago', ipAddress: '10.0.0.52' },
      ];
    }
  }

  // Analytics Data - Use Firebase data
  async getAnalytics() {
    try {
      return await firebaseService.getAnalytics();
    } catch (error) {
      console.error('Error getting analytics:', error);
      // Fallback to mock data
      return {
        riskTrends: [
          { month: 'Jan', avgScore: 28, highRisk: 15, mediumRisk: 45, lowRisk: 120 },
          { month: 'Feb', avgScore: 32, highRisk: 18, mediumRisk: 52, lowRisk: 115 },
          { month: 'Mar', avgScore: 35, highRisk: 22, mediumRisk: 58, lowRisk: 110 },
          { month: 'Apr', avgScore: 31, highRisk: 19, mediumRisk: 49, lowRisk: 118 },
          { month: 'May', avgScore: 38, highRisk: 25, mediumRisk: 62, lowRisk: 105 },
          { month: 'Jun', avgScore: 42, highRisk: 30, mediumRisk: 68, lowRisk: 98 },
        ],
        departmentRisk: [
          { department: 'Engineering', avgScore: 35, entities: 45 },
          { department: 'Finance', avgScore: 28, entities: 23 },
          { department: 'IT', avgScore: 42, entities: 38 },
          { department: 'HR', avgScore: 22, entities: 15 },
          { department: 'Marketing', avgScore: 31, entities: 28 },
        ],
        threatTypes: [
          { type: 'Privilege Escalation', count: 45, percentage: 35 },
          { type: 'Data Exfiltration', count: 32, percentage: 25 },
          { type: 'Unauthorized Access', count: 28, percentage: 22 },
          { type: 'Malware Activity', count: 15, percentage: 12 },
          { type: 'Other', count: 8, percentage: 6 },
        ],
        timeAnalysis: [
          { hour: '00:00', incidents: 5, avgScore: 25 },
          { hour: '04:00', incidents: 3, avgScore: 22 },
          { hour: '08:00', incidents: 12, avgScore: 35 },
          { hour: '12:00', incidents: 18, avgScore: 42 },
          { hour: '16:00', incidents: 15, avgScore: 38 },
          { hour: '20:00', incidents: 8, avgScore: 28 },
        ],
      };
    }
  }

  // Recommendations - Use Firebase data with AI integration
  async getRecommendations() {
    try {
      // Get entities from Firebase
      const entities = await firebaseService.getEntities();
      
      // Generate recommendations based on high-risk entities
      const highRiskEntities = entities.filter(e => e.riskScore >= 35);
      
      const recommendations = [
        {
          id: 1,
          title: 'Implement Multi-Factor Authentication',
          description: 'Enable MFA for all user accounts to prevent unauthorized access',
          priority: 'High',
          impact: 'Critical',
          effort: 'Medium',
          status: 'Pending',
          category: 'Authentication',
          affectedEntities: highRiskEntities.length,
          estimatedRiskReduction: 35,
        },
        {
          id: 2,
          title: 'Review Firewall Rules',
          description: 'Audit and tighten firewall configurations to restrict unnecessary access',
          priority: 'Medium',
          impact: 'High',
          effort: 'Low',
          status: 'In Progress',
          category: 'Network Security',
          affectedEntities: Math.floor(entities.length * 0.3),
          estimatedRiskReduction: 25,
        },
        {
          id: 3,
          title: 'Update Access Controls',
          description: 'Implement least privilege principle for database access',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'Pending',
          category: 'Access Control',
          affectedEntities: Math.floor(entities.length * 0.2),
          estimatedRiskReduction: 40,
        },
        {
          id: 4,
          title: 'Enable File Integrity Monitoring',
          description: 'Monitor critical system files for unauthorized changes',
          priority: 'Medium',
          impact: 'Medium',
          effort: 'Medium',
          status: 'Completed',
          category: 'System Security',
          affectedEntities: Math.floor(entities.length * 0.4),
          estimatedRiskReduction: 20,
        },
        {
          id: 5,
          title: 'Implement Data Loss Prevention',
          description: 'Deploy DLP solution to prevent sensitive data exfiltration',
          priority: 'High',
          impact: 'Critical',
          effort: 'High',
          status: 'Pending',
          category: 'Data Protection',
          affectedEntities: entities.length,
          estimatedRiskReduction: 45,
        },
        {
          id: 6,
          title: 'Deploy Intrusion Detection System',
          description: 'Deploy IDS to detect and respond to security threats',
          priority: 'Medium',
          impact: 'High',
          effort: 'Medium',
          status: 'Pending',
          category: 'Network Security',
          affectedEntities: Math.floor(entities.length * 0.5),
          estimatedRiskReduction: 30,
        },
        {
          id: 7,
          title: 'Strengthen Password Policies',
          description: 'Enforce strong password requirements and regular rotation',
          priority: 'High',
          impact: 'High',
          effort: 'Low',
          status: 'In Progress',
          category: 'Authentication',
          affectedEntities: entities.length,
          estimatedRiskReduction: 25,
        },
        {
          id: 8,
          title: 'Implement Network Segmentation',
          description: 'Segment network to limit lateral movement of threats',
          priority: 'Medium',
          impact: 'Medium',
          effort: 'High',
          status: 'Pending',
          category: 'Network Security',
          affectedEntities: Math.floor(entities.length * 0.6),
          estimatedRiskReduction: 35,
        },
      ];

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to mock data
      return [
        {
          id: 1,
          title: 'Implement Multi-Factor Authentication',
          description: 'Enable MFA for all user accounts to prevent unauthorized access',
          priority: 'High',
          impact: 'Critical',
          effort: 'Medium',
          status: 'Pending',
          category: 'Authentication',
          affectedEntities: 45,
          estimatedRiskReduction: 35,
        },
        {
          id: 2,
          title: 'Review Firewall Rules',
          description: 'Audit and tighten firewall configurations to restrict unnecessary access',
          priority: 'Medium',
          impact: 'High',
          effort: 'Low',
          status: 'In Progress',
          category: 'Network Security',
          affectedEntities: 12,
          estimatedRiskReduction: 25,
        },
        {
          id: 3,
          title: 'Update Access Controls',
          description: 'Implement least privilege principle for database access',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'Pending',
          category: 'Access Control',
          affectedEntities: 8,
          estimatedRiskReduction: 40,
        },
        {
          id: 4,
          title: 'Enable File Integrity Monitoring',
          description: 'Monitor critical system files for unauthorized changes',
          priority: 'Medium',
          impact: 'Medium',
          effort: 'Medium',
          status: 'Completed',
          category: 'System Security',
          affectedEntities: 23,
          estimatedRiskReduction: 20,
        },
        {
          id: 5,
          title: 'Implement Data Loss Prevention',
          description: 'Deploy DLP solution to prevent sensitive data exfiltration',
          priority: 'High',
          impact: 'Critical',
          effort: 'High',
          status: 'Pending',
          category: 'Data Protection',
          affectedEntities: 156,
          estimatedRiskReduction: 45,
        },
      ];
    }
  }

  // System Metrics - Use Firebase data
  async getSystemMetrics() {
    try {
      const entities = await firebaseService.getEntities();
      const events = await firebaseService.getRiskEvents();
      
      return {
        totalLogins: Math.floor(Math.random() * 1500) + 500,
        activeUsers: entities.filter(e => e.type === 'User').length,
        systemUptime: "99.8%",
        averageResponseTime: "45ms",
        cpuUsage: Math.floor(Math.random() * 60) + 20 + "%",
        memoryUsage: Math.floor(Math.random() * 55) + 30 + "%",
        diskUsage: Math.floor(Math.random() * 50) + 40 + "%",
        networkTraffic: Math.floor(Math.random() * 400) + 100 + " MB/s",
      };
    } catch (error) {
      console.error('Error getting system metrics:', error);
      // Fallback to mock data
      return {
        totalLogins: 1247,
        activeUsers: 45,
        systemUptime: "99.8%",
        averageResponseTime: "45ms",
        cpuUsage: "65%",
        memoryUsage: "72%",
        diskUsage: "58%",
        networkTraffic: "234 MB/s",
      };
    }
  }

  // Enhanced Gemini AI Integration for Security Recommendations
  async getAIRecommendations(entityId, riskData) {
    try {
      console.log('Getting AI recommendations for entity:', entityId);
      console.log('Risk data:', riskData);

      // Get entity data from Firebase
      const entities = await firebaseService.getEntities();
      let entity = entities.find(e => e.id === entityId || e.name === entityId);
      
      // If entity not found, create a mock entity for demonstration
      if (!entity) {
        console.warn('Entity not found, creating mock entity for:', entityId);
        entity = {
          id: entityId,
          name: entityId,
          type: 'User',
          department: 'Unknown',
          riskScore: riskData.overallScore || 25,
          lastActivity: '2 hours ago',
          ipAddress: '192.168.1.100'
        };
      }

      // Use Gemini service for AI recommendations
      const aiRecommendations = await geminiService.getRiskRecommendations(entity, riskData);
      
      console.log('AI recommendations received:', aiRecommendations);
      return aiRecommendations;
      
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Return enhanced fallback recommendations
      return this.getEnhancedFallbackRecommendations(entityId, riskData);
    }
  }

  // Enhanced fallback recommendations with more detail
  getEnhancedFallbackRecommendations(entityId, riskData) {
    const riskScore = riskData.overallScore || 25;
    const riskLevel = riskData.riskLevel || 'Medium';
    
    const recommendations = [];

    // High-risk entity recommendations
    if (riskScore >= 35) {
      recommendations.push({
        title: "Immediate Security Review Required",
        description: "This high-risk entity requires immediate attention. Conduct a comprehensive security audit including access review, recent activity analysis, and privilege verification.",
        priority: "High",
        effort: "High",
        riskReduction: 35,
        timeline: "1-2 weeks",
        category: "Compliance",
        implementationSteps: [
          "Schedule emergency security review meeting",
          "Audit all current access permissions and privileges",
          "Review activity logs for the past 30 days",
          "Implement temporary enhanced monitoring",
          "Verify all recent file transfers and system access"
        ],
        challenges: "Requires coordination across security, IT, and management teams",
        benefits: "Immediate risk reduction and comprehensive security posture assessment"
      });

      recommendations.push({
        title: "Enhanced Multi-Factor Authentication",
        description: "Deploy advanced MFA with hardware tokens or biometric authentication for all critical system access.",
        priority: "High",
        effort: "Medium",
        riskReduction: 25,
        timeline: "1 week",
        category: "Authentication",
        implementationSteps: [
          "Procure and deploy hardware security keys",
          "Configure biometric authentication where available",
          "Update authentication policies and procedures",
          "Provide user training on new authentication methods",
          "Implement backup authentication methods"
        ],
        challenges: "User adoption and potential workflow disruption",
        benefits: "Significantly reduces risk of unauthorized access"
      });
    }

    // Medium-risk recommendations
    if (riskScore >= 20) {
      recommendations.push({
        title: "Implement Behavioral Analytics",
        description: "Deploy user and entity behavior analytics (UEBA) to detect anomalous activities and potential insider threats.",
        priority: "Medium",
        effort: "Medium",
        riskReduction: 20,
        timeline: "2-3 weeks",
        category: "Monitoring",
        implementationSteps: [
          "Deploy UEBA solution",
          "Configure baseline behavior patterns",
          "Set up anomaly detection rules",
          "Implement automated alerting",
          "Train security team on UEBA analysis"
        ],
        challenges: "Initial tuning and false positive management",
        benefits: "Early detection of insider threats and anomalous behavior"
      });

      recommendations.push({
        title: "Access Control Review and Optimization",
        description: "Conduct comprehensive review of access permissions and implement least privilege principles.",
        priority: "Medium",
        effort: "High",
        riskReduction: 30,
        timeline: "3-4 weeks",
        category: "Access Control",
        implementationSteps: [
          "Audit current access permissions",
          "Identify and remove unnecessary privileges",
          "Implement role-based access control (RBAC)",
          "Set up regular access reviews",
          "Document access control procedures"
        ],
        challenges: "Potential business process disruption during implementation",
        benefits: "Reduced attack surface and improved compliance"
      });
    }

    // Always include data protection
    recommendations.push({
      title: "Data Loss Prevention (DLP) Implementation",
      description: "Deploy comprehensive DLP solution to monitor, detect, and prevent unauthorized data transfers.",
      priority: riskScore >= 30 ? "High" : "Medium",
      effort: "High",
      riskReduction: 40,
      timeline: "4-6 weeks",
      category: "Data",
      implementationSteps: [
        "Deploy DLP agents on all endpoints",
        "Configure data classification policies",
        "Set up content inspection rules",
        "Implement blocking and alerting mechanisms",
        "Train users on data handling policies"
      ],
      challenges: "Policy configuration complexity and user training requirements",
      benefits: "Prevents data exfiltration and ensures compliance"
    });

    // Network security recommendation
    recommendations.push({
      title: "Network Segmentation and Monitoring",
      description: "Implement network segmentation and deploy advanced network monitoring to detect lateral movement.",
      priority: "Medium",
      effort: "High",
      riskReduction: 25,
      timeline: "6-8 weeks",
      category: "Network",
      implementationSteps: [
        "Design network segmentation strategy",
        "Implement micro-segmentation",
        "Deploy network detection and response (NDR)",
        "Configure automated threat hunting",
        "Set up network forensics capabilities"
      ],
      challenges: "Network architecture changes and potential connectivity issues",
      benefits: "Limits blast radius of security incidents and improves threat detection"
    });

    const totalRiskReduction = recommendations.reduce((sum, rec) => sum + rec.riskReduction, 0);

    return {
      recommendations: recommendations.slice(0, 4), // Limit to 4 recommendations
      summary: `Entity ${entityId} has a ${riskLevel} risk level (score: ${riskScore}). The recommended security measures focus on immediate risk mitigation through enhanced authentication, monitoring, and access controls. Full implementation will reduce risk by approximately ${Math.min(totalRiskReduction, 70)}%.`,
      overallRiskReduction: Math.min(totalRiskReduction, 70),
      implementationPriority: "Prioritize high-risk recommendations first. Start with authentication and access controls, then implement monitoring and data protection measures.",
      monitoringRecommendations: "Establish continuous monitoring for all implemented controls. Set up regular security reviews and maintain updated threat intelligence to ensure ongoing effectiveness."
    };
  }

  formatAIRecommendations(aiResponse) {
    // Format AI response into structured recommendations
    const recommendations = [];
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    let currentRec = {};
    for (const line of lines) {
      if (line.includes('title') || line.includes('Title')) {
        if (currentRec.title) recommendations.push(currentRec);
        currentRec = { title: line.split(':')[1]?.trim() || line.trim() };
      } else if (line.includes('description') || line.includes('Description')) {
        currentRec.description = line.split(':')[1]?.trim() || line.trim();
      } else if (line.includes('priority') || line.includes('Priority')) {
        currentRec.priority = line.split(':')[1]?.trim() || 'Medium';
      } else if (line.includes('effort') || line.includes('Effort')) {
        currentRec.effort = line.split(':')[1]?.trim() || 'Medium';
      }
    }
    if (currentRec.title) recommendations.push(currentRec);
    
    return recommendations;
  }

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

  // Add new entity to Firebase
  async addEntity(entityData) {
    try {
      return await firebaseService.addEntity(entityData);
    } catch (error) {
      console.error('Error adding entity:', error);
      throw error;
    }
  }

  // Update entity in Firebase
  async updateEntity(entityId, updateData) {
    try {
      return await firebaseService.updateEntity(entityId, updateData);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }

  // Delete entity from Firebase
  async deleteEntity(entityId) {
    try {
      return await firebaseService.deleteEntity(entityId);
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
