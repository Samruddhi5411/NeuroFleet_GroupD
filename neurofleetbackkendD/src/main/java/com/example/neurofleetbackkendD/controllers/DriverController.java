package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDriverDashboard(@RequestParam String username) {
        try {
            User driver = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            return ResponseEntity.ok(dashboardService.getDriverDashboard(driver.getId()));
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                java.util.Map.of("error", e.getMessage())
            );
        }
    }
    
    @GetMapping("/dashboard/{driverId}")
    public ResponseEntity<?> getDriverDashboardById(@PathVariable Long driverId) {
        try {
            return ResponseEntity.ok(dashboardService.getDriverDashboard(driverId));
        } catch (Exception e) {
            System.err.println("❌ Error fetching driver dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                java.util.Map.of("error", e.getMessage())
            );
        }
    }
}