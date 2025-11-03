package com.example.neurofleetbackkendD.controllers;



import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.MaintenanceService;
import com.example.neurofleetbackkendD.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
public class ManagerController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MaintenanceService maintenanceService;

    // ============ Vehicle Operations ============
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/vehicles/status/{status}")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(vehicleService.getVehiclesByStatus(status));
    }

    @GetMapping("/vehicles/maintenance-needed")
    public ResponseEntity<List<Vehicle>> getVehiclesNeedingMaintenance() {
        return ResponseEntity.ok(vehicleService.getVehiclesNeedingMaintenance());
    }

    @GetMapping("/vehicles/low-energy")
    public ResponseEntity<List<Vehicle>> getLowEnergyVehicles() {
        return ResponseEntity.ok(vehicleService.getLowEnergyVehicles());
    }

    @PutMapping("/vehicles/{id}/status")
    public ResponseEntity<?> updateVehicleStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Vehicle updated = vehicleService.updateVehicleStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // ============ Booking Operations ============
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    // ============ Maintenance Operations ============
    @GetMapping("/maintenance")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @GetMapping("/maintenance/vehicle/{vehicleId}")
    public ResponseEntity<List<Maintenance>> getMaintenanceByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByVehicleId(vehicleId));
    }

    @GetMapping("/maintenance/predictive")
    public ResponseEntity<List<Maintenance>> getPredictiveMaintenance() {
        return ResponseEntity.ok(maintenanceService.getPredictiveMaintenance());
    }
}