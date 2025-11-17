package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.neurofleetbackkendD.model.enums.TicketCategory;
import com.example.neurofleetbackkendD.model.enums.TicketStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking relatedBooking;
    
    private String subject;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TicketCategory category = TicketCategory.GENERAL;
    
    @Enumerated(EnumType.STRING)
    private MaintenancePriority priority = MaintenancePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;
    
    private String resolution;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    
    public Booking getRelatedBooking() { return relatedBooking; }
    public void setRelatedBooking(Booking relatedBooking) { 
        this.relatedBooking = relatedBooking; 
    }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }
    
    public MaintenancePriority getPriority() { return priority; }
    public void setPriority(MaintenancePriority priority) { this.priority = priority; }
    
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    
    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
