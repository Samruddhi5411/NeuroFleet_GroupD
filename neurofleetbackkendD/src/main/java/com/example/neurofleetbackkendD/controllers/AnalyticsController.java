package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics(period));
    }
    
    @GetMapping("/vehicles/utilization")
    public ResponseEntity<?> getVehicleUtilization() {
        return ResponseEntity.ok(analyticsService.getVehicleUtilization());
    }
    
    @GetMapping("/drivers/performance")
    public ResponseEntity<?> getDriverPerformance() {
        return ResponseEntity.ok(analyticsService.getDriverPerformance());
    }
    
    @GetMapping("/maintenance")
    public ResponseEntity<?> getMaintenanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getMaintenanceAnalytics());
    }
    
    @GetMapping("/bookings/trends")
    public ResponseEntity<?> getBookingTrends(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getBookingTrends(days));
    }
}
