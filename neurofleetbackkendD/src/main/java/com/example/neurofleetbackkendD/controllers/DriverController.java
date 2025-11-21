package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.DashboardService;
import com.example.neurofleetbackkendD.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDriverDashboard(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            return ResponseEntity.ok(dashboardService.getDriverDashboard(driver.getId()));
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    @GetMapping("/dashboard/{driverId}")
    public ResponseEntity<?> getDriverDashboardById(@PathVariable Long driverId) {
        try {
            return ResponseEntity.ok(dashboardService.getDriverDashboard(driverId));
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    // Get driver profile
    @GetMapping("/profile")
    public ResponseEntity<?> getDriverProfile(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            System.out.println("✅ Fetching profile for driver: " + driver.getFullName());
            
            // Return driver profile without password
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", driver.getId());
            profile.put("username", driver.getUsername());
            profile.put("fullName", driver.getFullName());
            profile.put("email", driver.getEmail());
            profile.put("phoneNumber", driver.getPhoneNumber());
            profile.put("licenseNumber", driver.getLicenseNumber());
            profile.put("licenseExpiry", driver.getLicenseExpiry());
            profile.put("address", driver.getAddress());
            profile.put("profilePicture", driver.getProfilePicture());
            profile.put("totalTrips", driver.getTotalTrips());
            profile.put("totalEarnings", driver.getTotalEarnings());
            profile.put("rating", driver.getRating());
            profile.put("active", driver.getActive());
            profile.put("createdAt", driver.getCreatedAt());
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    //  Update driver profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateDriverProfile(
            @RequestParam String username,
            @RequestBody Map<String, Object> updates) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            // Update allowed fields
            if (updates.containsKey("fullName")) {
                driver.setFullName((String) updates.get("fullName"));
            }
            if (updates.containsKey("email")) {
                driver.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("phoneNumber")) {
                driver.setPhoneNumber((String) updates.get("phoneNumber"));
            }
            if (updates.containsKey("address")) {
                driver.setAddress((String) updates.get("address"));
            }
            if (updates.containsKey("licenseNumber")) {
                driver.setLicenseNumber((String) updates.get("licenseNumber"));
            }
            if (updates.containsKey("profilePicture")) {
                driver.setProfilePicture((String) updates.get("profilePicture"));
            }
            
            userRepository.save(driver);
            System.out.println("✅ Profile updated for driver: " + driver.getFullName());
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error updating driver profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    // Get driver's assigned bookings
    @GetMapping("/bookings")
    public ResponseEntity<?> getDriverBookings(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> bookings = bookingService.getDriverBookings(driver.getId());
            System.out.println("✅ Found " + bookings.size() + " bookings for driver: " + driver.getFullName());
            
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver bookings: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
 // Request early payout
    @PostMapping("/request-payout")
    public ResponseEntity<?> requestEarlyPayout(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            System.out.println("💰 Early payout requested by: " + driver.getFullName());
            
            return ResponseEntity.ok(Map.of(
                "message", "Payout request submitted successfully",
                "status", "PENDING",
                "estimatedProcessingTime", "24-48 hours",
                "amount", driver.getTotalEarnings()
            ));
        } catch (Exception e) {
            System.err.println("❌ Error requesting payout: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    //  Start trip
    @PutMapping("/bookings/{bookingId}/start-trip")
    public ResponseEntity<?> startTrip(@PathVariable Long bookingId, @RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            System.out.println("🚀 Driver " + driver.getFullName() + " starting trip for booking: " + bookingId);
            
            Booking booking = bookingService.startTrip(bookingId, driver.getId());
            
            System.out.println("✅ Trip started successfully. Status: " + booking.getStatus());
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error starting trip: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    //  Complete trip
    @PutMapping("/bookings/{bookingId}/complete-trip")
    public ResponseEntity<?> completeTrip(@PathVariable Long bookingId, @RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            System.out.println("✅ Driver " + driver.getFullName() + " completing trip for booking: " + bookingId);
            
            Booking booking = bookingService.completeTrip(bookingId, driver.getId());
            
            // Update driver's total trips and earnings
            driver.setTotalTrips(driver.getTotalTrips() + 1);
            driver.setTotalEarnings(driver.getTotalEarnings() + booking.getTotalPrice());
            userRepository.save(driver);
            
            System.out.println("✅ Trip completed successfully. Payment: $" + booking.getTotalPrice());
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error completing trip: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    // Get driver earnings summary
    @GetMapping("/earnings")
    public ResponseEntity<?> getDriverEarnings(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> completedBookings = bookingService.getDriverBookings(driver.getId());
            
            double totalEarnings = completedBookings.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            Map<String, Object> earnings = new HashMap<>();
            earnings.put("totalEarnings", totalEarnings);
            earnings.put("totalTrips", completedBookings.size());
            earnings.put("completedBookings", completedBookings);
            earnings.put("driverProfile", Map.of(
                "fullName", driver.getFullName(),
                "rating", driver.getRating(),
                "totalTrips", driver.getTotalTrips()
            ));
            
            return ResponseEntity.ok(earnings);
        } catch (Exception e) {
            System.err.println("❌ Error fetching earnings: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
    
    //  Update driver location (for live tracking)
    @PutMapping("/location")
    public ResponseEntity<?> updateDriverLocation(
            @RequestParam String username,
            @RequestBody Map<String, Double> location) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            Double latitude = location.get("latitude");
            Double longitude = location.get("longitude");
            
            // You can store this in a separate DriverLocation entity or update booking
            System.out.println("📍 Driver " + driver.getFullName() + " location: " + latitude + ", " + longitude);
            
            return ResponseEntity.ok(Map.of(
                "message", "Location updated",
                "latitude", latitude,
                "longitude", longitude
            ));
        } catch (Exception e) {
            System.err.println("❌ Error updating location: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
    }
}