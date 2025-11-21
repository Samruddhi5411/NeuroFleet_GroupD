package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;

@Entity
@Table(name = "maintenance_records")
public class MaintenanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    private String issueType;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private MaintenancePriority priority = MaintenancePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status = MaintenanceStatus.PENDING;
    
    private Integer predictedDaysToFailure;
    private Integer riskScore;
    private Boolean isPredictive = false;
    
    private LocalDateTime scheduledDate;
    private LocalDateTime completedDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private Double estimatedCost;
    private String mechanicAssigned;
    
  
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public String getIssueType() { return issueType; }
    public void setIssueType(String issueType) { this.issueType = issueType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public MaintenancePriority getPriority() { return priority; }
    public void setPriority(MaintenancePriority priority) { this.priority = priority; }
    
    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }
    
    public Integer getPredictedDaysToFailure() { return predictedDaysToFailure; }
    public void setPredictedDaysToFailure(Integer predictedDaysToFailure) { 
        this.predictedDaysToFailure = predictedDaysToFailure; 
    }
    
    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    
    public Boolean getIsPredictive() { return isPredictive; }
    public void setIsPredictive(Boolean isPredictive) { this.isPredictive = isPredictive; }
    
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { 
        this.scheduledDate = scheduledDate; 
    }
    
    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { 
        this.completedDate = completedDate; 
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { 
        this.estimatedCost = estimatedCost; 
    }
    
    public String getMechanicAssigned() { return mechanicAssigned; }
    public void setMechanicAssigned(String mechanicAssigned) { 
        this.mechanicAssigned = mechanicAssigned; 
    }
}