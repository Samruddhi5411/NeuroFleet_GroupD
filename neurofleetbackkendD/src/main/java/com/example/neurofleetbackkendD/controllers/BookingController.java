package com.example.neurofleetbackkendD.controllers;



import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Generate receipt/invoice for a booking
     */
    @GetMapping("/{id}/receipt")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getBookingReceipt(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Generate simple text receipt
            String receipt = generateReceiptText(booking);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            headers.setContentDispositionFormData("attachment", 
                "receipt_" + booking.getId() + ".txt");

            return ResponseEntity.ok()
                .headers(headers)
                .body(receipt);
                
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error generating receipt: " + e.getMessage());
        }
    }

    /**
     * Get booking details with full information
     */
    @GetMapping("/{id}/details")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getBookingDetails(@PathVariable Long id) {
        return bookingService.getBookingById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update booking status (complete trip, cancel, etc)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'DRIVER')")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    private String generateReceiptText(Booking booking) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        
        StringBuilder receipt = new StringBuilder();
        receipt.append("═══════════════════════════════════════\n");
        receipt.append("         NEUROFLEETX RECEIPT\n");
        receipt.append("═══════════════════════════════════════\n\n");
        
        receipt.append("Booking ID: #").append(booking.getId()).append("\n");
        receipt.append("Date: ").append(booking.getCreatedAt().format(formatter)).append("\n\n");
        
        receipt.append("CUSTOMER DETAILS\n");
        receipt.append("─────────────────────────────────────\n");
        receipt.append("Name: ").append(booking.getCustomer().getFullName()).append("\n");
        receipt.append("Email: ").append(booking.getCustomer().getEmail()).append("\n");
        receipt.append("Phone: ").append(booking.getCustomer().getPhone()).append("\n\n");
        
        receipt.append("VEHICLE DETAILS\n");
        receipt.append("─────────────────────────────────────\n");
        receipt.append("Model: ").append(booking.getVehicle().getModel()).append("\n");
        receipt.append("Number: ").append(booking.getVehicle().getVehicleNumber()).append("\n\n");
        
        receipt.append("TRIP DETAILS\n");
        receipt.append("─────────────────────────────────────\n");
        receipt.append("Pickup: ").append(booking.getPickupLocation()).append("\n");
        receipt.append("Dropoff: ").append(booking.getDropoffLocation()).append("\n");
        receipt.append("Start: ").append(booking.getStartTime().format(formatter)).append("\n");
        receipt.append("End: ").append(booking.getEndTime().format(formatter)).append("\n");
        
        if (booking.getDistanceKm() != null) {
            receipt.append("Distance: ").append(booking.getDistanceKm()).append(" km\n");
        }
        
        receipt.append("Status: ").append(booking.getStatus()).append("\n\n");
        
        receipt.append("PAYMENT SUMMARY\n");
        receipt.append("─────────────────────────────────────\n");
        receipt.append("Total Amount: $").append(String.format("%.2f", booking.getTotalPrice())).append("\n");
        receipt.append("Payment Status: PAID\n\n");
        
        receipt.append("═══════════════════════════════════════\n");
        receipt.append("     Thank you for using NeuroFleetX!\n");
        receipt.append("═══════════════════════════════════════\n");
        
        return receipt.toString();
    }
}