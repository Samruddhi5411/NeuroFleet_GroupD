package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.DashboardService;
import com.example.neurofleetbackkendD.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getManagerDashboard() {
        try {
            return ResponseEntity.ok(dashboardService.getManagerDashboard());
        } catch (Exception e) {
            System.err.println("❌ Error fetching manager dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    @GetMapping("/bookings/pending")
    public ResponseEntity<?> getPendingBookings() {
        try {
            System.out.println("📋 Manager accessing pending bookings...");
            List<Booking> bookings = bookingService.getPendingBookingsForManager();
            System.out.println("✅ Found " + bookings.size() + " pending bookings");
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        try {
            System.out.println("✅ Manager approving booking ID: " + id);
            Booking approved = bookingService.approveBooking(id);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{bookingId}/assign-driver")
    public ResponseEntity<?> assignDriver(
            @PathVariable Long bookingId,
            @RequestParam Long driverId) {
        try {
            System.out.println("🚗 Manager assigning driver " + driverId + " to booking " + bookingId);
            Booking booking = bookingService.assignDriverToBooking(bookingId, driverId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/drivers/available")
    public ResponseEntity<?> getAvailableDrivers() {
        try {
            System.out.println("👥 Manager fetching available drivers...");
            List<User> drivers = userRepository.findByRoleAndActive(UserRole.DRIVER, true);
            System.out.println("✅ Found " + drivers.size() + " drivers");
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}