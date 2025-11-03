package com.example.neurofleetbackkendD.model;




import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenanceType;
import com.example.neurofleetbackkendD.model.enums.Priority;

@Entity
@Table(name = "maintenance")
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
  
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    @Enumerated(EnumType.STRING)
    private MaintenanceType issueType;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status = MaintenanceStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;
    
    private Boolean isPredictive = false;
    private Integer predictedDaysToFailure;
    private LocalDateTime scheduledDate;
    private LocalDateTime completedDate;
    private Double estimatedCost;
    private Double actualCost;
    private String mechanicNotes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Maintenance() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }

    public MaintenanceType getIssueType() { return issueType; }
    public void setIssueType(MaintenanceType issueType) { this.issueType = issueType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public MaintenanceStatus getStatus() { return status; }
    public void setStatus(MaintenanceStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Boolean getIsPredictive() { return isPredictive; }
    public void setIsPredictive(Boolean isPredictive) { this.isPredictive = isPredictive; }

    public Integer getPredictedDaysToFailure() { return predictedDaysToFailure; }
    public void setPredictedDaysToFailure(Integer predictedDaysToFailure) { this.predictedDaysToFailure = predictedDaysToFailure; }

    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getActualCost() { return actualCost; }
    public void setActualCost(Double actualCost) { this.actualCost = actualCost; }

    public String getMechanicNotes() { return mechanicNotes; }
    public void setMechanicNotes(String mechanicNotes) { this.mechanicNotes = mechanicNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PreUpdate
    protected void onUpdate() {
        if (status == MaintenanceStatus.COMPLETED && completedDate == null) {
            completedDate = LocalDateTime.now();
        }
    }
}
