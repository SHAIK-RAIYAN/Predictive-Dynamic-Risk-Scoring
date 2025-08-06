package com.riskguard.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * RiskAssessment records the detailed scoring and category during an entity's
 * assessment.
 */
@Entity
@Table(name = "risk_assessments")
@EntityListeners(AuditingEntityListener.class)
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "entity_id", nullable = false)
    private MonitoredEntity entity;

    @NotNull
    private Double score;

    @Enumerated(EnumType.STRING)
    @NotNull
    private MonitoredEntity.RiskLevel riskLevel;

    private String summary;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public RiskAssessment() {
    }

    public RiskAssessment(MonitoredEntity entity, Double score, MonitoredEntity.RiskLevel riskLevel, String summary) {
        this.entity = entity;
        this.score = score;
        this.riskLevel = riskLevel;
        this.summary = summary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public MonitoredEntity getEntity() {
        return entity;
    }

    public void setEntity(MonitoredEntity entity) {
        this.entity = entity;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public MonitoredEntity.RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(MonitoredEntity.RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public String toString() {
        return "RiskAssessment{" +
                "id=" + id +
                ", entity=" + (entity != null ? entity.getEntityId() : null) +
                ", score=" + score +
                ", riskLevel=" + riskLevel +
                ", summary='" + summary + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
