package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private DashboardService dashboardService;
    
    /**
     * Get Driver Dashboard Data
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDriverDashboard(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            Map<String, Object> dashboard = dashboardService.getDriverDashboard(driver.getId());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("❌ Error loading driver dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get Driver's Assigned Bookings
     */
    @GetMapping("/bookings")
    public ResponseEntity<?> getDriverBookings(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> bookings = bookingService.getDriverBookings(driver.getId());
            System.out.println("✅ Driver " + username + " has " + bookings.size() + " bookings");
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver bookings: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Driver Starts Trip
     */
    @PutMapping("/bookings/{id}/start-trip")
    public ResponseEntity<?> startTrip(@PathVariable Long id, 
                                       @RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            Booking booking = bookingService.startTrip(id, driver.getId());
            System.out.println("🚀 Trip started by driver: " + username);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error starting trip: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Driver Completes Trip
     */
    @PutMapping("/bookings/{id}/complete-trip")
    public ResponseEntity<?> completeTrip(@PathVariable Long id, 
                                          @RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            Booking booking = bookingService.completeTrip(id, driver.getId());
            System.out.println("✅ Trip completed by driver: " + username);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error completing trip: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get Driver's Active Booking
     */
//    @GetMapping("/bookings/active")
//    public ResponseEntity<?> getActiveBooking(@RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//
//            return bookingService.getDriverActiveBooking(driver.getId())
//                .<ResponseEntity<?>>map(ResponseEntity::ok)
//                .orElse(ResponseEntity.ok(Map.of("message", "No active booking")));
//                
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
    /**
     * Get Driver's Completed Bookings
     */
    @GetMapping("/bookings/completed")
    public ResponseEntity<?> getCompletedBookings(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> bookings = bookingService.getDriverCompletedBookings(driver.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}