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
@RequestMapping("/api/support")
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {
    
    @Autowired
    private SupportService supportService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }
    
    @GetMapping("/tickets/customer")
    public ResponseEntity<?> getCustomerTickets(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            return ResponseEntity.ok(supportService.getCustomerTickets(customer.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/tickets/status/{status}")
    public ResponseEntity<List<SupportTicket>> getTicketsByStatus(
            @PathVariable TicketStatus status) {
        return ResponseEntity.ok(supportService.getTicketsByStatus(status));
    }
    
    @GetMapping("/tickets/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supportService.getTicketById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/tickets")
    public ResponseEntity<?> createTicket(@RequestParam String username,
                                         @RequestBody SupportTicket ticket) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            ticket.setCustomer(customer);
            return ResponseEntity.ok(supportService.createTicket(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/tickets/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id,
                                         @RequestBody SupportTicket ticket) {
        try {
            return ResponseEntity.ok(supportService.updateTicket(id, ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        try {
            supportService.deleteTicket(id);
            return ResponseEntity.ok(Map.of("message", "Ticket deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
