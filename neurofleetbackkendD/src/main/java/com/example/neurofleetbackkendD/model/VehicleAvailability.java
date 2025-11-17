package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_availability")
public class VehicleAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isAvailable = true;
    private Double pricePerHour;
    private String slotStatus; // AVAILABLE, BOOKED, BLOCKED
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { 
        this.isAvailable = isAvailable; 
    }
    
    public Double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Double pricePerHour) { 
        this.pricePerHour = pricePerHour; 
    }
    
    public String getSlotStatus() { return slotStatus; }
    public void setSlotStatus(String slotStatus) { this.slotStatus = slotStatus; }
    
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
}
//booking calendar