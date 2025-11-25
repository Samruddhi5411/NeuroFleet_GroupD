package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AIServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {
    
    @Autowired
    private AIServiceClient aiServiceClient;
    
    @PostMapping("/eta")
    public ResponseEntity<Map<String, Object>> predictETA(@RequestBody Map<String, Object> request) {
        Map<String, Object> result = aiServiceClient.predictETA(
            ((Number) request.get("pickupLat")).doubleValue(),
            ((Number) request.get("pickupLon")).doubleValue(),
            ((Number) request.get("dropoffLat")).doubleValue(),
            ((Number) request.get("dropoffLon")).doubleValue(),
            request.get("vehicleHealth") != null ? ((Number) request.get("vehicleHealth")).doubleValue() : 0.85,
            (Boolean) request.getOrDefault("isElectric", false)
        );
        
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.internalServerError().build();
    }
    
    @PostMapping("/recommend-vehicles")
    public ResponseEntity<List<Map<String, Object>>> recommendVehicles(@RequestBody Map<String, Object> request) {
        List<Map<String, Object>> result = aiServiceClient.recommendVehicles(
            ((Number) request.get("pickupLat")).doubleValue(),
            ((Number) request.get("pickupLon")).doubleValue(),
            request.get("passengers") != null ? ((Number) request.get("passengers")).intValue() : 1,
            (Boolean) request.getOrDefault("preferElectric", false)
        );
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/maintenance/{vehicleId}")
    public ResponseEntity<Map<String, Object>> predictMaintenance(@PathVariable Long vehicleId) {
        Map<String, Object> result = aiServiceClient.predictMaintenance(vehicleId);
        
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/train")
    public ResponseEntity<Map<String, Object>> trainModels() {
        Map<String, Object> result = aiServiceClient.trainModels();
        return ResponseEntity.ok(result);
    }
}