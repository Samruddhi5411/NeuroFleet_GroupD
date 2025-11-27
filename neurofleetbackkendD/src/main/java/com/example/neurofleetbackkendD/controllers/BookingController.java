package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.PaymentStatus;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private BookingRepository  bookingRepository;
   
    

    
    // Customer creates booking
    @PostMapping("/customer/bookings")
    public ResponseEntity<?> createBooking(@RequestParam String username, 
                                          @RequestBody Map<String, Object> request) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            Booking booking = new Booking();
            booking.setCustomer(customer);
            
            // Set vehicle
            Long vehicleId = Long.parseLong(request.get("vehicleId").toString());
            Vehicle vehicle = vehicleService.getVehicleById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            booking.setVehicle(vehicle);
            
            // Set locations
            booking.setPickupLocation((String) request.get("pickupLocation"));
            booking.setDropoffLocation((String) request.get("dropoffLocation"));
            booking.setPickupLatitude((Double) request.get("pickupLatitude"));
            booking.setPickupLongitude((Double) request.get("pickupLongitude"));
            booking.setDropoffLatitude((Double) request.get("dropoffLatitude"));
            booking.setDropoffLongitude((Double) request.get("dropoffLongitude"));
            
            // Set start time
            String startTimeStr = (String) request.get("startTime");
            if (startTimeStr != null) {
                booking.setStartTime(java.time.LocalDateTime.parse(startTimeStr));
            }
            
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("❌ Error creating booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get customer bookings
    @GetMapping("/customer/bookings")
    public ResponseEntity<?> getCustomerBookings(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            List<Booking> bookings = bookingService.getCustomerBookings(customer.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
  
    
   
 // Get all vehicles for manager
    @GetMapping("/manager/vehicles")
    public ResponseEntity<?> getManagerVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
   

    
    // Get driver's active booking
    @GetMapping("/driver/bookings/active")
    public ResponseEntity<?> getDriverActiveBooking(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

            return bookingService.getDriverActiveBooking(driver.getId())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(Map.of("message", "No active booking")));
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/customer/bookings/{id}/pay")
    public ResponseEntity<?> processPayment(@PathVariable Long id,
                                           @RequestBody Map<String, String> paymentData) {
        try {
            String paymentMethod = paymentData.get("paymentMethod");
            Booking paid = bookingService.processCustomerPayment(id, paymentMethod);
            return ResponseEntity.ok(paid);
        } catch (Exception e) {
            System.err.println("❌ Error processing payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    

  
   
    // Get all bookings
    @GetMapping("/admin/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    // Get booking by ID
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}