package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private DashboardService dashboardService;
    
    
    @GetMapping("/test")
    public ResponseEntity<?> testManagerAccess() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🧪 Manager Test Endpoint - Auth: " + auth);
        return ResponseEntity.ok(Map.of(
            "message", "Manager endpoint accessible",
            "user", auth != null ? auth.getName() : "No auth",
            "authorities", auth != null ? auth.getAuthorities().toString() : "No authorities"
        ));
    }
    @GetMapping("/dashboard")
    public ResponseEntity<?> getManagerDashboard() {
        try {
            System.out.println("📊 Manager accessing dashboard...");
            Map<String, Object> dashboard = dashboardService.getManagerDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("❌ Error loading manager dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    @GetMapping("/bookings/pending")
    public ResponseEntity<?> getPendingBookings() {
        try {
            System.out.println("📋 Manager requesting pending bookings...");
            List<Booking> bookings = bookingService.getPendingBookingsForManager();
            System.out.println("✅ Found " + bookings.size() + " pending bookings");
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("❌ Error fetching pending bookings: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        try {
            System.out.println("✅ Manager approving booking: " + id);
            Booking approved = bookingService.approveBooking(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            System.err.println("❌ Error approving booking: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{bookingId}/assign-driver")
    public ResponseEntity<?> assignDriver(@PathVariable Long bookingId,
                                          @RequestParam Long driverId) {
        try {
            System.out.println("👤 Manager assigning driver " + driverId + " to booking " + bookingId);
            Booking assigned = bookingService.assignDriverToBooking(bookingId, driverId);
            return ResponseEntity.ok(assigned);
        } catch (Exception e) {
            System.err.println("❌ Error assigning driver: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/drivers/available")
    public ResponseEntity<?> getAvailableDrivers() {
        try {
            System.out.println("👥 Fetching available drivers...");
            List<User> drivers = authService.getAvailableDrivers();
            System.out.println("✅ Found " + drivers.size() + " active drivers");
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            System.err.println("❌ Error fetching drivers: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}