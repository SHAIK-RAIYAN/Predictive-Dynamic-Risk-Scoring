// API Service for connecting to backend
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

  // Dashboard Statistics
  async getDashboardStats() {
    return this.apiCall('/dashboard/stats');
  }

  // Risk Trend Data
  async getRiskTrend() {
    return this.apiCall('/dashboard/trend');
  }

  // Top Risk Entities
  async getTopRiskEntities() {
    return this.apiCall('/dashboard/top-entities');
  }

  // Risk Assessment for Entity
  async assessEntityRisk(entityId) {
    return this.apiCall(`/assessment/${entityId}`);
  }

  // Get All Entities
  async getAllEntities() {
    return this.apiCall('/entities');
  }

  // Analytics Data
  async getAnalytics() {
    return this.apiCall('/analytics');
  }

  // Recommendations
  async getRecommendations() {
    return this.apiCall('/recommendations');
  }

  // System Metrics
  async getSystemMetrics() {
    return this.apiCall('/system/metrics');
  }

  // Gemini AI Integration for Security Recommendations
  async getAIRecommendations(entityId, riskData) {
    try {
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

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer AIzaSyDq4UeHyhxoeSpWrZBwvYEjQAdrwnFPgnk`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API call failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from AI response
      try {
        return JSON.parse(aiResponse);
      } catch (e) {
        // If parsing fails, return formatted recommendations
        return this.formatAIRecommendations(aiResponse);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      return this.getFallbackRecommendations(riskData);
    }
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
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 