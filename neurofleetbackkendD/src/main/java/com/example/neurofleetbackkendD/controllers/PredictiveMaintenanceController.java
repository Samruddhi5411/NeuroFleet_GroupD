package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.PredictiveMaintenanceService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictive-maintenance")
@CrossOrigin(origins = "http://localhost:3000")
public class PredictiveMaintenanceController {
    
    @Autowired
    private PredictiveMaintenanceService maintenanceService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getHealthAnalyticsDashboard() {
        return ResponseEntity.ok(maintenanceService.getHealthAnalyticsDashboard());
    }
    
    @GetMapping("/vehicle/{vehicleId}/trend")
    public ResponseEntity<?> getVehicleHealthTrend(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(maintenanceService.getVehicleHealthTrend(vehicleId, days));
    }
    
    @GetMapping("/vehicle/{vehicleId}/breakdown")
    public ResponseEntity<?> getComponentBreakdown(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getComponentHealthBreakdown(vehicleId));
    }
    
    @PostMapping("/run-health-check")
    public ResponseEntity<?> runHealthCheck() {
        maintenanceService.monitorVehicleHealth();
        return ResponseEntity.ok(Map.of("message", "Health check completed"));
    }
}