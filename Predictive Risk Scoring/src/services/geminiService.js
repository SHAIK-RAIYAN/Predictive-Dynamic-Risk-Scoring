import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyDq4UeHyhxoeSpWrZBwvYEjQAdrwnFPgnk'); // Replace with actual API key

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getRiskRecommendations(entityData, riskAssessment) {
    try {
      const prompt = `
        As a cybersecurity expert, analyze the following entity and provide comprehensive, actionable security recommendations to mitigate the identified risks.

        Entity Information:
        - Name: ${entityData.name || entityData.id}
        - Type: ${entityData.type}
        - Department: ${entityData.department}
        - Risk Score: ${riskAssessment.overallScore}
        - Risk Level: ${riskAssessment.riskLevel}
        - Last Activity: ${entityData.lastActivity}
        - IP Address: ${entityData.ipAddress}

        Risk Factors:
        ${riskAssessment.factors?.map(factor => 
          `- ${factor.name}: ${factor.description} (Score: ${factor.score}, Weight: ${factor.weight})`
        ).join('\n')}

        ${riskAssessment.recommendation ? `
        Current Recommendation Context:
        - Category: ${riskAssessment.recommendation.category}
        - Priority: ${riskAssessment.recommendation.priority}
        - Affected Entities: ${riskAssessment.recommendation.affectedEntities}
        - Estimated Risk Reduction: ${riskAssessment.recommendation.estimatedRiskReduction}%
        ` : ''}

        ${riskAssessment.context ? `
        Additional Context:
        - Implementation Category: ${riskAssessment.context.category}
        - Current Priority Level: ${riskAssessment.context.priority}
        - Number of Affected Entities: ${riskAssessment.context.affectedEntities}
        - Expected Risk Reduction: ${riskAssessment.context.estimatedRiskReduction}%
        ` : ''}

        Please provide:
        1. 4-6 specific, actionable security recommendations tailored to this entity
        2. Priority level for each recommendation (High/Medium/Low)
        3. Estimated effort to implement (Low/Medium/High)
        4. Expected risk reduction percentage (realistic estimates)
        5. Implementation timeline (specific timeframes)
        6. Implementation steps and best practices
        7. Potential challenges and mitigation strategies

        Format the response as a structured JSON object with the following structure:
        {
          "recommendations": [
            {
              "title": "Specific recommendation title",
              "description": "Detailed description with implementation guidance",
              "priority": "High/Medium/Low",
              "effort": "Low/Medium/High",
              "riskReduction": 15,
              "timeline": "1-2 weeks",
              "category": "Authentication/Network/Data/Compliance/Monitoring",
              "implementationSteps": [
                "Step 1: Specific action",
                "Step 2: Another action"
              ],
              "challenges": "Potential implementation challenges",
              "benefits": "Expected security benefits"
            }
          ],
          "summary": "Comprehensive summary of recommendations and their collective impact",
          "overallRiskReduction": 45,
          "implementationPriority": "Prioritized order of implementation",
          "monitoringRecommendations": "Ongoing monitoring suggestions"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0]);
          return parsedResponse;
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using fallback:', parseError);
      }

      // Enhanced fallback based on risk assessment
      const fallbackRecommendations = this.generateEnhancedFallback(entityData, riskAssessment);
      return fallbackRecommendations;

    } catch (error) {
      console.error('Error getting Gemini recommendations:', error);
      // Return enhanced fallback instead of throwing error
      return this.generateEnhancedFallback(entityData, riskAssessment);
    }
  }

  generateEnhancedFallback(entityData, riskAssessment) {
    const recommendations = [];
    const riskScore = riskAssessment.overallScore || 25;
    const riskLevel = riskAssessment.riskLevel || 'Medium';

    // High-risk specific recommendations
    if (riskScore >= 35) {
      recommendations.push({
        title: "Immediate Security Audit",
        description: "Conduct comprehensive security audit for high-risk entity including access review, privilege analysis, and activity monitoring",
        priority: "High",
        effort: "High",
        riskReduction: 30,
        timeline: "1-2 weeks",
        category: "Compliance",
        implementationSteps: [
          "Schedule immediate security review meeting",
          "Audit all current access permissions",
          "Review recent activity logs",
          "Implement temporary additional monitoring"
        ],
        challenges: "May require coordination across multiple teams",
        benefits: "Immediate risk reduction and comprehensive security posture improvement"
      });

      recommendations.push({
        title: "Enhanced Multi-Factor Authentication",
        description: "Implement advanced MFA with biometric or hardware token authentication for critical access",
        priority: "High",
        effort: "Medium",
        riskReduction: 25,
        timeline: "1 week",
        category: "Authentication",
        implementationSteps: [
          "Deploy hardware security keys",
          "Configure biometric authentication",
          "Update authentication policies",
          "Train user on new authentication methods"
        ],
        challenges: "User adoption and hardware procurement",
        benefits: "Significantly reduces unauthorized access risk"
      });
    }

    // Authentication-related recommendations
    if (riskAssessment.factors?.some(f => f.name.includes('Login') || f.name.includes('Authentication'))) {
      recommendations.push({
        title: "Strengthen Authentication Controls",
        description: "Implement adaptive authentication based on risk factors and behavioral analysis",
        priority: "High",
        effort: "Medium",
        riskReduction: 20,
        timeline: "2-3 weeks",
        category: "Authentication",
        implementationSteps: [
          "Deploy adaptive authentication solution",
          "Configure risk-based authentication rules",
          "Implement behavioral analysis",
          "Set up automated response mechanisms"
        ],
        challenges: "Integration with existing systems",
        benefits: "Dynamic security based on real-time risk assessment"
      });
    }

    // File transfer related recommendations
    if (riskAssessment.factors?.some(f => f.name.includes('File') || f.name.includes('Transfer'))) {
      recommendations.push({
        title: "Data Loss Prevention Implementation",
        description: "Deploy comprehensive DLP solution to monitor and control data transfers",
        priority: "High",
        effort: "High",
        riskReduction: 35,
        timeline: "3-4 weeks",
        category: "Data",
        implementationSteps: [
          "Deploy DLP agents on endpoints",
          "Configure data classification policies",
          "Set up monitoring and alerting",
          "Train users on data handling policies"
        ],
        challenges: "Policy configuration and user training",
        benefits: "Prevents unauthorized data exfiltration"
      });
    }

    // Network-related recommendations
    if (riskAssessment.factors?.some(f => f.name.includes('Network') || f.name.includes('IP'))) {
      recommendations.push({
        title: "Network Segmentation and Monitoring",
        description: "Implement network segmentation and enhanced monitoring for unusual network activities",
        priority: "Medium",
        effort: "High",
        riskReduction: 25,
        timeline: "4-6 weeks",
        category: "Network",
        implementationSteps: [
          "Design network segmentation strategy",
          "Implement micro-segmentation",
          "Deploy network monitoring tools",
          "Configure automated threat response"
        ],
        challenges: "Network architecture changes",
        benefits: "Limits lateral movement and improves threat detection"
      });
    }

    // Always include monitoring recommendation
    recommendations.push({
      title: "Enhanced Security Monitoring",
      description: "Implement comprehensive security monitoring with AI-powered threat detection and automated response",
      priority: "Medium",
      effort: "Medium",
      riskReduction: 20,
      timeline: "2-3 weeks",
      category: "Monitoring",
      implementationSteps: [
        "Deploy SIEM solution",
        "Configure custom detection rules",
        "Set up automated alerting",
        "Implement incident response workflows"
      ],
      challenges: "Alert tuning and false positive management",
      benefits: "Early threat detection and automated response"
    });

    // Privilege escalation recommendations
    if (riskAssessment.factors?.some(f => f.name.includes('Privilege') || f.name.includes('Escalation'))) {
      recommendations.push({
        title: "Privileged Access Management",
        description: "Implement comprehensive PAM solution with just-in-time access and session monitoring",
        priority: "High",
        effort: "High",
        riskReduction: 40,
        timeline: "4-6 weeks",
        category: "Access Control",
        implementationSteps: [
          "Deploy PAM solution",
          "Configure just-in-time access",
          "Implement session recording",
          "Set up approval workflows"
        ],
        challenges: "Integration with existing systems and user workflow changes",
        benefits: "Eliminates standing privileges and provides complete audit trail"
      });
    }

    const totalRiskReduction = recommendations.reduce((sum, rec) => sum + rec.riskReduction, 0);

    return {
      recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
      summary: `Based on the ${riskLevel} risk level (score: ${riskScore}), immediate focus should be on ${recommendations[0]?.category.toLowerCase()} controls. The recommended security measures will collectively reduce risk by approximately ${Math.min(totalRiskReduction, 60)}% when fully implemented.`,
      overallRiskReduction: Math.min(totalRiskReduction, 60),
      implementationPriority: "Implement high-priority recommendations first, focusing on authentication and access controls before moving to monitoring and network security measures.",
      monitoringRecommendations: "Establish continuous monitoring for all implemented controls and regularly review their effectiveness through security metrics and incident analysis."
    };
  }

  async getThreatAnalysis(riskEvents) {
    try {
      const prompt = `
        Analyze the following security events and provide threat intelligence insights:

        Recent Risk Events:
        ${riskEvents.map(event => 
          `- ${event.eventType}: ${event.description} (Severity: ${event.severity}, Score: ${event.riskScore})`
        ).join('\n')}

        Please provide:
        1. Threat pattern analysis
        2. Potential attack vectors
        3. Recommended defensive measures
        4. Risk trend analysis

        Format as structured recommendations.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting threat analysis:', error);
      throw new Error('Failed to get threat analysis');
    }
  }

  async getComplianceRecommendations(entityData, complianceFramework = 'ISO 27001') {
    try {
      const prompt = `
        Provide compliance recommendations for ${complianceFramework} based on the following entity:

        Entity: ${entityData.name} (${entityData.type})
        Department: ${entityData.department}
        Risk Level: ${entityData.riskLevel || 'Medium'}

        Please provide specific compliance recommendations and controls that should be implemented.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting compliance recommendations:', error);
      throw new Error('Failed to get compliance recommendations');
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;
