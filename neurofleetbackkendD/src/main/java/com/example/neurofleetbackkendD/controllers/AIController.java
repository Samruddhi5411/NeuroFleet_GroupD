package com.example.neurofleetbackkendD.controllers;



import com.example.neurofleetbackkendD.service.AIServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AI Controller - Exposes ML/AI endpoints to frontend
 * Location: backend/src/main/java/com/example/neurofleetbackkendD/controllers/AIController.java
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIServiceClient aiServiceClient;

    /**
     * Predict ETA using ML model
     * POST /api/ai/predict-eta
     */
    @PostMapping("/predict-eta")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'CUSTOMER', 'DRIVER')")
    public ResponseEntity<Map<String, Object>> predictETA(@RequestBody Map<String, Object> request) {
        try {
            Double distanceKm = getDoubleValue(request, "distanceKm");
            Double avgSpeed = getDoubleValue(request, "avgSpeed");
            String trafficLevel = (String) request.getOrDefault("trafficLevel", "Medium");
            Double batteryLevel = getDoubleValue(request, "batteryLevel");
            Double fuelLevel = getDoubleValue(request, "fuelLevel");

            Map<String, Object> result = aiServiceClient.predictETA(
                distanceKm, avgSpeed, trafficLevel, batteryLevel, fuelLevel
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("fallback", true);
            return ResponseEntity.ok(error);
        }
    }

    /**
     * Predict maintenance needs
     * POST /api/ai/predict-maintenance
     */
    @PostMapping("/predict-maintenance")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> predictMaintenance(@RequestBody Map<String, Object> request) {
        try {
            Double healthScore = getDoubleValue(request, "healthScore");
            Integer mileage = getIntValue(request, "mileage");
            Integer kmsSinceService = getIntValue(request, "kmsSinceService");
            Double batteryLevel = getDoubleValue(request, "batteryLevel");

            Map<String, Object> result = aiServiceClient.predictMaintenance(
                healthScore, mileage, kmsSinceService, batteryLevel
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.ok(error);
        }
    }

    /**
     * Optimize route
     * POST /api/ai/optimize-route
     */
    @PostMapping("/optimize-route")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'DRIVER')")
    public ResponseEntity<Map<String, Object>> optimizeRoute(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Double> pickup = (Map<String, Double>) request.get("pickup");
            @SuppressWarnings("unchecked")
            Map<String, Double> dropoff = (Map<String, Double>) request.get("dropoff");
            String trafficCondition = (String) request.getOrDefault("trafficCondition", "Medium");

            Map<String, Object> result = aiServiceClient.optimizeRoute(
                pickup, dropoff, trafficCondition
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.ok(error);
        }
    }

    /**
     * Check AI service health
     * GET /api/ai/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        boolean available = aiServiceClient.isAIServiceAvailable();
        health.put("status", available ? "online" : "offline");
        health.put("service", "AI Prediction Service");
        return ResponseEntity.ok(health);
    }

    // Helper methods
    private Double getDoubleValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return 0.0;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return Double.parseDouble(value.toString());
    }

    private Integer getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return 0;
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return Integer.parseInt(value.toString());
    }
}