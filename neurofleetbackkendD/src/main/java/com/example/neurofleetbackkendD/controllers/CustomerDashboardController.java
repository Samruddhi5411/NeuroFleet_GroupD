package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerDashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getCustomerDashboard(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            System.out.println("📊 Customer " + customer.getFullName() + " accessing dashboard...");
            Map<String, Object> dashboard = dashboardService.getCustomerDashboard(customer.getId());
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}