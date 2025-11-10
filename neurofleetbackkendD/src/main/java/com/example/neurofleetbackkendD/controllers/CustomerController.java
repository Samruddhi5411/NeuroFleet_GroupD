package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.PaymentMethod;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.UserService;
import com.example.neurofleetbackkendD.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('CUSTOMER')")
public class CustomerController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private UserService userService;

    // ============ MY BOOKINGS ============
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication auth) {
        String username = auth.getName();
        List<Booking> bookings = bookingService.getCustomerBookings(username);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id, Authentication auth) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking, Authentication auth) {
        try {
            String username = auth.getName();
            User customer = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            booking.setCustomer(customer);
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Booking created successfully! Waiting for manager approval.",
                "booking", created
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ============ PAYMENT SYSTEM ============
    @PostMapping("/bookings/{id}/pay")
    public ResponseEntity<?> processPayment(
            @PathVariable Long id,
            @RequestBody Map<String, String> paymentData,
            Authentication auth) {
        try {
            String paymentMethodStr = paymentData.get("paymentMethod");
            PaymentMethod paymentMethod = PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
            
            Booking updated = bookingService.processPayment(id, paymentMethod);
            return ResponseEntity.ok(Map.of(
                "message", "Payment successful! Booking confirmed.",
                "booking", updated,
                "transactionId", updated.getPaymentTransactionId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============ VEHICLE TRACKING ============
    @GetMapping("/bookings/{id}/track")
    public ResponseEntity<?> trackVehicle(@PathVariable Long id, Authentication auth) {
        try {
            Booking booking = bookingService.getBookingById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            return ResponseEntity.ok(Map.of(
                "currentLatitude", booking.getCurrentLatitude() != null ? booking.getCurrentLatitude() : 0.0,
                "currentLongitude", booking.getCurrentLongitude() != null ? booking.getCurrentLongitude() : 0.0,
                "distanceFromCustomer", booking.getDistanceFromCustomer() != null ? booking.getDistanceFromCustomer() : 0.0,
                "vehicleNumber", booking.getVehicle() != null ? booking.getVehicle().getVehicleNumber() : "N/A",
                "status", booking.getStatus().toString()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication auth) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "CANCELLED");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============ AVAILABLE VEHICLES (Only show truly AVAILABLE) ============
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

    // ============ PROFILE MANAGEMENT ============
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        String username = auth.getName();
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody User updatedUser, Authentication auth) {
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}