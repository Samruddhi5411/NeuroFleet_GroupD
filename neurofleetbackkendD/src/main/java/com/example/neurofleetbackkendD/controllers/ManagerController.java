package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getManagerDashboard() {
        try {
            return ResponseEntity.ok(dashboardService.getManagerDashboard());
        } catch (Exception e) {
            System.err.println("❌ Error fetching manager dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                java.util.Map.of("error", e.getMessage())
            );
        }
    }
}