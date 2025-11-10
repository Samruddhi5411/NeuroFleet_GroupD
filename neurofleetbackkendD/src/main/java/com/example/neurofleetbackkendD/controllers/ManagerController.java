package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.MaintenanceService;
import com.example.neurofleetbackkendD.service.UserService;
import com.example.neurofleetbackkendD.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

    // ============ BOOKING APPROVAL SYSTEM ============
    
    @GetMapping("/bookings/pending-approval")
    public ResponseEntity<List<Booking>> getPendingApprovalBookings() {
        return ResponseEntity.ok(bookingService.getPendingApprovalBookings());
    }
    
    @PostMapping("/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> approvalData,
            Authentication auth) {
        try {
            String username = auth.getName();
            User manager = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            
            String notes = approvalData != null ? approvalData.get("notes") : "";
            
            Booking approved = bookingService.approveBooking(id, manager.getId(), notes);
            return ResponseEntity.ok(Map.of(
                "message", "Booking approved successfully! Customer can now pay.",
                "booking", approved
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/bookings/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> rejectionData,
            Authentication auth) {
        try {
            String username = auth.getName();
            User manager = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            
            String reason = rejectionData.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rejection reason required"));
            }
            
            Booking rejected = bookingService.rejectBooking(id, manager.getId(), reason);
            return ResponseEntity.ok(Map.of(
                "message", "Booking rejected",
                "booking", rejected
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============ MAINTENANCE MANAGEMENT (IN RUPEES) ============
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/maintenance/generate-predictive")
    public ResponseEntity<List<Maintenance>> generatePredictiveMaintenance() {
        List<Maintenance> predicted = maintenanceService.generatePredictiveMaintenance();
        return ResponseEntity.ok(predicted);
    }

    // ============ ANALYTICS ============
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalFleet", vehicleService.getAllVehicles().size());
        analytics.put("activeTrips", bookingService.getActiveTripsCount());
        analytics.put("pendingApprovals", bookingService.getPendingApprovalBookings().size());
        analytics.put("pendingMaintenance", maintenanceService.getPendingMaintenanceCount());
        analytics.put("totalRevenue", "₹" + String.format("%.2f", bookingService.getTotalRevenue()));
        return ResponseEntity.ok(analytics);
    }

    // ============ OTHER ENDPOINTS (Fleet, Bookings, etc.) ============
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
}