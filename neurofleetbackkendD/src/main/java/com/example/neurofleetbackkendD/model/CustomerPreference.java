package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_preferences")
public class CustomerPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    private String preferredVehicleType; // SEDAN, SUV, etc.
    private Boolean preferElectric;
    private Integer minSeats;
    private Integer maxSeats;
    private String priceRange; // BUDGET, STANDARD, PREMIUM
    private String preferredFeatures; // JSON array
    
    private Integer totalBookings = 0;
    private String mostBookedVehicleType;
    private Double averageBookingPrice;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    
    public String getPreferredVehicleType() { return preferredVehicleType; }
    public void setPreferredVehicleType(String preferredVehicleType) { 
        this.preferredVehicleType = preferredVehicleType; 
    }
    
    public Boolean getPreferElectric() { return preferElectric; }
    public void setPreferElectric(Boolean preferElectric) { 
        this.preferElectric = preferElectric; 
    }
    
    public Integer getMinSeats() { return minSeats; }
    public void setMinSeats(Integer minSeats) { this.minSeats = minSeats; }
    
    public Integer getMaxSeats() { return maxSeats; }
    public void setMaxSeats(Integer maxSeats) { this.maxSeats = maxSeats; }
    
    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }
    
    public String getPreferredFeatures() { return preferredFeatures; }
    public void setPreferredFeatures(String preferredFeatures) { 
        this.preferredFeatures = preferredFeatures; 
    }
    
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { 
        this.totalBookings = totalBookings; 
    }
    
    public String getMostBookedVehicleType() { return mostBookedVehicleType; }
    public void setMostBookedVehicleType(String mostBookedVehicleType) { 
        this.mostBookedVehicleType = mostBookedVehicleType; 
    }
    
    public Double getAverageBookingPrice() { return averageBookingPrice; }
    public void setAverageBookingPrice(Double averageBookingPrice) { 
        this.averageBookingPrice = averageBookingPrice; 
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}