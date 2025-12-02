//package com.example.neurofleetbackkendD.controllers;
//
//import com.example.neurofleetbackkendD.model.Booking;
//import com.example.neurofleetbackkendD.model.User;
//import com.example.neurofleetbackkendD.service.AuthService;
//import com.example.neurofleetbackkendD.service.BookingService;
//import com.example.neurofleetbackkendD.service.DashboardService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/driver")
//@CrossOrigin(origins = "http://localhost:3000")
//public class DriverController {
//    
//    @Autowired
//    private BookingService bookingService;
//    
//    @Autowired
//    private AuthService authService;
//    
//    @Autowired
//    private DashboardService dashboardService;
//    
//
//     // Get Driver Dashboard Data
//  
//    @GetMapping("/dashboard")
//    public ResponseEntity<?> getDriverDashboard(@RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            Map<String, Object> dashboard = dashboardService.getDriverDashboard(driver.getId());
//            return ResponseEntity.ok(dashboard);
//        } catch (Exception e) {
//            System.err.println("❌ Error loading driver dashboard: " + e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//  
//     // Get Driver's Assigned Bookings
//     
//    @GetMapping("/bookings")
//    public ResponseEntity<?> getDriverBookings(@RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            List<Booking> bookings = bookingService.getDriverBookings(driver.getId());
//            System.out.println("✅ Driver " + username + " has " + bookings.size() + " bookings");
//            return ResponseEntity.ok(bookings);
//        } catch (Exception e) {
//            System.err.println("❌ Error fetching driver bookings: " + e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    
//     // Driver Starts Trip
//     
//    @PutMapping("/bookings/{id}/start-trip")
//    public ResponseEntity<?> startTrip(@PathVariable Long id, 
//                                       @RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            Booking booking = bookingService.startTrip(id, driver.getId());
//            System.out.println("🚀 Trip started by driver: " + username);
//            return ResponseEntity.ok(booking);
//        } catch (Exception e) {
//            System.err.println("❌ Error starting trip: " + e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    
//     // Driver Completes Trip
//     
//    @PutMapping("/bookings/{id}/complete-trip")
//    public ResponseEntity<?> completeTrip(@PathVariable Long id, 
//                                          @RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            Booking booking = bookingService.completeTrip(id, driver.getId());
//            System.out.println("✅ Trip completed by driver: " + username);
//            return ResponseEntity.ok(booking);
//        } catch (Exception e) {
//            System.err.println("❌ Error completing trip: " + e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//   
//
//     // Get Driver's Completed Bookings
//
//    @GetMapping("/bookings/completed")
//    public ResponseEntity<?> getCompletedBookings(@RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            List<Booking> bookings = bookingService.getDriverCompletedBookings(driver.getId());
//            return ResponseEntity.ok(bookings);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//}

package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
    
    // ✅ NEW: Get Driver's Assigned City
    @GetMapping("/location")
    public ResponseEntity<?> getDriverLocation(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            String city = driver.getAssignedCity();
            
            // City coordinates mapping
            Map<String, Map<String, Double>> cityCoordinates = new HashMap<>();
            cityCoordinates.put("Mumbai", Map.of("lat", 19.0760, "lon", 72.8777));
            cityCoordinates.put("Delhi", Map.of("lat", 28.7041, "lon", 77.1025));
            cityCoordinates.put("Bangalore", Map.of("lat", 12.9716, "lon", 77.5946));
            cityCoordinates.put("Hyderabad", Map.of("lat", 17.3850, "lon", 78.4867));
            cityCoordinates.put("Chennai", Map.of("lat", 13.0827, "lon", 80.2707));
            cityCoordinates.put("Pune", Map.of("lat", 18.5204, "lon", 73.8567));
            cityCoordinates.put("Noida", Map.of("lat", 28.5355, "lon", 77.3910));
            cityCoordinates.put("Gurgaon", Map.of("lat", 28.4595, "lon", 77.0266));
            
            Map<String, Double> coords = cityCoordinates.getOrDefault(city, Map.of("lat", 19.0760, "lon", 72.8777));
            
            Map<String, Object> response = new HashMap<>();
            response.put("city", city);
            response.put("latitude", coords.get("lat"));
            response.put("longitude", coords.get("lon"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver location: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get Driver Dashboard Data
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
  
    // Get Driver's Assigned Bookings
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
    
    // Driver Starts Trip
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
    
    // Driver Completes Trip
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

    // Get Driver's Completed Bookings
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
    @PostMapping("/admin/assign-cities")
    public ResponseEntity<?> assignCitiesToExistingDrivers() {
        try {
            List<User> drivers = authService.getUsersByRole(UserRole.DRIVER);
            
            String[] cities = {
                "Mumbai", "Delhi", "Bangalore", "Hyderabad",
                "Chennai", "Pune", "Noida", "Gurgaon"
            };
            
            int updated = 0;
            for (User driver : drivers) {
                if (driver.getAssignedCity() == null || driver.getAssignedCity().isEmpty()) {
                    int cityIndex = (int) ((driver.getId() - 1) % cities.length);
                    driver.setAssignedCity(cities[cityIndex]);
                    authService.updateUser(driver.getId(), driver);
                    updated++;
                    System.out.println("✅ Updated driver " + driver.getFullName() + " → " + cities[cityIndex]);
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Cities assigned to existing drivers",
                "driversUpdated", updated
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}