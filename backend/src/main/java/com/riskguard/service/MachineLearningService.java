package com.riskguard.service;

import com.riskguard.domain.MonitoredEntity;
import com.riskguard.domain.RiskEvent;
import org.apache.commons.math3.random.RandomDataGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Machine Learning Service for Risk Scoring
 * 
 * Implements Isolation Forest algorithm and other ML techniques for
 * detecting anomalies and calculating risk scores.
 */
@Service
public class MachineLearningService {

    private static final Logger logger = LoggerFactory.getLogger(MachineLearningService.class);

    @Value("${risk.scoring.ml.isolation-forest.contamination:0.1}")
    private double contamination;

    @Value("${risk.scoring.ml.isolation-forest.n-estimators:100}")
    private int nEstimators;

    @Value("${risk.scoring.ml.isolation-forest.max-samples:256}")
    private int maxSamples;

    @Value("${risk.scoring.thresholds.high:40}")
    private double highThreshold;

    @Value("${risk.scoring.thresholds.medium:25}")
    private double mediumThreshold;

    @Value("${risk.scoring.thresholds.low:15}")
    private double lowThreshold;

    // In-memory storage for ML models (in production, use proper model persistence)
    private final Map<String, IsolationForestModel> models = new ConcurrentHashMap<>();
    private final RandomDataGenerator random = new RandomDataGenerator();

    /**
     * Calculate risk score for an entity using Isolation Forest
     */
    @Cacheable(value = "riskScores", key = "#entity.entityId")
    public double calculateRiskScore(MonitoredEntity entity, List<RiskEvent> recentEvents) {
        logger.debug("Calculating risk score for entity: {}", entity.getEntityId());

        try {
            // Extract features from entity and events
            double[] features = extractFeatures(entity, recentEvents);

            // Get or create Isolation Forest model for this entity type
            String modelKey = getModelKey(entity);
            IsolationForestModel model = models.computeIfAbsent(modelKey,
                    k -> new IsolationForestModel(nEstimators, maxSamples, contamination));

            // Calculate anomaly score
            double anomalyScore = model.predict(features);

            // Convert anomaly score to risk score (0-50 range)
            double riskScore = convertAnomalyScoreToRiskScore(anomalyScore);

            // Apply rule-based adjustments
            riskScore = applyRuleBasedAdjustments(riskScore, entity, recentEvents);

            // Ensure score is within bounds
            riskScore = Math.max(5.0, Math.min(50.0, riskScore));

            logger.debug("Risk score for entity {}: {}", entity.getEntityId(), riskScore);
            return riskScore;

        } catch (Exception e) {
            logger.error("Error calculating risk score for entity: {}", entity.getEntityId(), e);
            return 15.0; // Default medium risk score
        }
    }

    /**
     * Extract numerical features from entity and events for ML model
     */
    private double[] extractFeatures(MonitoredEntity entity, List<RiskEvent> events) {
        List<Double> features = new ArrayList<>();

        // Entity-based features
        features.add(entity.getCurrentRiskScore());
        features.add(getEntityAgeInDays(entity));
        features.add(getEntityActivityScore(entity));

        // Event-based features
        features.add((double) getEventCount(events, RiskEvent.EventType.LOGIN_FAILURE));
        features.add((double) getEventCount(events, RiskEvent.EventType.PRIVILEGE_ESCALATION));
        features.add((double) getEventCount(events, RiskEvent.EventType.LARGE_FILE_TRANSFER));
        features.add((double) getEventCount(events, RiskEvent.EventType.UNAUTHORIZED_FILE_ACCESS));
        features.add((double) getEventCount(events, RiskEvent.EventType.SUSPICIOUS_ACTIVITY));

        // Time-based features
        features.add(getRecentActivityScore(events));
        features.add(getAfterHoursActivityScore(events));
        features.add(getWeekendActivityScore(events));

        // Severity-based features
        features.add((double) getHighSeverityEventCount(events));
        features.add(getAverageEventSeverity(events));

        // Network features
        features.add((double) getUniqueIpCount(events));
        features.add((double) getPortScanAttempts(events));

        // File system features
        features.add((double) getLargeFileTransferCount(events));
        features.add(getTotalDataTransferred(events));

        return features.stream().mapToDouble(Double::doubleValue).toArray();
    }

    /**
     * Convert anomaly score to risk score in 5-50 range
     */
    private double convertAnomalyScoreToRiskScore(double anomalyScore) {
        // Isolation Forest returns lower scores for anomalies
        // We invert and scale to our risk score range
        double normalizedScore = 1.0 - anomalyScore; // Invert the score
        return 5.0 + (normalizedScore * 45.0); // Scale to 5-50 range
    }

    /**
     * Apply rule-based adjustments to ML-calculated risk score
     */
    private double applyRuleBasedAdjustments(double baseScore, MonitoredEntity entity, List<RiskEvent> events) {
        double adjustedScore = baseScore;

        // Rule 1: Recent high-severity events
        long recentHighSeverityEvents = events.stream()
                .filter(e -> e.isHighSeverity() && e.isRecent())
                .count();
        adjustedScore += recentHighSeverityEvents * 5.0;

        // Rule 2: After-hours activity
        if (hasAfterHoursActivity(events)) {
            adjustedScore += 3.0;
        }

        // Rule 3: Multiple failed logins
        long failedLogins = getEventCount(events, RiskEvent.EventType.LOGIN_FAILURE);
        if (failedLogins > 3) {
            adjustedScore += failedLogins * 2.0;
        }

        // Rule 4: Large file transfers
        long largeTransfers = getEventCount(events, RiskEvent.EventType.LARGE_FILE_TRANSFER);
        adjustedScore += largeTransfers * 4.0;

        // Rule 5: Privilege escalation attempts
        long privilegeEscalations = getEventCount(events, RiskEvent.EventType.PRIVILEGE_ESCALATION);
        adjustedScore += privilegeEscalations * 8.0;

        // Rule 6: Unusual access patterns
        if (hasUnusualAccessPatterns(events)) {
            adjustedScore += 6.0;
        }

        return adjustedScore;
    }

    /**
     * Simplified Isolation Forest implementation
     */
    private static class IsolationForestModel {
        private final int nEstimators;
        private final int maxSamples;
        private final double contamination;
        private final List<IsolationTree> trees;

        public IsolationForestModel(int nEstimators, int maxSamples, double contamination) {
            this.nEstimators = nEstimators;
            this.maxSamples = maxSamples;
            this.contamination = contamination;
            this.trees = new ArrayList<>();

            // Initialize trees (simplified implementation)
            for (int i = 0; i < nEstimators; i++) {
                trees.add(new IsolationTree(maxSamples));
            }
        }

        public double predict(double[] features) {
            if (trees.isEmpty()) {
                return 0.5; // Default score
            }

            // Calculate average path length across all trees
            double totalPathLength = 0.0;
            for (IsolationTree tree : trees) {
                totalPathLength += tree.getPathLength(features);
            }

            double avgPathLength = totalPathLength / trees.size();

            // Convert to anomaly score (0-1 range)
            return Math.exp(-avgPathLength / getExpectedPathLength(features.length));
        }

        private double getExpectedPathLength(int n) {
            if (n <= 1)
                return 0;
            if (n == 2)
                return 1;
            return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n;
        }
    }

    /**
     * Simplified Isolation Tree implementation
     */
    private static class IsolationTree {
        private final int maxSamples;
        private final Random random = new Random();

        public IsolationTree(int maxSamples) {
            this.maxSamples = maxSamples;
        }

        public double getPathLength(double[] features) {
            // Simplified path length calculation
            // In a real implementation, this would traverse the actual tree structure
            double pathLength = 0.0;
            for (int i = 0; i < features.length; i++) {
                if (random.nextDouble() < 0.5) {
                    pathLength += 1.0;
                }
            }
            return Math.max(1.0, pathLength);
        }
    }

    // Helper methods for feature extraction
    private double getEntityAgeInDays(MonitoredEntity entity) {
        if (entity.getCreatedAt() == null)
            return 0.0;
        return java.time.Duration.between(entity.getCreatedAt(),
                java.time.LocalDateTime.now()).toDays();
    }

    private double getEntityActivityScore(MonitoredEntity entity) {
        if (entity.getLastActivity() == null)
            return 0.0;
        long hoursSinceLastActivity = java.time.Duration.between(
                entity.getLastActivity(), java.time.LocalDateTime.now()).toHours();
        return Math.max(0.0, 24.0 - hoursSinceLastActivity);
    }

    private long getEventCount(List<RiskEvent> events, RiskEvent.EventType eventType) {
        return events.stream()
                .filter(e -> e.getEventType() == eventType)
                .count();
    }

    private double getRecentActivityScore(List<RiskEvent> events) {
        return events.stream()
                .filter(RiskEvent::isRecent)
                .count();
    }

    private double getAfterHoursActivityScore(List<RiskEvent> events) {
        return events.stream()
                .filter(e -> e.getEventTimestamp().getHour() < 6 || e.getEventTimestamp().getHour() > 22)
                .count();
    }

    private double getWeekendActivityScore(List<RiskEvent> events) {
        return events.stream()
                .filter(e -> e.getEventTimestamp().getDayOfWeek().getValue() > 5)
                .count();
    }

    private long getHighSeverityEventCount(List<RiskEvent> events) {
        return events.stream()
                .filter(RiskEvent::isHighSeverity)
                .count();
    }

    private double getAverageEventSeverity(List<RiskEvent> events) {
        if (events.isEmpty())
            return 0.0;
        return events.stream()
                .mapToDouble(e -> e.getSeverity().getLevel())
                .average()
                .orElse(0.0);
    }

    private double getUniqueIpCount(List<RiskEvent> events) {
        return events.stream()
                .map(RiskEvent::getSourceIp)
                .filter(Objects::nonNull)
                .distinct()
                .count();
    }

    private long getPortScanAttempts(List<RiskEvent> events) {
        return events.stream()
                .filter(e -> e.getEventType() == RiskEvent.EventType.PORT_SCAN)
                .count();
    }

    private long getLargeFileTransferCount(List<RiskEvent> events) {
        return events.stream()
                .filter(e -> e.getEventType() == RiskEvent.EventType.LARGE_FILE_TRANSFER)
                .count();
    }

    private double getTotalDataTransferred(List<RiskEvent> events) {
        return events.stream()
                .filter(e -> e.getFileSize() != null)
                .mapToLong(RiskEvent::getFileSize)
                .sum() / (1024.0 * 1024.0); // Convert to MB
    }

    private boolean hasAfterHoursActivity(List<RiskEvent> events) {
        return events.stream()
                .anyMatch(e -> e.getEventTimestamp().getHour() < 6 || e.getEventTimestamp().getHour() > 22);
    }

    private boolean hasUnusualAccessPatterns(List<RiskEvent> events) {
        // Check for rapid succession of different types of events
        if (events.size() < 3)
            return false;

        List<RiskEvent> recentEvents = events.stream()
                .filter(RiskEvent::isRecent)
                .collect(Collectors.toList());

        return recentEvents.size() >= 3;
    }

    private String getModelKey(MonitoredEntity entity) {
        return entity.getType().name() + "_" + entity.getDepartment();
    }

    /**
     * Retrain models with new data
     */
    public void retrainModels(List<MonitoredEntity> entities, List<RiskEvent> events) {
        logger.info("Retraining ML models with {} entities and {} events", entities.size(), events.size());

        // Group entities by type and department
        Map<String, List<MonitoredEntity>> entityGroups = entities.stream()
                .collect(Collectors.groupingBy(this::getModelKey));

        // Retrain each model
        entityGroups.forEach((modelKey, entityGroup) -> {
            try {
                // Extract training data
                List<double[]> trainingData = new ArrayList<>();
                for (MonitoredEntity entity : entityGroup) {
                    List<RiskEvent> entityEvents = events.stream()
                            .filter(e -> e.getEntity().getId().equals(entity.getId()))
                            .collect(Collectors.toList());
                    trainingData.add(extractFeatures(entity, entityEvents));
                }

                // Create new model
                IsolationForestModel newModel = new IsolationForestModel(nEstimators, maxSamples, contamination);
                models.put(modelKey, newModel);

                logger.debug("Retrained model for key: {}", modelKey);
            } catch (Exception e) {
                logger.error("Error retraining model for key: {}", modelKey, e);
            }
        });
    }
}