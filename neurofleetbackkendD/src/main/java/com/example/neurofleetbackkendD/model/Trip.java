package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private Double startLatitude;
    private Double startLongitude;
    private Double endLatitude;
    private Double endLongitude;
    
    private Double distanceTraveled; // in km
    private Long durationMinutes;
    
    private Double averageSpeed;
    private Double maxSpeed;
    
    private Integer startFuelLevel;
    private Integer endFuelLevel;
    private Integer fuelConsumed;
    
    private Integer startBatteryLevel;
    private Integer endBatteryLevel;
    private Integer batteryConsumed;
    
    private String status; // STARTED, IN_PROGRESS, COMPLETED, CANCELLED
    
    private Double tripCost;
    private Double driverEarnings;
    
    private String route; // JSON or text representation of route
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    
    private String notes;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }
    
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public Double getStartLatitude() { return startLatitude; }
    public void setStartLatitude(Double startLatitude) { this.startLatitude = startLatitude; }
    
    public Double getStartLongitude() { return startLongitude; }
    public void setStartLongitude(Double startLongitude) { this.startLongitude = startLongitude; }
    
    public Double getEndLatitude() { return endLatitude; }
    public void setEndLatitude(Double endLatitude) { this.endLatitude = endLatitude; }
    
    public Double getEndLongitude() { return endLongitude; }
    public void setEndLongitude(Double endLongitude) { this.endLongitude = endLongitude; }
    
    public Double getDistanceTraveled() { return distanceTraveled; }
    public void setDistanceTraveled(Double distanceTraveled) { this.distanceTraveled = distanceTraveled; }
    
    public Long getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public Double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(Double averageSpeed) { this.averageSpeed = averageSpeed; }
    
    public Double getMaxSpeed() { return maxSpeed; }
    public void setMaxSpeed(Double maxSpeed) { this.maxSpeed = maxSpeed; }
    
    public Integer getStartFuelLevel() { return startFuelLevel; }
    public void setStartFuelLevel(Integer startFuelLevel) { this.startFuelLevel = startFuelLevel; }
    
    public Integer getEndFuelLevel() { return endFuelLevel; }
    public void setEndFuelLevel(Integer endFuelLevel) { this.endFuelLevel = endFuelLevel; }
    
    public Integer getFuelConsumed() { return fuelConsumed; }
    public void setFuelConsumed(Integer fuelConsumed) { this.fuelConsumed = fuelConsumed; }
    
    public Integer getStartBatteryLevel() { return startBatteryLevel; }
    public void setStartBatteryLevel(Integer startBatteryLevel) { this.startBatteryLevel = startBatteryLevel; }
    
    public Integer getEndBatteryLevel() { return endBatteryLevel; }
    public void setEndBatteryLevel(Integer endBatteryLevel) { this.endBatteryLevel = endBatteryLevel; }
    
    public Integer getBatteryConsumed() { return batteryConsumed; }
    public void setBatteryConsumed(Integer batteryConsumed) { this.batteryConsumed = batteryConsumed; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Double getTripCost() { return tripCost; }
    public void setTripCost(Double tripCost) { this.tripCost = tripCost; }
    
    public Double getDriverEarnings() { return driverEarnings; }
    public void setDriverEarnings(Double driverEarnings) { this.driverEarnings = driverEarnings; }
    
    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}