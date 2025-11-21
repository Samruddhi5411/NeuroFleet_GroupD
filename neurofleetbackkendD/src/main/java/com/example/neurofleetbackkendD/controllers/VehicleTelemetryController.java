package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.VehicleTelemetry;
import com.example.neurofleetbackkendD.service.VehicleTelemetryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleTelemetryController {
    
    @Autowired
    private VehicleTelemetryService telemetryService;
    
    @PostMapping("/vehicles/{vehicleId}")
    public ResponseEntity<?> updateTelemetry(@PathVariable Long vehicleId,
                                            @RequestBody Map<String, Object> data) {
        try {
            VehicleTelemetry telemetry = telemetryService.updateTelemetry(vehicleId, data);
            return ResponseEntity.ok(telemetry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vehicles/{vehicleId}/latest")
    public ResponseEntity<?> getLatestTelemetry(@PathVariable Long vehicleId) {
        try {
            VehicleTelemetry telemetry = telemetryService.getLatestTelemetry(vehicleId);
            if (telemetry == null) {
                return ResponseEntity.ok(Map.of("message", "No telemetry data available"));
            }
            return ResponseEntity.ok(telemetry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vehicles/{vehicleId}/history")
    public ResponseEntity<?> getTelemetryHistory(@PathVariable Long vehicleId,
                                                 @RequestParam(required = false) String startDate,
                                                 @RequestParam(required = false) String endDate) {
        try {
            LocalDateTime start = startDate != null ? 
                LocalDateTime.parse(startDate) : LocalDateTime.now().minusDays(1);
            LocalDateTime end = endDate != null ? 
                LocalDateTime.parse(endDate) : LocalDateTime.now();
            
            List<VehicleTelemetry> history = telemetryService.getTelemetryHistory(vehicleId, start, end);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/fleet/overview")
    public ResponseEntity<?> getFleetOverview() {
        return ResponseEntity.ok(telemetryService.getFleetOverview());
    }
}