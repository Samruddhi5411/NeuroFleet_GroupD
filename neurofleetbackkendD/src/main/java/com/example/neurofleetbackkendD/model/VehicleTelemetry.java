package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_telemetry")
public class VehicleTelemetry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Integer batteryLevel;
    private Integer fuelLevel;
    private Integer healthScore;
    private Integer mileage;
    
    private Double engineTemperature;
    private Double tirePressure;
    private String status;
    
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    
    public Integer getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Integer fuelLevel) { this.fuelLevel = fuelLevel; }
    
    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }
    
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    
    public Double getEngineTemperature() { return engineTemperature; }
    public void setEngineTemperature(Double engineTemperature) { 
        this.engineTemperature = engineTemperature; 
    }
    
    public Double getTirePressure() { return tirePressure; }
    public void setTirePressure(Double tirePressure) { 
        this.tirePressure = tirePressure; 
    }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}