package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AIServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AIController {
    
    @Autowired
    private AIServiceClient aiServiceClient;
    
    @PostMapping("/eta")
    public ResponseEntity<Map<String, Object>> predictETA(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("\n🤖 AI ETA Request received:");
            System.out.println("📊 Request body: " + request);
            
            Map<String, Object> result = aiServiceClient.predictETA(
                ((Number) request.get("pickupLat")).doubleValue(),
                ((Number) request.get("pickupLon")).doubleValue(),
                ((Number) request.get("dropoffLat")).doubleValue(),
                ((Number) request.get("dropoffLon")).doubleValue(),
                request.get("vehicleHealth") != null ? ((Number) request.get("vehicleHealth")).doubleValue() : 0.85,
                (Boolean) request.getOrDefault("isElectric", false)
            );
            
            if (result != null) {
                System.out.println("✅ AI ETA Response: " + result);
                return ResponseEntity.ok(result);
            }
            
            System.err.println("❌ AI service returned null");
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "AI service returned no data"));
        } catch (Exception e) {
            System.err.println("❌ ETA prediction error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/recommend-vehicles")
    public ResponseEntity<List<Map<String, Object>>> recommendVehicles(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("\n🤖 AI Vehicle Recommendation Request received:");
            System.out.println("📊 Request body: " + request);
            
            List<Map<String, Object>> result = aiServiceClient.recommendVehicles(
                ((Number) request.get("pickupLat")).doubleValue(),
                ((Number) request.get("pickupLon")).doubleValue(),
                request.get("passengers") != null ? ((Number) request.get("passengers")).intValue() : 1,
                (Boolean) request.getOrDefault("preferElectric", false)
            );
            
            System.out.println("✅ AI Recommendations returned: " + result.size() + " vehicles");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ Vehicle recommendation error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
    
    @GetMapping("/maintenance/{vehicleId}")
    public ResponseEntity<Map<String, Object>> predictMaintenance(@PathVariable Long vehicleId) {
        try {
            System.out.println("\n🤖 AI Maintenance Request for vehicle: " + vehicleId);
            
            Map<String, Object> result = aiServiceClient.predictMaintenance(vehicleId);
            
            if (result != null) {
                System.out.println("✅ AI Maintenance Response: " + result);
                return ResponseEntity.ok(result);
            }
            
            System.err.println("❌ Vehicle not found or AI service error");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("❌ Maintenance prediction error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/maintenance/all")
    public ResponseEntity<List<Map<String, Object>>> predictAllMaintenance() {
        try {
            System.out.println("\n🤖 AI All Maintenance Request received");
            
            List<Map<String, Object>> result = aiServiceClient.predictAllMaintenance();
            
            System.out.println("✅ AI All Maintenance returned: " + result.size() + " predictions");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ All maintenance prediction error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
    
    @PostMapping("/train")
    public ResponseEntity<Map<String, Object>> trainModels() {
        try {
            System.out.println("\n🤖 AI Model Training Request received");
            
            Map<String, Object> result = aiServiceClient.trainModels();
            
            System.out.println("✅ AI Training complete: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ Model training error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "timestamp", new Date().toString(),
            "message", "AI Controller is running"
        ));
    }
}