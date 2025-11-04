package com.example.neurofleetbackkendD.controllers;





import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.UserService;
import com.example.neurofleetbackkendD.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('DRIVER')")
public class DriverController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private UserService userService;

    // ============ My Trips ============
    @GetMapping("/trips")
    public ResponseEntity<List<Booking>> getMyTrips(Authentication auth) {
        String username = auth.getName();
        List<Booking> trips = bookingService.getDriverBookings(username);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id, Authentication auth) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/trips/active")
    public ResponseEntity<List<Booking>> getActiveTrips(Authentication auth) {
        String username = auth.getName();
        List<Booking> trips = bookingService.getActiveDriverTrips(username);
        return ResponseEntity.ok(trips);
    }

    @PutMapping("/trips/{id}/start")
    public ResponseEntity<?> startTrip(@PathVariable Long id, Authentication auth) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "IN_PROGRESS");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/trips/{id}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long id, Authentication auth) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "COMPLETED");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ============ Vehicles ============
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getVehiclesByStatus(VehicleStatus.AVAILABLE));
    }

    @GetMapping("/vehicles/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============ Driver Stats ============
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDriverStats(Authentication auth) {
        String username = auth.getName();
        List<Booking> allTrips = bookingService.getDriverBookings(username);
        
        long completedTrips = allTrips.stream()
            .filter(t -> "COMPLETED".equals(t.getStatus().toString()))
            .count();
        
        long activeTrips = allTrips.stream()
            .filter(t -> "IN_PROGRESS".equals(t.getStatus().toString()))
            .count();
        
        double totalRevenue = allTrips.stream()
            .filter(t -> "COMPLETED".equals(t.getStatus().toString()))
            .mapToDouble(Booking::getTotalPrice)
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrips", allTrips.size());
        stats.put("completedTrips", completedTrips);
        stats.put("activeTrips", activeTrips);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }

    // ============ Profile ============
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        String username = auth.getName();
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Authentication auth) {
        try {
            String username = auth.getName();
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            
            User saved = userService.updateUser(user.getId(), user);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile/toggle-availability")
    public ResponseEntity<?> toggleAvailability(Authentication auth) {
        try {
            String username = auth.getName();
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setIsAvailable(!user.getIsAvailable());
            User updated = userService.updateUser(user.getId(), user);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}