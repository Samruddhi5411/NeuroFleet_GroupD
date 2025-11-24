package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import com.example.neurofleetbackkendD.service.MaintenanceService;
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
    
    @Autowired
    private MaintenanceService maintenanceService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            System.out.println("📊 Admin accessing dashboard...");
            Map<String, Object> dashboard = dashboardService.getAdminDashboard();
            System.out.println("✅ Dashboard data loaded");
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/maintenance")
    public ResponseEntity<?> getMaintenanceRecords() {
        try {
            System.out.println("🔧 Admin accessing maintenance records...");
            return ResponseEntity.ok(maintenanceService.getAllMaintenanceRecords());
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/manager-performance")
    public ResponseEntity<?> getManagerPerformance() {
        try {
            System.out.println("📈 Admin accessing manager performance...");
            return ResponseEntity.ok(dashboardService.getManagerPerformance());
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/driver-performance")
    public ResponseEntity<?> getDriverPerformance() {
        try {
            System.out.println("🚗 Admin accessing driver performance...");
            return ResponseEntity.ok(dashboardService.getDriverPerformance());
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}