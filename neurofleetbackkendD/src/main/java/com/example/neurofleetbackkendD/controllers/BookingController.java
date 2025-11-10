package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Get all bookings (Manager + Admin only)
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Create booking (Customer)
    @PostMapping
    @PreAuthorize("hasAnyAuthority('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking saved = bookingService.createBooking(booking);
        return ResponseEntity.ok(saved);
    }

    // Customer / Driver / Manager View Booking
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{username}")
    @PreAuthorize("hasAnyAuthority('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable String username) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(username));
    }

    // ✅ Manager Approve Booking
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'ADMIN')")
    public ResponseEntity<String> approveBooking(
            @PathVariable Long id,
            @RequestParam(required = false) Long managerId,
            @RequestParam(required = false) String notes
    ) {
        bookingService.approveBooking(id, managerId, notes);
        return ResponseEntity.ok("✅ Booking Approved Successfully");
    }

    // ❌ Manager Reject Booking
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'ADMIN')")
    public ResponseEntity<String> rejectBooking(
            @PathVariable Long id,
            @RequestParam(required = false) Long managerId,
            @RequestParam(required = false) String reason
    ) {
        bookingService.rejectBooking(id, managerId, reason);
        return ResponseEntity.ok("❌ Booking Rejected");
    }

    // Delete (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}
