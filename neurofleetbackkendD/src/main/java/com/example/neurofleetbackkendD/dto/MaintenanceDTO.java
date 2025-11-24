package com.example.neurofleetbackkendD.dto;

import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import java.time.LocalDateTime;

public class MaintenanceDTO {
    private Long id;
    private VehicleDTO vehicle;
    private String issueType;
    private String description;
    private MaintenanceStatus status;
    private MaintenancePriority priority;
    private Integer riskScore;
    private Integer predictedDaysToFailure;
    private Boolean isPredictive;
    private LocalDateTime scheduledDate;
    private LocalDateTime completedDate;
    private Double estimatedCost;
    private String mechanicAssigned;
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public VehicleDTO getVehicle() { return vehicle; }
    public void setVehicle(VehicleDTO vehicle) { this.vehicle = vehicle; }

    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }

    public MaintenancePriority getPriority() { return priority; }
    public void setPriority(MaintenancePriority priority) { this.priority = priority; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Integer getPredictedDaysToFailure() { return predictedDaysToFailure; }
    public void setPredictedDaysToFailure(Integer predictedDaysToFailure) { this.predictedDaysToFailure = predictedDaysToFailure; }

    public Boolean getIsPredictive() { return isPredictive; }
    public void setIsPredictive(Boolean isPredictive) { this.isPredictive = isPredictive; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getMechanicAssigned() { return mechanicAssigned; }
    public void setMechanicAssigned(String mechanicAssigned) { this.mechanicAssigned = mechanicAssigned; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
