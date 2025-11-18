package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getCustomerDashboard(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            return ResponseEntity.ok(dashboardService.getCustomerDashboard(customer.getId()));
        } catch (Exception e) {
            System.err.println("❌ Error fetching customer dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                java.util.Map.of("error", e.getMessage())
            );
        }
    }
    
    @GetMapping("/dashboard/{customerId}")
    public ResponseEntity<?> getCustomerDashboardById(@PathVariable Long customerId) {
        try {
            return ResponseEntity.ok(dashboardService.getCustomerDashboard(customerId));
        } catch (Exception e) {
            System.err.println("❌ Error fetching customer dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                java.util.Map.of("error", e.getMessage())
            );
        }
    }
}