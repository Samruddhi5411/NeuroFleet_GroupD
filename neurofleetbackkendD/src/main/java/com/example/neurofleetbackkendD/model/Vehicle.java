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
    private String model;
    private String manufacturer;
    
    @Enumerated(EnumType.STRING)
    private VehicleType type;
    
    private Integer capacity;
    private Boolean isElectric = false;
    
    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.AVAILABLE;
    
    private Double batteryLevel = 100.0;
    private Double fuelLevel = 100.0;
    private Double latitude = 19.0760;
    private Double longitude = 72.8777;
    private Double speed = 0.0;
    private Integer mileage = 0;
    private Double healthScore = 100.0;
    private LocalDateTime lastServiceDate;
    private Integer kmsSinceService = 0;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Vehicle() {}

    public Vehicle(String vehicleNumber, String model, String manufacturer) {
        this.vehicleNumber = vehicleNumber;
        this.model = model;
        this.manufacturer = manufacturer;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public VehicleType getType() { return type; }
    public void setType(VehicleType type) { this.type = type; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Boolean getIsElectric() { return isElectric; }
    public void setIsElectric(Boolean isElectric) { this.isElectric = isElectric; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(Double fuelLevel) { this.fuelLevel = fuelLevel; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public Double getHealthScore() { return healthScore; }
    public void setHealthScore(Double healthScore) { this.healthScore = healthScore; }

    public LocalDateTime getLastServiceDate() { return lastServiceDate; }
    public void setLastServiceDate(LocalDateTime lastServiceDate) { this.lastServiceDate = lastServiceDate; }

    public Integer getKmsSinceService() { return kmsSinceService; }
    public void setKmsSinceService(Integer kmsSinceService) { this.kmsSinceService = kmsSinceService; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

