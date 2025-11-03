package com.example.neurofleetbackkendD.controllers;





import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'DRIVER')")
public class DriverController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String username = authentication.getName();
        List<Booking> bookings = bookingService.getBookingsByDriverUsername(username);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bookings/status/{status}")
    public ResponseEntity<List<Booking>> getMyBookingsByStatus(
            Authentication authentication,
            @PathVariable String status) {
        String username = authentication.getName();
        List<Booking> allBookings = bookingService.getBookingsByDriverUsername(username);
        List<Booking> filteredBookings = allBookings.stream()
                .filter(b -> status.equals(b.getStatus()))
                .toList();
        return ResponseEntity.ok(filteredBookings);
    }

    @PutMapping("/bookings/{id}/start")
    public ResponseEntity<?> startTrip(@PathVariable Long id) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "IN_PROGRESS");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/bookings/{id}/complete")
    public ResponseEntity<?> completeTrip(@PathVariable Long id) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, "COMPLETED");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}