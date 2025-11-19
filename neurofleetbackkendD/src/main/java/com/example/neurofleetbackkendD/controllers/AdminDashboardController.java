package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            System.out.println("📊 Admin accessing dashboard...");
            Map<String, Object> dashboard = dashboardService.getAdminDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}