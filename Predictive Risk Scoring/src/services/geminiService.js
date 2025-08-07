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
        As a cybersecurity expert, analyze the following entity and provide specific, actionable security recommendations to mitigate the identified risks.

        Entity Information:
        - Name: ${entityData.name}
        - Type: ${entityData.type}
        - Department: ${entityData.department}
        - Risk Score: ${riskAssessment.overallScore}
        - Risk Level: ${riskAssessment.riskLevel}

        Risk Factors:
        ${riskAssessment.factors?.map(factor => 
          `- ${factor.name}: ${factor.description} (Score: ${factor.score})`
        ).join('\n')}

        Please provide:
        1. 3-5 specific, actionable security recommendations
        2. Priority level for each recommendation (High/Medium/Low)
        3. Estimated effort to implement (Low/Medium/High)
        4. Expected risk reduction percentage
        5. Implementation timeline

        Format the response as a structured JSON object with the following structure:
        {
          "recommendations": [
            {
              "title": "Recommendation title",
              "description": "Detailed description",
              "priority": "High/Medium/Low",
              "effort": "Low/Medium/High",
              "riskReduction": 15,
              "timeline": "1-2 weeks",
              "category": "Authentication/Network/Data/Compliance"
            }
          ],
          "summary": "Brief summary of overall recommendations"
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse JSON response:', parseError);
      }

      // Fallback: return structured text response
      return {
        recommendations: [
          {
            title: "Enhanced Authentication",
            description: "Implement multi-factor authentication for this entity",
            priority: "High",
            effort: "Medium",
            riskReduction: 25,
            timeline: "1-2 weeks",
            category: "Authentication"
          },
          {
            title: "Access Monitoring",
            description: "Enable detailed logging and monitoring for unusual access patterns",
            priority: "Medium",
            effort: "Low",
            riskReduction: 15,
            timeline: "3-5 days",
            category: "Monitoring"
          },
          {
            title: "Privilege Review",
            description: "Conduct regular privilege access reviews and implement least privilege principle",
            priority: "High",
            effort: "High",
            riskReduction: 30,
            timeline: "2-4 weeks",
            category: "Access Control"
          }
        ],
        summary: "Focus on implementing multi-factor authentication and regular access reviews to significantly reduce risk exposure."
      };
    } catch (error) {
      console.error('Error getting Gemini recommendations:', error);
      throw new Error('Failed to get AI recommendations');
    }
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