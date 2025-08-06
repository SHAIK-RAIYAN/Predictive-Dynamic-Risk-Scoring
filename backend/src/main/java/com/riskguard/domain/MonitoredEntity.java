package com.riskguard.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * MonitoredEntity represents users, servers, and other assets monitored for risk assessment
 */
@Entity
@Table(name = "entities")
@EntityListeners(AuditingEntityListener.class)
public class MonitoredEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String entityId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType type;

    @Column(nullable = false)
    private String department;

    @Column
    private String ipAddress;

    @Column
    private String macAddress;

    @Column
    private String hostname;

    @Column
    private String operatingSystem;

    @Column
    private String location;

    @Column
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel currentRiskLevel = RiskLevel.LOW;

    @Column(nullable = false)
    private Double currentRiskScore = 5.0;

    @Column
    private Double previousRiskScore;

    @Column
    private LocalDateTime lastActivity;

    @Column
    private LocalDateTime lastRiskAssessment;

    @Column
    private Boolean isActive = true;

    @Column
    private String tags;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "entity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RiskEvent> riskEvents = new ArrayList<>();

    @OneToMany(mappedBy = "entity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RiskAssessment> riskAssessments = new ArrayList<>();

    // Constructors
    public MonitoredEntity() {}

    public MonitoredEntity(String entityId, String name, EntityType type, String department) {
        this.entityId = entityId;
        this.name = name;
        this.type = type;
        this.department = department;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EntityType getType() {
        return type;
    }

    public void setType(EntityType type) {
        this.type = type;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RiskLevel getCurrentRiskLevel() {
        return currentRiskLevel;
    }

    public void setCurrentRiskLevel(RiskLevel currentRiskLevel) {
        this.currentRiskLevel = currentRiskLevel;
    }

    public Double getCurrentRiskScore() {
        return currentRiskScore;
    }

    public void setCurrentRiskScore(Double currentRiskScore) {
        this.previousRiskScore = this.currentRiskScore;
        this.currentRiskScore = currentRiskScore;
        this.currentRiskLevel = calculateRiskLevel(currentRiskScore);
        this.lastRiskAssessment = LocalDateTime.now();
    }

    public Double getPreviousRiskScore() {
        return previousRiskScore;
    }

    public void setPreviousRiskScore(Double previousRiskScore) {
        this.previousRiskScore = previousRiskScore;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public LocalDateTime getLastRiskAssessment() {
        return lastRiskAssessment;
    }

    public void setLastRiskAssessment(LocalDateTime lastRiskAssessment) {
        this.lastRiskAssessment = lastRiskAssessment;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<RiskEvent> getRiskEvents() {
        return riskEvents;
    }

    public void setRiskEvents(List<RiskEvent> riskEvents) {
        this.riskEvents = riskEvents;
    }

    public List<RiskAssessment> getRiskAssessments() {
        return riskAssessments;
    }

    public void setRiskAssessments(List<RiskAssessment> riskAssessments) {
        this.riskAssessments = riskAssessments;
    }

    // Business Methods
    public void updateActivity() {
        this.lastActivity = LocalDateTime.now();
    }

    public boolean isHighRisk() {
        return currentRiskLevel == RiskLevel.HIGH;
    }

    public boolean isMediumRisk() {
        return currentRiskLevel == RiskLevel.MEDIUM;
    }

    public boolean isLowRisk() {
        return currentRiskLevel == RiskLevel.LOW;
    }

    public double getRiskScoreChange() {
        if (previousRiskScore == null) {
            return 0.0;
        }
        return currentRiskScore - previousRiskScore;
    }

    private RiskLevel calculateRiskLevel(Double score) {
        if (score >= 40) {
            return RiskLevel.HIGH;
        } else if (score >= 25) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.LOW;
        }
    }

    @Override
    public String toString() {
        return "MonitoredEntity{" +
                "id=" + id +
                ", entityId='" + entityId + '\'' +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", department='" + department + '\'' +
                ", currentRiskLevel=" + currentRiskLevel +
                ", currentRiskScore=" + currentRiskScore +
                '}';
    }

    // Enums
    public enum EntityType {
        USER, SERVER, DATABASE, NETWORK_DEVICE, APPLICATION, CONTAINER, VIRTUAL_MACHINE
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }
} 