package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private AuthService authService;
    
    
     //Get all available vehicles for customer
     
    @GetMapping("/vehicles")
    public ResponseEntity<?> getAvailableVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAvailableVehicles();
            System.out.println("✅ Found " + vehicles.size() + " available vehicles");
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("❌ Error fetching vehicles: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    


   //  Cancel booking
   
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, 
                                          @RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            Booking booking = bookingService.cancelBooking(id, customer.getId(), "Cancelled by customer");
            System.out.println("✅ Booking cancelled: " + id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.err.println("❌ Error cancelling booking: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    

     // Get booking by ID
   
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}