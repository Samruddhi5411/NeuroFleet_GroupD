package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.VehicleTelemetry;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.repository.VehicleTelemetryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class VehicleTelemetryService {
    
    @Autowired
    private VehicleTelemetryRepository telemetryRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    // Update vehicle telemetry
    @Transactional
    public VehicleTelemetry updateTelemetry(Long vehicleId, Map<String, Object> data) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        VehicleTelemetry telemetry = new VehicleTelemetry();
        telemetry.setVehicle(vehicle);
        telemetry.setLatitude((Double) data.get("latitude"));
        telemetry.setLongitude((Double) data.get("longitude"));
        telemetry.setSpeed((Double) data.get("speed"));
        telemetry.setBatteryLevel((Integer) data.get("batteryLevel"));
        telemetry.setFuelLevel((Integer) data.get("fuelLevel"));
        telemetry.setHealthScore((Integer) data.get("healthScore"));
        telemetry.setMileage((Integer) data.get("mileage"));
        telemetry.setEngineTemperature((Double) data.getOrDefault("engineTemperature", 90.0));
        telemetry.setTirePressure((Double) data.getOrDefault("tirePressure", 32.0));
        telemetry.setStatus((String) data.getOrDefault("status", "NORMAL"));
        telemetry.setTimestamp(LocalDateTime.now());
        
        // Update vehicle current values
        vehicle.setLatitude(telemetry.getLatitude());
        vehicle.setLongitude(telemetry.getLongitude());
        vehicle.setSpeed(telemetry.getSpeed());
        vehicle.setBatteryLevel(telemetry.getBatteryLevel());
        vehicle.setFuelLevel(telemetry.getFuelLevel());
        vehicle.setHealthScore(telemetry.getHealthScore());
        vehicle.setMileage(telemetry.getMileage());
        vehicle.setLastUpdated(LocalDateTime.now());
        
        vehicleRepository.save(vehicle);
        return telemetryRepository.save(telemetry);
    }
    
    // Get latest telemetry for vehicle
    public VehicleTelemetry getLatestTelemetry(Long vehicleId) {
        return telemetryRepository.findTopByVehicleIdOrderByTimestampDesc(vehicleId);
    }
    
    // Get telemetry history
    public List<VehicleTelemetry> getTelemetryHistory(Long vehicleId, 
                                                      LocalDateTime start, 
                                                      LocalDateTime end) {
        return telemetryRepository.findByVehicleIdAndTimestampBetween(vehicleId, start, end);
    }
    
    // Simulate telemetry for demo (runs every 30 seconds)
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void simulateTelemetry() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        Random random = new Random();
        
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getSpeed() > 0) { // Only for moving vehicles
                Map<String, Object> data = new HashMap<>();
                
                // Simulate movement
                data.put("latitude", vehicle.getLatitude() + (random.nextDouble() - 0.5) * 0.01);
                data.put("longitude", vehicle.getLongitude() + (random.nextDouble() - 0.5) * 0.01);
                data.put("speed", Math.max(0, vehicle.getSpeed() + (random.nextDouble() - 0.5) * 10));
                
                // Battery/Fuel depletion
                data.put("batteryLevel", Math.max(0, vehicle.getBatteryLevel() - random.nextInt(3)));
                data.put("fuelLevel", Math.max(0, vehicle.getFuelLevel() - random.nextInt(2)));
                
                // Health score fluctuation
                data.put("healthScore", Math.max(60, vehicle.getHealthScore() - random.nextInt(2)));
                
                // Mileage increment
                data.put("mileage", vehicle.getMileage() + random.nextInt(5));
                
                data.put("engineTemperature", 85.0 + random.nextDouble() * 15);
                data.put("tirePressure", 30.0 + random.nextDouble() * 4);
                data.put("status", "NORMAL");
                
                updateTelemetry(vehicle.getId(), data);
            }
        }
    }
    
    // Get fleet overview
    public Map<String, Object> getFleetOverview() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        int totalVehicles = vehicles.size();
        long availableCount = vehicles.stream()
            .filter(v -> v.getStatus().name().equals("AVAILABLE")).count();
        long inUseCount = vehicles.stream()
            .filter(v -> v.getStatus().name().equals("IN_USE")).count();
        long maintenanceCount = vehicles.stream()
            .filter(v -> v.getStatus().name().equals("MAINTENANCE")).count();
        
        double avgBattery = vehicles.stream()
            .mapToInt(Vehicle::getBatteryLevel).average().orElse(0);
        double avgHealth = vehicles.stream()
            .mapToInt(Vehicle::getHealthScore).average().orElse(0);
        
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalVehicles", totalVehicles);
        overview.put("available", availableCount);
        overview.put("inUse", inUseCount);
        overview.put("maintenance", maintenanceCount);
        overview.put("averageBattery", Math.round(avgBattery));
        overview.put("averageHealth", Math.round(avgHealth));
        
        return overview;
    }
}