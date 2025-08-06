package com.riskguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main Spring Boot application for Predictive Dynamic Risk Scoring System
 * 
 * This application provides:
 * - Real-time risk assessment using ML models (Isolation Forest, Random Forest)
 * - Dynamic rule-based scoring with Drools engine
 * - RESTful APIs for risk management
 * - Kafka integration for real-time event processing
 * - Comprehensive monitoring and observability
 * 
 * @author RiskGuard Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
@EnableCaching
@EnableAsync
@EnableScheduling
public class RiskScoringApplication {

    public static void main(String[] args) {
        SpringApplication.run(RiskScoringApplication.class, args);
    }
} 