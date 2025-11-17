package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.BookingService;
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
    
    // Customer creates booking
    @PostMapping("/customer/bookings")
    public ResponseEntity<?> createBooking(@RequestParam String username, 
                                          @RequestBody Booking booking) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            booking.setCustomer(customer);
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Manager gets pending bookings
    @GetMapping("/manager/bookings/pending")
    public ResponseEntity<List<Booking>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookingsForManager());
    }
    
    // Manager approves and assigns driver
    @PostMapping("/manager/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id,
                                           @RequestBody Map<String, Object> request) {
        try {
            Long managerId = Long.parseLong(request.get("managerId").toString());
            Long driverId = Long.parseLong(request.get("driverId").toString());
            String notes = (String) request.get("notes");
            
            Booking approved = bookingService.managerApproveAndAssignDriver(
                id, managerId, driverId, notes);
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Driver accepts booking
    @PostMapping("/driver/bookings/{id}/accept")
    public ResponseEntity<?> driverAcceptBooking(@PathVariable Long id,
                                                 @RequestParam Long driverId) {
        try {
            Booking accepted = bookingService.driverAcceptBooking(id, driverId);
            return ResponseEntity.ok(accepted);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Driver rejects booking
    @PostMapping("/driver/bookings/{id}/reject")
    public ResponseEntity<?> driverRejectBooking(@PathVariable Long id,
                                                 @RequestParam Long driverId,
                                                 @RequestParam String reason) {
        try {
            Booking rejected = bookingService.driverRejectBooking(id, driverId, reason);
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Customer makes payment
    @PostMapping("/customer/bookings/{id}/payment")
    public ResponseEntity<?> processPayment(@PathVariable Long id,
                                           @RequestBody Map<String, String> payment) {
        try {
            String paymentMethod = payment.get("paymentMethod");
            Booking paid = bookingService.processPayment(id, paymentMethod);
            return ResponseEntity.ok(paid);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Driver starts trip
    @PostMapping("/driver/bookings/{id}/start")
    public ResponseEntity<?> startTrip(@PathVariable Long id,
                                      @RequestParam Long driverId) {
        try {
            Booking started = bookingService.startTrip(id, driverId);
            return ResponseEntity.ok(started);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Driver completes trip
    @PostMapping("/driver/bookings/{id}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long id,
                                         @RequestParam Long driverId) {
        try {
            Booking completed = bookingService.completeTrip(id, driverId);
            return ResponseEntity.ok(completed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Customer cancels booking
    @PostMapping("/customer/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id,
                                          @RequestParam String username,
                                          @RequestBody Map<String, String> request) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            String reason = request.get("reason");
            Booking cancelled = bookingService.cancelBooking(id, customer.getId(), reason);
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
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
    
    // Get driver bookings
    @GetMapping("/driver/bookings")
    public ResponseEntity<?> getDriverBookings(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> bookings = bookingService.getDriverBookings(driver.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get driver active booking
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

    
    // Get booking by ID
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Get all bookings (admin)
    @GetMapping("/admin/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    // Get bookings by vehicle
    @GetMapping("/admin/vehicles/{vehicleId}/bookings")
    public ResponseEntity<List<Booking>> getVehicleBookings(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(bookingService.getBookingsByVehicle(vehicleId));
    }
}
