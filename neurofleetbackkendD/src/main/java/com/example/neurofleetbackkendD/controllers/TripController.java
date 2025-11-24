package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Trip;
import com.example.neurofleetbackkendD.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {
    
    @Autowired
    private TripService tripService;
    
    /**
     * Get all trips (Admin)
     */
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {
        try {
            List<Trip> trips = tripService.getAllTrips();
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("❌ Error fetching trips: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get trip by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        try {
            // Would need to implement findById in service
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get trips by driver
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Trip>> getTripsByDriver(@PathVariable Long driverId) {
        try {
            List<Trip> trips = tripService.getTripsByDriver(driverId);
            System.out.println("✅ Retrieved " + trips.size() + " trips for driver: " + driverId);
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get trips by customer
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Trip>> getTripsByCustomer(@PathVariable Long customerId) {
        try {
            List<Trip> trips = tripService.getTripsByCustomer(customerId);
            System.out.println("✅ Retrieved " + trips.size() + " trips for customer: " + customerId);
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get trips by vehicle
     */
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Trip>> getTripsByVehicle(@PathVariable Long vehicleId) {
        try {
            List<Trip> trips = tripService.getTripsByVehicle(vehicleId);
            System.out.println("✅ Retrieved " + trips.size() + " trips for vehicle: " + vehicleId);
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get active trips
     */
    @GetMapping("/active")
    public ResponseEntity<List<Trip>> getActiveTrips() {
        try {
            List<Trip> trips = tripService.getActiveTrips();
            System.out.println("✅ Retrieved " + trips.size() + " active trips");
            return ResponseEntity.ok(trips);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get driver trip statistics
     */
    @GetMapping("/driver/{driverId}/stats")
    public ResponseEntity<?> getDriverTripStats(@PathVariable Long driverId) {
        try {
            Map<String, Object> stats = tripService.getDriverTripStats(driverId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get vehicle trip statistics
     */
    @GetMapping("/vehicle/{vehicleId}/stats")
    public ResponseEntity<?> getVehicleTripStats(@PathVariable Long vehicleId) {
        try {
            Map<String, Object> stats = tripService.getVehicleTripStats(vehicleId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Create a trip (when driver starts journey)
     * Note: This is typically called internally by BookingService.startTrip()
     */
    @PostMapping("/create")
    public ResponseEntity<?> createTrip(@RequestBody Map<String, Object> request) {
        try {
            Long bookingId = Long.parseLong(request.get("bookingId").toString());
            Trip trip = tripService.createTrip(bookingId);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            System.err.println("❌ Error creating trip: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Complete a trip
     * Note: This is typically called internally by BookingService.completeTrip()
     */
    @PutMapping("/{tripId}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long tripId, 
                                          @RequestBody Map<String, Object> tripData) {
        try {
            Trip trip = tripService.completeTrip(tripId, tripData);
            return ResponseEntity.ok(trip);
        } catch (Exception e) {
            System.err.println("❌ Error completing trip: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}