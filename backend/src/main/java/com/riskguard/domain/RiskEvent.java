package com.riskguard.domain;

import com.riskguard.domain.MonitoredEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * RiskEvent represents security events and incidents that contribute to risk
 * scoring
 */
@Entity
@Table(name = "risk_events")
@EntityListeners(AuditingEntityListener.class)
public class RiskEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private MonitoredEntity entity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String sourceIp;

    @Column
    private String destinationIp;

    @Column
    private Integer port;

    @Column
    private String protocol;

    @Column
    private String userAgent;

    @Column
    private String sessionId;

    @Column
    private String filePath;

    @Column
    private Long fileSize;

    @Column
    private String action;

    @Column
    private String result;

    @Column
    private Double riskScore;

    @Column
    private Boolean isResolved = false;

    @Column
    private LocalDateTime resolvedAt;

    @Column
    private String resolvedBy;

    @Column
    private String resolutionNotes;

    @Column
    private Boolean isFalsePositive = false;

    @Column
    private String tags;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime eventTimestamp;

    @ElementCollection
    @CollectionTable(name = "risk_event_metadata", joinColumns = @JoinColumn(name = "risk_event_id"))
    @MapKeyColumn(name = "metadata_key")
    @Column(name = "metadata_value", columnDefinition = "TEXT")
    private Map<String, String> metadata = new HashMap<>();

    // Constructors
    public RiskEvent() {
    }

    public RiskEvent(MonitoredEntity entity, EventType eventType, Severity severity, String title) {
        this.entity = entity;
        this.eventType = eventType;
        this.severity = severity;
        this.title = title;
        this.eventTimestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MonitoredEntity getEntity() {
        return entity;
    }

    public void setEntity(MonitoredEntity entity) {
        this.entity = entity;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSourceIp() {
        return sourceIp;
    }

    public void setSourceIp(String sourceIp) {
        this.sourceIp = sourceIp;
    }

    public String getDestinationIp() {
        return destinationIp;
    }

    public void setDestinationIp(String destinationIp) {
        this.destinationIp = destinationIp;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }

    public Boolean getIsResolved() {
        return isResolved;
    }

    public void setIsResolved(Boolean isResolved) {
        this.isResolved = isResolved;
        if (isResolved && this.resolvedAt == null) {
            this.resolvedAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Boolean getIsFalsePositive() {
        return isFalsePositive;
    }

    public void setIsFalsePositive(Boolean isFalsePositive) {
        this.isFalsePositive = isFalsePositive;
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

    public LocalDateTime getEventTimestamp() {
        return eventTimestamp;
    }

    public void setEventTimestamp(LocalDateTime eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    // Business Methods
    public void resolve(String resolvedBy, String resolutionNotes) {
        this.isResolved = true;
        this.resolvedBy = resolvedBy;
        this.resolutionNotes = resolutionNotes;
        this.resolvedAt = LocalDateTime.now();
    }

    public void markAsFalsePositive() {
        this.isFalsePositive = true;
        this.isResolved = true;
        this.resolvedAt = LocalDateTime.now();
    }

    public boolean isHighSeverity() {
        return severity == Severity.HIGH || severity == Severity.CRITICAL;
    }

    public boolean isRecent() {
        return eventTimestamp.isAfter(LocalDateTime.now().minusHours(24));
    }

    public void addMetadata(String key, String value) {
        this.metadata.put(key, value);
    }

    public String getMetadataValue(String key) {
        return this.metadata.get(key);
    }

    @Override
    public String toString() {
        return "RiskEvent{" +
                "id=" + id +
                ", eventType=" + eventType +
                ", severity=" + severity +
                ", title='" + title + '\'' +
                ", riskScore=" + riskScore +
                ", isResolved=" + isResolved +
                '}';
    }

    // Enums
    public enum EventType {
        // Authentication Events
        LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, PASSWORD_CHANGE, PASSWORD_RESET,

        // Network Events
        CONNECTION_ATTEMPT, CONNECTION_SUCCESS, CONNECTION_FAILURE,
        PORT_SCAN, BRUTE_FORCE_ATTACK, DDoS_ATTACK,

        // File System Events
        FILE_ACCESS, FILE_DOWNLOAD, FILE_UPLOAD, FILE_DELETE, FILE_MODIFY,
        LARGE_FILE_TRANSFER, UNAUTHORIZED_FILE_ACCESS,

        // Privilege Events
        PRIVILEGE_ESCALATION, ADMIN_ACCESS, ROLE_CHANGE, PERMISSION_CHANGE,

        // Data Events
        DATA_ACCESS, DATA_EXPORT, DATA_DELETION, SENSITIVE_DATA_ACCESS,

        // System Events
        SYSTEM_STARTUP, SYSTEM_SHUTDOWN, CONFIGURATION_CHANGE, PATCH_INSTALLATION,

        // Application Events
        APPLICATION_START, APPLICATION_STOP, API_CALL, DATABASE_QUERY,

        // Other Events
        SUSPICIOUS_ACTIVITY, ANOMALY_DETECTED, THREAT_DETECTED, COMPLIANCE_VIOLATION
    }

    public enum Severity {
        LOW(1), MEDIUM(2), HIGH(3), CRITICAL(4);

        private final int level;

        Severity(int level) {
            this.level = level;
        }

        public int getLevel() {
            return level;
        }
    }
}