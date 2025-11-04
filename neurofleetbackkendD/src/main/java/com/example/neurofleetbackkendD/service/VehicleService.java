package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    private final Random random = new Random();

    // ============ BASIC CRUD OPERATIONS ============
    
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        // Check if vehicle number already exists
        Optional<Vehicle> existing = vehicleRepository.findByVehicleNumber(vehicle.getVehicleNumber());
        if (existing.isPresent()) {
            throw new RuntimeException("Vehicle number already exists: " + vehicle.getVehicleNumber());
        }
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setManufacturer(vehicleDetails.getManufacturer());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setCapacity(vehicleDetails.getCapacity());
        vehicle.setIsElectric(vehicleDetails.getIsElectric());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setBatteryLevel(vehicleDetails.getBatteryLevel());
        vehicle.setFuelLevel(vehicleDetails.getFuelLevel());
        vehicle.setLatitude(vehicleDetails.getLatitude());
        vehicle.setLongitude(vehicleDetails.getLongitude());
        vehicle.setHealthScore(vehicleDetails.getHealthScore());
        vehicle.setMileage(vehicleDetails.getMileage());
        vehicle.setKmsSinceService(vehicleDetails.getKmsSinceService());
        
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        // Check if vehicle is in use
        if (vehicle.getStatus() == VehicleStatus.IN_USE) {
            throw new RuntimeException("Cannot delete vehicle that is currently in use");
        }
        
        vehicleRepository.deleteById(id);
    }

    // ============ FILTER & SEARCH OPERATIONS ============
    
    public List<Vehicle> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }

    public List<Vehicle> getVehiclesByType(VehicleType type) {
        return vehicleRepository.findByType(type);
    }

    public List<Vehicle> getElectricVehicles() {
        return vehicleRepository.findByIsElectric(true);
    }

    public Optional<Vehicle> getVehicleByNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }

    public List<Vehicle> getVehiclesNeedingMaintenance() {
        return vehicleRepository.findAll().stream()
                .filter(v -> v.getHealthScore() < 70 || v.getKmsSinceService() > 5000)
                .collect(Collectors.toList());
    }

    // ============ TELEMETRY & SIMULATION ============
    
    @Transactional
    public Vehicle updateTelemetry(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        
        // Simulate telemetry changes
        if (vehicle.getIsElectric()) {
            double currentBattery = vehicle.getBatteryLevel() != null ? vehicle.getBatteryLevel() : 100.0;
            vehicle.setBatteryLevel(Math.max(0, currentBattery - random.nextInt(5)));
        } else {
            double currentFuel = vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : 100.0;
            vehicle.setFuelLevel(Math.max(0, currentFuel - random.nextInt(5)));
        }
        
        // Update GPS location (simulate movement)
        double currentLat = vehicle.getLatitude() != null ? vehicle.getLatitude() : 19.0760;
        double currentLon = vehicle.getLongitude() != null ? vehicle.getLongitude() : 72.8777;
        vehicle.setLatitude(currentLat + (random.nextDouble() - 0.5) * 0.01);
        vehicle.setLongitude(currentLon + (random.nextDouble() - 0.5) * 0.01);
        
        // Update speed
        vehicle.setSpeed((double) random.nextInt(100));
        
        // Update health score
        double currentHealth = vehicle.getHealthScore() != null ? vehicle.getHealthScore() : 100.0;
        vehicle.setHealthScore(Math.max(60, currentHealth - random.nextInt(2)));
        
        // Update kms since service
        Integer currentKms = vehicle.getKmsSinceService() != null ? vehicle.getKmsSinceService() : 0;
        vehicle.setKmsSinceService(currentKms + random.nextInt(10));
        
        vehicle.setUpdatedAt(LocalDateTime.now());
        
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void updateAllVehicleTelemetry() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus() == VehicleStatus.IN_USE) {
                updateTelemetry(vehicle.getId());
            }
        }
    }

    // ============ ANALYTICS ============
    
    public long countByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status).size();
    }

    public long countElectricVehicles() {
        return vehicleRepository.findByIsElectric(true).size();
    }

    public double getAverageHealthScore() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        if (vehicles.isEmpty()) return 100.0;
        
        return vehicles.stream()
                .mapToDouble(v -> v.getHealthScore() != null ? v.getHealthScore() : 100.0)
                .average()
                .orElse(100.0);
    }
}