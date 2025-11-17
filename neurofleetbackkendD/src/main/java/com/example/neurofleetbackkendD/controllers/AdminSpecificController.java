package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.dto.ApiResponse;
import com.example.neurofleetbackkendD.service.*;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSpecificController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/overview")
    public ResponseEntity<?> getAdminOverview() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }
    
    @GetMapping("/analytics/comprehensive")
    public ResponseEntity<?> getComprehensiveAnalytics() {
        return ResponseEntity.ok(Map.of(
            "revenue", analyticsService.getRevenueAnalytics("month"),
            "vehicles", analyticsService.getVehicleUtilization(),
            "drivers", analyticsService.getDriverPerformance(),
            "maintenance", analyticsService.getMaintenanceAnalytics()
        ));
    }
}
