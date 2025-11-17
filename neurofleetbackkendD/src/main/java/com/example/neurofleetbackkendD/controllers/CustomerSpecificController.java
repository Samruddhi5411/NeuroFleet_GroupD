package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import com.example.neurofleetbackkendD.service.AuthService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerSpecificController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/overview")
    public ResponseEntity<?> getCustomerOverview(@RequestParam String username) {
        try {
            var customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            return ResponseEntity.ok(dashboardService.getCustomerDashboard(customer.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
