package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.UrbanMobilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/urban-mobility")
@CrossOrigin(origins = "http://localhost:3000")
public class UrbanMobilityController {
    
    @Autowired
    private UrbanMobilityService urbanMobilityService;
    
    @GetMapping("/admin/insights")
    public ResponseEntity<?> getAdminDashboardInsights() {
        return ResponseEntity.ok(urbanMobilityService.getAdminDashboardInsights());
    }
    
    @GetMapping("/fleet-map/realtime")
    public ResponseEntity<?> getRealTimeFleetMap() {
        return ResponseEntity.ok(urbanMobilityService.getRealTimeFleetMap());
    }
    
    @PostMapping("/reports/generate")
    public ResponseEntity<?> generateReport(@RequestBody Map<String, Object> params) {
        try {
            String reportType = (String) params.getOrDefault("reportType", "comprehensive");
            
            LocalDateTime startDate = params.containsKey("startDate") ?
                LocalDateTime.parse((String) params.get("startDate")) :
                LocalDateTime.now().minusMonths(1);
            
            LocalDateTime endDate = params.containsKey("endDate") ?
                LocalDateTime.parse((String) params.get("endDate")) :
                LocalDateTime.now();
            
            return ResponseEntity.ok(
                urbanMobilityService.generateReport(reportType, startDate, endDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
