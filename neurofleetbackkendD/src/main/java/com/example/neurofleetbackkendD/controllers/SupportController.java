package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.SupportTicket;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.TicketStatus;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.SupportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {
    
    @Autowired
    private SupportService supportService;
    
    @Autowired
    private AuthService authService;
    
    // ========== CUSTOMER ENDPOINTS ==========
    
    /**
     * Get customer's support tickets
     * GET /api/customer/support/tickets?username=customer1
     */
    @GetMapping("/api/customer/support/tickets")
    public ResponseEntity<?> getCustomerTickets(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            List<SupportTicket> tickets = supportService.getCustomerTickets(customer.getId());
            System.out.println("✅ Found " + tickets.size() + " tickets for " + customer.getFullName());
            
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            System.err.println("❌ Error fetching tickets: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Create support ticket
     * POST /api/customer/support/tickets?username=customer1
     * Body: { "subject": "Issue", "description": "...", "category": "GENERAL" }
     */
    @PostMapping("/api/customer/support/tickets")
    public ResponseEntity<?> createTicket(
            @RequestParam String username,
            @RequestBody SupportTicket ticket) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            ticket.setCustomer(customer);
            SupportTicket created = supportService.createTicket(ticket);
            
            System.out.println("✅ Ticket created: #" + created.getId() + " - " + created.getSubject());
            
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("❌ Error creating ticket: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get single ticket details
     * GET /api/support/tickets/1
     */
    @GetMapping("/api/support/tickets/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            SupportTicket ticket = supportService.getTicketById(id);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // ========== ADMIN ENDPOINTS ==========
    
    /**
     * Get all tickets (Admin)
     * GET /api/admin/support/tickets
     */
    @GetMapping("/api/admin/support/tickets")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }
    
    /**
     * Update ticket (Admin/Manager)
     * PUT /api/support/tickets/1
     */
    @PutMapping("/api/support/tickets/{id}")
    public ResponseEntity<?> updateTicket(
            @PathVariable Long id,
            @RequestBody SupportTicket updates) {
        try {
            SupportTicket updated = supportService.updateTicket(id, updates);
            System.out.println("✅ Ticket #" + id + " updated to status: " + updated.getStatus());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("❌ Error updating ticket: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Delete ticket
     * DELETE /api/support/tickets/1
     */
    @DeleteMapping("/api/support/tickets/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        try {
            supportService.deleteTicket(id);
            return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get tickets by status
     * GET /api/support/tickets/status/OPEN
     */
    @GetMapping("/api/support/tickets/status/{status}")
    public ResponseEntity<List<SupportTicket>> getTicketsByStatus(@PathVariable TicketStatus status) {
        return ResponseEntity.ok(supportService.getTicketsByStatus(status));
    }
}