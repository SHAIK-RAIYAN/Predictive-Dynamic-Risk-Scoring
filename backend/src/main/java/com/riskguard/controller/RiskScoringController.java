package com.riskguard.controller;

import com.riskguard.domain.MonitoredEntity;
import com.riskguard.domain.RiskEvent;
import com.riskguard.service.MachineLearningService;
import com.riskguard.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/risk")
@CrossOrigin(origins = "*")
public class RiskScoringController {

    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @Autowired
    private MachineLearningService mlService;

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Generate dynamic statistics
        int totalEntities = ThreadLocalRandom.current().nextInt(800, 1500);
        int highRiskEntities = ThreadLocalRandom.current().nextInt(15, 35);
        int mediumRiskEntities = ThreadLocalRandom.current().nextInt(120, 200);
        int lowRiskEntities = totalEntities - highRiskEntities - mediumRiskEntities;
        
        double overallRiskScore = calculateOverallRiskScore(highRiskEntities, mediumRiskEntities, lowRiskEntities);
        
        stats.put("overallRiskScore", Math.round(overallRiskScore * 10.0) / 10.0);
        stats.put("riskTrend", getRandomTrend());
        stats.put("totalEntities", totalEntities);
        stats.put("highRiskEntities", highRiskEntities);
        stats.put("mediumRiskEntities", mediumRiskEntities);
        stats.put("lowRiskEntities", lowRiskEntities);
        stats.put("recentAlerts", ThreadLocalRandom.current().nextInt(8, 25));
        stats.put("falsePositives", ThreadLocalRandom.current().nextInt(1, 5));
        
        return ResponseEntity.ok(stats);
    }

    // Risk Trend Data
    @GetMapping("/dashboard/trend")
    public ResponseEntity<List<Map<String, Object>>> getRiskTrend() {
        List<Map<String, Object>> trendData = new ArrayList<>();
        String[] times = {"00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"};
        
        for (String time : times) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("time", time);
            dataPoint.put("score", ThreadLocalRandom.current().nextInt(20, 45));
            trendData.add(dataPoint);
        }
        
        return ResponseEntity.ok(trendData);
    }

    // Top Risk Entities
    @GetMapping("/dashboard/top-entities")
    public ResponseEntity<List<Map<String, Object>>> getTopRiskEntities() {
        List<Map<String, Object>> entities = new ArrayList<>();
        String[] names = {"user-john.doe", "server-prod-01", "user-sarah.smith", "database-main", "user-mike.wilson"};
        String[] departments = {"Engineering", "Infrastructure", "Finance", "IT", "HR"};
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("id", i + 1);
            entity.put("name", names[i]);
            entity.put("department", departments[i]);
            entity.put("riskScore", ThreadLocalRandom.current().nextInt(30, 50));
            entity.put("status", "high");
            entity.put("lastActivity", (i + 1) * 2 + " min ago");
            entities.add(entity);
        }
        
        return ResponseEntity.ok(entities);
    }

    // Risk Assessment for Entity
    @GetMapping("/assessment/{entityId}")
    public ResponseEntity<Map<String, Object>> assessEntityRisk(@PathVariable String entityId) {
        Map<String, Object> assessment = new HashMap<>();
        
        // Generate dynamic risk score based on entity ID
        int baseScore = Math.abs(entityId.hashCode() % 50) + 5;
        int riskScore = baseScore + ThreadLocalRandom.current().nextInt(-5, 10);
        riskScore = Math.max(5, Math.min(50, riskScore));
        
        assessment.put("entityId", entityId);
        assessment.put("overallScore", riskScore);
        assessment.put("riskLevel", getRiskLevel(riskScore));
        assessment.put("factors", generateRiskFactors(riskScore));
        assessment.put("history", generateEntityHistory(entityId));
        assessment.put("recommendations", generateRecommendations(riskScore));
        
        return ResponseEntity.ok(assessment);
    }

    // Get All Entities
    @GetMapping("/entities")
    public ResponseEntity<List<Map<String, Object>>> getAllEntities() {
        List<Map<String, Object>> entities = new ArrayList<>();
        String[] names = {"user-john.doe", "server-prod-01", "user-sarah.smith", "database-main", "user-mike.wilson", 
                         "web-server-01", "user-lisa.jones", "backup-server", "user-alex.brown", "app-server-02"};
        String[] types = {"User", "Server", "User", "Database", "User", "Server", "User", "Server", "User", "Server"};
        String[] departments = {"Engineering", "Infrastructure", "Finance", "IT", "HR", "Infrastructure", "Marketing", "IT", "Sales", "Infrastructure"};
        
        for (int i = 0; i < 10; i++) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("id", i + 1);
            entity.put("name", names[i]);
            entity.put("type", types[i]);
            entity.put("department", departments[i]);
            entity.put("riskScore", ThreadLocalRandom.current().nextInt(15, 50));
            entity.put("status", getRandomStatus());
            entity.put("lastActivity", (i + 1) * 3 + " min ago");
            entity.put("ipAddress", "192.168.1." + (100 + i));
            entities.add(entity);
        }
        
        return ResponseEntity.ok(entities);
    }

    // Analytics Data
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Risk trends over months
        List<Map<String, Object>> riskTrends = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun"};
        for (String month : months) {
            Map<String, Object> trend = new HashMap<>();
            trend.put("month", month);
            trend.put("avgScore", ThreadLocalRandom.current().nextInt(25, 45));
            trend.put("highRisk", ThreadLocalRandom.current().nextInt(15, 30));
            trend.put("mediumRisk", ThreadLocalRandom.current().nextInt(40, 70));
            trend.put("lowRisk", ThreadLocalRandom.current().nextInt(90, 130));
            riskTrends.add(trend);
        }
        
        // Department risk analysis
        List<Map<String, Object>> departmentRisk = new ArrayList<>();
        String[] depts = {"Engineering", "Finance", "IT", "HR", "Marketing"};
        for (String dept : depts) {
            Map<String, Object> deptData = new HashMap<>();
            deptData.put("department", dept);
            deptData.put("avgScore", ThreadLocalRandom.current().nextInt(20, 45));
            deptData.put("entities", ThreadLocalRandom.current().nextInt(10, 50));
            departmentRisk.add(deptData);
        }
        
        analytics.put("riskTrends", riskTrends);
        analytics.put("departmentRisk", departmentRisk);
        analytics.put("threatTypes", generateThreatTypes());
        analytics.put("timeAnalysis", generateTimeAnalysis());
        
        return ResponseEntity.ok(analytics);
    }

    // Recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations() {
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        String[] titles = {
            "Implement Multi-Factor Authentication",
            "Review Firewall Rules",
            "Update Access Controls",
            "Enable File Integrity Monitoring",
            "Implement Data Loss Prevention",
            "Deploy Intrusion Detection System",
            "Strengthen Password Policies",
            "Implement Network Segmentation"
        };
        
        String[] descriptions = {
            "Enable MFA for all user accounts to prevent unauthorized access",
            "Audit and tighten firewall configurations to restrict unnecessary access",
            "Implement least privilege principle for database access",
            "Monitor critical system files for unauthorized changes",
            "Deploy DLP solution to prevent sensitive data exfiltration",
            "Deploy IDS to detect and respond to security threats",
            "Enforce strong password requirements and regular rotation",
            "Segment network to limit lateral movement of threats"
        };
        
        String[] categories = {"Authentication", "Network Security", "Access Control", "System Security", "Data Protection", "Network Security", "Authentication", "Network Security"};
        String[] priorities = {"High", "Medium", "High", "Medium", "High", "Medium", "High", "Medium"};
        String[] impacts = {"Critical", "High", "High", "Medium", "Critical", "High", "High", "Medium"};
        String[] efforts = {"Medium", "Low", "High", "Medium", "High", "Medium", "Low", "High"};
        String[] statuses = {"Pending", "In Progress", "Pending", "Completed", "Pending", "Pending", "In Progress", "Pending"};
        
        for (int i = 0; i < 8; i++) {
            Map<String, Object> recommendation = new HashMap<>();
            recommendation.put("id", i + 1);
            recommendation.put("title", titles[i]);
            recommendation.put("description", descriptions[i]);
            recommendation.put("priority", priorities[i]);
            recommendation.put("impact", impacts[i]);
            recommendation.put("effort", efforts[i]);
            recommendation.put("status", statuses[i]);
            recommendation.put("category", categories[i]);
            recommendation.put("affectedEntities", ThreadLocalRandom.current().nextInt(5, 200));
            recommendation.put("estimatedRiskReduction", ThreadLocalRandom.current().nextInt(15, 50));
            recommendations.add(recommendation);
        }
        
        return ResponseEntity.ok(recommendations);
    }

    // System Metrics
    @GetMapping("/system/metrics")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalLogins", ThreadLocalRandom.current().nextInt(500, 2000));
        metrics.put("activeUsers", ThreadLocalRandom.current().nextInt(100, 500));
        metrics.put("systemUptime", "99.8%");
        metrics.put("averageResponseTime", "45ms");
        metrics.put("cpuUsage", ThreadLocalRandom.current().nextInt(20, 80) + "%");
        metrics.put("memoryUsage", ThreadLocalRandom.current().nextInt(30, 85) + "%");
        metrics.put("diskUsage", ThreadLocalRandom.current().nextInt(40, 90) + "%");
        metrics.put("networkTraffic", ThreadLocalRandom.current().nextInt(100, 500) + " MB/s");
        
        return ResponseEntity.ok(metrics);
    }

    // Helper methods
    private double calculateOverallRiskScore(int high, int medium, int low) {
        int total = high + medium + low;
        if (total == 0) return 0;
        return (high * 40.0 + medium * 25.0 + low * 10.0) / total;
    }

    private String getRandomTrend() {
        return ThreadLocalRandom.current().nextBoolean() ? "increasing" : "decreasing";
    }

    private String getRiskLevel(int score) {
        if (score >= 40) return "Critical";
        if (score >= 30) return "High";
        if (score >= 20) return "Medium";
        return "Low";
    }

    private String getRandomStatus() {
        String[] statuses = {"High", "Medium", "Low"};
        return statuses[ThreadLocalRandom.current().nextInt(statuses.length)];
    }

    private List<Map<String, Object>> generateRiskFactors(int riskScore) {
        List<Map<String, Object>> factors = new ArrayList<>();
        String[] factorNames = {"Unusual Login Time", "Large File Transfer", "Failed Authentication", "Privilege Escalation", "Network Anomaly"};
        double[] weights = {0.15, 0.25, 0.20, 0.30, 0.10};
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> factor = new HashMap<>();
            factor.put("id", i + 1);
            factor.put("name", factorNames[i]);
            factor.put("weight", weights[i]);
            factor.put("score", ThreadLocalRandom.current().nextInt(3, 15));
            factor.put("description", "Risk factor description for " + factorNames[i]);
            factors.add(factor);
        }
        
        return factors;
    }

    private List<Map<String, Object>> generateEntityHistory(String entityId) {
        List<Map<String, Object>> history = new ArrayList<>();
        String[] events = {"Login from new IP", "Large file download", "Access to admin panel", "Failed login attempt", "Database query execution"};
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> event = new HashMap<>();
            event.put("timestamp", "2024-01-15 " + (14 + i) + ":30");
            event.put("event", events[i]);
            event.put("score", ThreadLocalRandom.current().nextInt(3, 15));
            history.add(event);
        }
        
        return history;
    }

    private List<String> generateRecommendations(int riskScore) {
        List<String> recommendations = new ArrayList<>();
        if (riskScore > 35) {
            recommendations.add("Immediate review of user access patterns");
            recommendations.add("Implement additional authentication measures");
            recommendations.add("Monitor file transfer activities closely");
        } else if (riskScore > 25) {
            recommendations.add("Review recent login patterns");
            recommendations.add("Monitor file transfer activities");
            recommendations.add("Implement additional authentication for admin access");
        } else {
            recommendations.add("Continue monitoring for unusual activity");
            recommendations.add("Regular security training for user");
        }
        return recommendations;
    }

    private List<Map<String, Object>> generateThreatTypes() {
        List<Map<String, Object>> threats = new ArrayList<>();
        String[] types = {"Privilege Escalation", "Data Exfiltration", "Unauthorized Access", "Malware Activity", "Other"};
        int[] counts = {45, 32, 28, 15, 8};
        int[] percentages = {35, 25, 22, 12, 6};
        
        for (int i = 0; i < 5; i++) {
            Map<String, Object> threat = new HashMap<>();
            threat.put("type", types[i]);
            threat.put("count", counts[i]);
            threat.put("percentage", percentages[i]);
            threats.add(threat);
        }
        
        return threats;
    }

    private List<Map<String, Object>> generateTimeAnalysis() {
        List<Map<String, Object>> analysis = new ArrayList<>();
        String[] hours = {"00:00", "04:00", "08:00", "12:00", "16:00", "20:00"};
        
        for (String hour : hours) {
            Map<String, Object> data = new HashMap<>();
            data.put("hour", hour);
            data.put("incidents", ThreadLocalRandom.current().nextInt(3, 20));
            data.put("avgScore", ThreadLocalRandom.current().nextInt(20, 45));
            analysis.add(data);
        }
        
        return analysis;
    }
}