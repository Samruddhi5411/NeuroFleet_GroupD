package com.example.neurofleetbackkendD.model;




import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;



@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String vehicleNumber;
    
    private String manufacturer;
    private String model;
    
    @Enumerated(EnumType.STRING)
    private VehicleType type;
    
    private Integer capacity;
    private Boolean isElectric = false;
    
    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.AVAILABLE;
    
    private Double latitude;
    private Double longitude;
    
    private Integer batteryLevel = 100;
    private Integer fuelLevel = 100;
    private Integer healthScore = 100;
    private Integer mileage = 0;
    private Double speed = 0.0;
    
    @ManyToOne
    @JoinColumn(name = "current_driver_id")
    private User currentDriver;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastUpdated = LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
    
    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Boolean getIsElectric() { return isElectric; }
    public void setIsElectric(Boolean isElectric) { this.isElectric = isElectric; }
    
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    
    public Integer getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Integer fuelLevel) { this.fuelLevel = fuelLevel; }
    
    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }
    
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    
    public User getCurrentDriver() { return currentDriver; }
    public void setCurrentDriver(User currentDriver) { this.currentDriver = currentDriver; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    
    @PrePersist
    @PreUpdate
    public void applyDefaults() {
        if (batteryLevel == null) batteryLevel = 100;
        if (fuelLevel == null) fuelLevel = 100;
        if (healthScore == null) healthScore = 100;
        if (mileage == null) mileage = 0;
        if (speed == null) speed = 0.0;
        if (isElectric == null) isElectric = false;
        if (status == null) status = VehicleStatus.AVAILABLE;
        if (createdAt == null) createdAt = LocalDateTime.now();

        lastUpdated = LocalDateTime.now();
    }

}  