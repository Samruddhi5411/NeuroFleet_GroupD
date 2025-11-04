package com.example.neurofleetbackkendD.controllers;



import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.MaintenanceService;
import com.example.neurofleetbackkendD.service.UserService;
import com.example.neurofleetbackkendD.service.VehicleService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('MANAGER', 'ADMIN')")
public class ManagerController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MaintenanceService maintenanceService;

    @Autowired
    private UserService userService;

    // ============ Fleet Management ============
    @GetMapping("/fleet/stats")
    public ResponseEntity<Map<String, Object>> getFleetStats() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        
        long availableCount = vehicles.stream()
            .filter(v -> "AVAILABLE".equals(v.getStatus().toString()))
            .count();
        
        long inUseCount = vehicles.stream()
            .filter(v -> "IN_USE".equals(v.getStatus().toString()))
            .count();
        
        long maintenanceCount = vehicles.stream()
            .filter(v -> "MAINTENANCE".equals(v.getStatus().toString()))
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFleet", vehicles.size());
        stats.put("available", availableCount);
        stats.put("inUse", inUseCount);
        stats.put("maintenance", maintenanceCount);
        stats.put("outOfService", vehicles.size() - availableCount - inUseCount - maintenanceCount);
        
        return ResponseEntity.ok(stats);
    }

    // ============ Vehicle Management ============
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/vehicles/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<?> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        try {
            Vehicle created = vehicleService.createVehicle(vehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @Valid @RequestBody Vehicle vehicle) {
        try {
            Vehicle updated = vehicleService.updateVehicle(id, vehicle);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/vehicles/{id}/telemetry")
    public ResponseEntity<?> updateVehicleTelemetry(@PathVariable Long id) {
        try {
            Vehicle updated = vehicleService.updateTelemetry(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/vehicles/{id}/status")
    public ResponseEntity<?> updateVehicleStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Vehicle vehicle = vehicleService.getVehicleById(id)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            vehicle.setStatus(VehicleStatus.valueOf(status));
            Vehicle updated = vehicleService.updateVehicle(id, vehicle);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ============ Booking Management ============
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ============ Maintenance Management ============
    @GetMapping("/maintenance")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @GetMapping("/maintenance/{id}")
    public ResponseEntity<?> getMaintenanceById(@PathVariable Long id) {
        return maintenanceService.getMaintenanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/maintenance/vehicle/{vehicleId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByVehicle(vehicleId));
    }

    @GetMapping("/maintenance/predictive")
    public ResponseEntity<List<Maintenance>> getPredictiveMaintenance() {
        return ResponseEntity.ok(maintenanceService.getPredictiveMaintenance());
    }

    @PostMapping("/maintenance")
    public ResponseEntity<?> createMaintenance(@Valid @RequestBody Maintenance maintenance) {
        try {
            Maintenance created = maintenanceService.createMaintenance(maintenance);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/maintenance/{id}")
    public ResponseEntity<?> updateMaintenance(@PathVariable Long id, @Valid @RequestBody Maintenance maintenance) {
        try {
            Maintenance updated = maintenanceService.updateMaintenance(id, maintenance);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/maintenance/generate-predictive")
    public ResponseEntity<List<Maintenance>> generatePredictiveMaintenance() {
        List<Maintenance> predicted = maintenanceService.generatePredictiveMaintenance();
        return ResponseEntity.ok(predicted);
    }

    // ============ Driver Management ============
    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getAllDrivers() {
        return ResponseEntity.ok(userService.getUsersByRole("DRIVER"));
    }

    @GetMapping("/drivers/available")
    public ResponseEntity<List<User>> getAvailableDrivers() {
        return ResponseEntity.ok(userService.getAvailableDrivers());
    }

    // ============ Analytics ============
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalFleet", vehicleService.getAllVehicles().size());
        analytics.put("activeTrips", bookingService.getActiveTripsCount());
        analytics.put("pendingMaintenance", maintenanceService.getPendingMaintenanceCount());
        analytics.put("availableDrivers", userService.getAvailableDrivers().size());
        return ResponseEntity.ok(analytics);
    }
}
