package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.VehicleTelemetry;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.repository.VehicleTelemetryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class VehicleTelemetryService {
	@Autowired
	private VehicleTelemetryRepository telemetryRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    
    private Random random = new Random();
    
    // Run every 10 seconds (reduced frequency to avoid deadlocks)
    @Scheduled(fixedRate = 10000)
    @Transactional(isolation = Isolation.READ_COMMITTED) // Fix deadlock
    public void simulateTelemetry() {
        try {
            List<Vehicle> inUseVehicles = vehicleRepository.findByStatus(VehicleStatus.IN_USE);
            
            // Process only 5 vehicles at a time to reduce lock contention
            int count = 0;
            for (Vehicle vehicle : inUseVehicles) {
                if (count++ >= 5) break; // Limit to 5 vehicles per cycle
                
                try {
                    updateVehicleTelemetry(vehicle);
                } catch (Exception e) {
                    // Log but don't fail entire batch
                    System.err.println("⚠️ Failed to update telemetry for vehicle " + 
                        vehicle.getId() + ": " + e.getMessage());
                }
            }
            
            if (count > 0) {
                System.out.println("✅ Updated telemetry for " + count + " vehicles");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Telemetry update error: " + e.getMessage());
        }
    }
    
    private void updateVehicleTelemetry(Vehicle vehicle) {
        // Simulate GPS movement
        if (vehicle.getLatitude() != null && vehicle.getLongitude() != null) {
            vehicle.setLatitude(vehicle.getLatitude() + (random.nextDouble() - 0.5) * 0.001);
            vehicle.setLongitude(vehicle.getLongitude() + (random.nextDouble() - 0.5) * 0.001);
        }
        
        // Simulate speed changes
        vehicle.setSpeed(20.0 + random.nextDouble() * 60.0);
        
        // Decrease battery/fuel slightly
        if (vehicle.getIsElectric() && vehicle.getBatteryLevel() != null && vehicle.getBatteryLevel() > 0) {
            vehicle.setBatteryLevel(Math.max(0, vehicle.getBatteryLevel() - random.nextInt(2)));
        } else if (vehicle.getFuelLevel() != null && vehicle.getFuelLevel() > 0) {
            vehicle.setFuelLevel(Math.max(0, vehicle.getFuelLevel() - random.nextInt(2)));
        }
        
        // Increase mileage
        if (vehicle.getMileage() != null) {
            vehicle.setMileage(vehicle.getMileage() + random.nextInt(5));
        }
        
        // Slight health degradation
        if (vehicle.getHealthScore() != null && random.nextInt(100) < 5) {
            vehicle.setHealthScore(Math.max(50, vehicle.getHealthScore() - 1));
        }
        
        vehicle.setLastUpdated(LocalDateTime.now());
        vehicleRepository.save(vehicle);
    }
    public VehicleTelemetry updateTelemetry(Long vehicleId, Map<String, Object> data) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        VehicleTelemetry telemetry = new VehicleTelemetry();
        telemetry.setVehicle(vehicle);
        telemetry.setTimestamp(LocalDateTime.now());
        
        // Extract data from map
        if (data.containsKey("latitude")) {
            telemetry.setLatitude(Double.parseDouble(data.get("latitude").toString()));
        }
        if (data.containsKey("longitude")) {
            telemetry.setLongitude(Double.parseDouble(data.get("longitude").toString()));
        }
        if (data.containsKey("speed")) {
            telemetry.setSpeed(Double.parseDouble(data.get("speed").toString()));
        }
        if (data.containsKey("fuelLevel")) {
            telemetry.setFuelLevel(Integer.parseInt(data.get("fuelLevel").toString()));
        }
        if (data.containsKey("batteryLevel")) {
            telemetry.setBatteryLevel(Integer.parseInt(data.get("batteryLevel").toString()));
        }
        if (data.containsKey("engineTemp")) {
            telemetry.setEngineTemp(Double.parseDouble(data.get("engineTemp").toString()));
        }
        if (data.containsKey("tirePressure")) {
            telemetry.setTirePressure(Double.parseDouble(data.get("tirePressure").toString()));
        }
        
        // Update vehicle's current location and status
        if (telemetry.getLatitude() != null) {
            vehicle.setLatitude(telemetry.getLatitude());
        }
        if (telemetry.getLongitude() != null) {
            vehicle.setLongitude(telemetry.getLongitude());
        }
        if (telemetry.getSpeed() != null) {
            vehicle.setSpeed(telemetry.getSpeed());
        }
        if (telemetry.getFuelLevel() != null) {
            vehicle.setFuelLevel(telemetry.getFuelLevel());
        }
        if (telemetry.getBatteryLevel() != null) {
            vehicle.setBatteryLevel(telemetry.getBatteryLevel());
        }
        
        vehicle.setLastUpdated(LocalDateTime.now());
        vehicleRepository.save(vehicle);
        
        return telemetryRepository.save(telemetry);
    }

    /**
     * Get latest telemetry for a vehicle
     */
    public VehicleTelemetry getLatestTelemetry(Long vehicleId) {
        return telemetryRepository.findTopByVehicleIdOrderByTimestampDesc(vehicleId);
    }

    /**
     * Get telemetry history for a vehicle within date range
     */
    public List<VehicleTelemetry> getTelemetryHistory(Long vehicleId, 
                                                      LocalDateTime startDate, 
                                                      LocalDateTime endDate) {
        return telemetryRepository.findByVehicleIdAndTimestampBetween(
            vehicleId, startDate, endDate);
    }

    /**
     * Get fleet overview with telemetry summary
     */
    public Map<String, Object> getFleetOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        
        // Count by status
        Map<VehicleStatus, Long> statusCount = new HashMap<>();
        for (VehicleStatus status : VehicleStatus.values()) {
            long count = allVehicles.stream()
                .filter(v -> v.getStatus() == status)
                .count();
            statusCount.put(status, count);
        }
        
        // Average metrics
        double avgSpeed = allVehicles.stream()
            .filter(v -> v.getSpeed() != null)
            .mapToDouble(Vehicle::getSpeed)
            .average()
            .orElse(0.0);
        
        double avgFuel = allVehicles.stream()
            .filter(v -> v.getFuelLevel() != null)
            .mapToDouble(Vehicle::getFuelLevel)
            .average()
            .orElse(0.0);
        
        double avgBattery = allVehicles.stream()
            .filter(v -> v.getBatteryLevel() != null)
            .mapToDouble(Vehicle::getBatteryLevel)
            .average()
            .orElse(0.0);
        
        double avgHealth = allVehicles.stream()
            .filter(v -> v.getHealthScore() != null)
            .mapToDouble(Vehicle::getHealthScore)
            .average()
            .orElse(100.0);
        
        // Low fuel/battery alerts
        long lowFuelVehicles = allVehicles.stream()
            .filter(v -> v.getFuelLevel() != null && v.getFuelLevel() < 20)
            .count();
        
        long lowBatteryVehicles = allVehicles.stream()
            .filter(v -> v.getBatteryLevel() != null && v.getBatteryLevel() < 20)
            .count();
        
        overview.put("totalVehicles", allVehicles.size());
        overview.put("statusBreakdown", statusCount);
        overview.put("averageSpeed", Math.round(avgSpeed * 100.0) / 100.0);
        overview.put("averageFuelLevel", Math.round(avgFuel * 100.0) / 100.0);
        overview.put("averageBatteryLevel", Math.round(avgBattery * 100.0) / 100.0);
        overview.put("averageHealthScore", Math.round(avgHealth * 100.0) / 100.0);
        overview.put("lowFuelAlerts", lowFuelVehicles);
        overview.put("lowBatteryAlerts", lowBatteryVehicles);
        
        return overview;
    }
}