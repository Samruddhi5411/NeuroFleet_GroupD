//package com.example.neurofleetbackkendD.model;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "vehicle_health_logs")
//public class VehicleHealthLog {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    
//    @ManyToOne
//    @JoinColumn(name = "vehicle_id", nullable = false)
//    private Vehicle vehicle;
//    
//    private Integer engineHealth;
//    private Double tirePressureFrontLeft;
//    private Double tirePressureFrontRight;
//    private Double tirePressureRearLeft;
//    private Double tirePressureRearRight;
//    private Integer batteryHealth;
//    private Integer fuelSystemHealth;
//    private Double engineTemperature;
//    private Double oilPressure;
//    private Integer brakeHealth;
//    private Integer transmissionHealth;
//    
//    private Integer overallHealthScore;
//    private String healthStatus; // HEALTHY, WARNING, CRITICAL
//    private String alerts; // JSON array of alert messages
//    
//    private LocalDateTime nextMaintenanceDate;
//    private Integer kmUntilMaintenance;
//    
//    private LocalDateTime timestamp = LocalDateTime.now();
//    
//  
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//    
//    public Vehicle getVehicle() { return vehicle; }
//    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
//    
//    public Integer getEngineHealth() { return engineHealth; }
//    public void setEngineHealth(Integer engineHealth) { this.engineHealth = engineHealth; }
//    
//    public Double getTirePressureFrontLeft() { return tirePressureFrontLeft; }
//    public void setTirePressureFrontLeft(Double tirePressureFrontLeft) { 
//        this.tirePressureFrontLeft = tirePressureFrontLeft; 
//    }
//    
//    public Double getTirePressureFrontRight() { return tirePressureFrontRight; }
//    public void setTirePressureFrontRight(Double tirePressureFrontRight) { 
//        this.tirePressureFrontRight = tirePressureFrontRight; 
//    }
//    
//    public Double getTirePressureRearLeft() { return tirePressureRearLeft; }
//    public void setTirePressureRearLeft(Double tirePressureRearLeft) { 
//        this.tirePressureRearLeft = tirePressureRearLeft; 
//    }
//    
//    public Double getTirePressureRearRight() { return tirePressureRearRight; }
//    public void setTirePressureRearRight(Double tirePressureRearRight) { 
//        this.tirePressureRearRight = tirePressureRearRight; 
//    }
//    
//    public Integer getBatteryHealth() { return batteryHealth; }
//    public void setBatteryHealth(Integer batteryHealth) { 
//        this.batteryHealth = batteryHealth; 
//    }
//    
//    public Integer getFuelSystemHealth() { return fuelSystemHealth; }
//    public void setFuelSystemHealth(Integer fuelSystemHealth) { 
//        this.fuelSystemHealth = fuelSystemHealth; 
//    }
//    
//    public Double getEngineTemperature() { return engineTemperature; }
//    public void setEngineTemperature(Double engineTemperature) { 
//        this.engineTemperature = engineTemperature; 
//    }
//    
//    public Double getOilPressure() { return oilPressure; }
//    public void setOilPressure(Double oilPressure) { this.oilPressure = oilPressure; }
//    
//    public Integer getBrakeHealth() { return brakeHealth; }
//    public void setBrakeHealth(Integer brakeHealth) { this.brakeHealth = brakeHealth; }
//    
//    public Integer getTransmissionHealth() { return transmissionHealth; }
//    public void setTransmissionHealth(Integer transmissionHealth) { 
//        this.transmissionHealth = transmissionHealth; 
//    }
//    
//    public Integer getOverallHealthScore() { return overallHealthScore; }
//    public void setOverallHealthScore(Integer overallHealthScore) { 
//        this.overallHealthScore = overallHealthScore; 
//    }
//    
//    public String getHealthStatus() { return healthStatus; }
//    public void setHealthStatus(String healthStatus) { 
//        this.healthStatus = healthStatus; 
//    }
//    
//    public String getAlerts() { return alerts; }
//    public void setAlerts(String alerts) { this.alerts = alerts; }
//    
//    public LocalDateTime getNextMaintenanceDate() { return nextMaintenanceDate; }
//    public void setNextMaintenanceDate(LocalDateTime nextMaintenanceDate) { 
//        this.nextMaintenanceDate = nextMaintenanceDate; 
//    }
//    
//    public Integer getKmUntilMaintenance() { return kmUntilMaintenance; }
//    public void setKmUntilMaintenance(Integer kmUntilMaintenance) { 
//        this.kmUntilMaintenance = kmUntilMaintenance; 
//    }
//    
//    public LocalDateTime getTimestamp() { return timestamp; }
//    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
//}
