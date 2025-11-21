package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    /**
     * Get all vehicles
     */
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    /**
     * Get vehicle by ID
     */
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }
    
    /**
     * Get vehicles by status
     */
    public List<Vehicle> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }
    
    /**
     * Create new vehicle
     */
    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Get available vehicles only
     */
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }
    
    /**
     * Update vehicle
     */
    public Vehicle updateVehicle(Long id, Vehicle updates) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (updates.getManufacturer() != null) {
            vehicle.setManufacturer(updates.getManufacturer());
        }
        if (updates.getModel() != null) {
            vehicle.setModel(updates.getModel());
        }
        if (updates.getType() != null) {
            vehicle.setType(updates.getType());
        }
        if (updates.getCapacity() != null) {
            vehicle.setCapacity(updates.getCapacity());
        }
        if (updates.getStatus() != null) {
            vehicle.setStatus(updates.getStatus());
        }
        if (updates.getHealthScore() != null) {
            vehicle.setHealthScore(updates.getHealthScore());
        }
        
        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Delete vehicle
     */
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
    
    /**
     * Get vehicles count by status
     */
    public Map<String, Long> getVehicleCountsByStatus() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        
        Map<String, Long> counts = new HashMap<>();
        counts.put("AVAILABLE", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
        counts.put("IN_USE", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
        counts.put("MAINTENANCE", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count());
        counts.put("OUT_OF_SERVICE", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.OUT_OF_SERVICE).count());
        
        return counts;
    }
    /**
     * Get active vehicle locations (for map)
     */
    public List<Map<String, Object>> getActiveVehicleLocations() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> locations = new ArrayList<>();
        
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getLatitude() != null && vehicle.getLongitude() != null) {
                Map<String, Object> location = new HashMap<>();
                location.put("id", vehicle.getId());
                location.put("vehicleNumber", vehicle.getVehicleNumber());
                location.put("model", vehicle.getModel());
                location.put("type", vehicle.getType().name());
                location.put("status", vehicle.getStatus().name());
                location.put("latitude", vehicle.getLatitude());
                location.put("longitude", vehicle.getLongitude());
                location.put("speed", vehicle.getSpeed());
                location.put("healthScore", vehicle.getHealthScore());
                location.put("fuelLevel", vehicle.getFuelLevel());
                location.put("batteryLevel", vehicle.getBatteryLevel());
                
                locations.add(location);
            }
        }
        
        return locations;
    }
    
    /**
     * Check vehicle availability for specific dates
     */
    public boolean checkAvailability(Long vehicleId, String startTime, String endTime) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        // Check if vehicle is available
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            return false;
        }
        
        // Parse dates
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime requestStart = LocalDateTime.parse(startTime, formatter);
        LocalDateTime requestEnd = LocalDateTime.parse(endTime, formatter);
        
        // Check for overlapping bookings
        List<Booking> vehicleBookings = bookingRepository.findByVehicleId(vehicleId);
        
        for (Booking booking : vehicleBookings) {
            // Skip cancelled or completed bookings
            if (booking.getStatus() == BookingStatus.CANCELLED || 
                booking.getStatus() == BookingStatus.COMPLETED) {
                continue;
            }
            
            LocalDateTime bookingStart = booking.getStartTime();
            LocalDateTime bookingEnd = booking.getEndTime();
            
            // Check for overlap
            if (!(requestEnd.isBefore(bookingStart) || requestStart.isAfter(bookingEnd))) {
                return false; // Overlap found
            }
        }
        
        return true; // Available
    }
    
    /**
     * Update vehicle telemetry
     */
    public Vehicle updateTelemetry(Long id, Map<String, Object> telemetryData) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (telemetryData.containsKey("latitude")) {
            vehicle.setLatitude((Double) telemetryData.get("latitude"));
        }
        if (telemetryData.containsKey("longitude")) {
            vehicle.setLongitude((Double) telemetryData.get("longitude"));
        }
        if (telemetryData.containsKey("speed")) {
            vehicle.setSpeed(((Number) telemetryData.get("speed")).doubleValue());
        }
        if (telemetryData.containsKey("fuelLevel")) {
            vehicle.setFuelLevel((Integer) telemetryData.get("fuelLevel"));
        }
        if (telemetryData.containsKey("batteryLevel")) {
            vehicle.setBatteryLevel((Integer) telemetryData.get("batteryLevel"));
        }
        if (telemetryData.containsKey("healthScore")) {
            vehicle.setHealthScore((Integer) telemetryData.get("healthScore"));
        }
        
        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }
    
    /**
     * Initialize GPS coordinates for all vehicles
     */
    public void initializeGPS() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        Random random = new Random();
        
        // Base coordinates (Mumbai, India)
        double baseLat = 19.0760;
        double baseLon = 72.8777;
        
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getLatitude() == null || vehicle.getLongitude() == null) {
                // Random location within 50km radius
                vehicle.setLatitude(baseLat + (random.nextDouble() - 0.5) * 0.5);
                vehicle.setLongitude(baseLon + (random.nextDouble() - 0.5) * 0.5);
                vehicle.setLastUpdated(LocalDateTime.now());
                vehicleRepository.save(vehicle);
            }
        }
        
        System.out.println("✅ GPS initialized for " + vehicles.size() + " vehicles");
    }
}