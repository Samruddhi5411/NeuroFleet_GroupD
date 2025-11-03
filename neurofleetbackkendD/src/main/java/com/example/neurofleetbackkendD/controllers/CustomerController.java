package com.example.neurofleetbackkendD.controllers;


import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.service.BookingService;
import com.example.neurofleetbackkendD.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'CUSTOMER')")
public class CustomerController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private BookingService bookingService;

    // Vehicle Browsing 
    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

    @GetMapping("/vehicles/type/{type}")
    public ResponseEntity<List<Vehicle>> getVehiclesByType(@PathVariable String type) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByType(type).stream()
                .filter(v -> "AVAILABLE".equals(v.getStatus()))
                .toList();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/vehicles/recommended")
    public ResponseEntity<List<Vehicle>> getRecommendedVehicles(Authentication authentication) {
        String username = authentication.getName();
        List<Vehicle> recommended = bookingService.getRecommendedVehicles(username);
        return ResponseEntity.ok(recommended);
    }

    // Booking Operations 
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestParam String username) {
        List<Booking> bookings = bookingService.getBookingsByCustomerUsername(username);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@Valid @RequestBody Booking booking) {
        try {
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "CANCELLED");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}