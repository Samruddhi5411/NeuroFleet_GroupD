package com.example.neurofleetbackkendD.controllers;


import com.example.neurofleetbackkendD.service.AIIntegrationService;
import com.example.neurofleetbackkendD.service.RouteOptimizationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {
    
    @Autowired
    private RouteOptimizationService routeService;
    
    @Autowired
    private AIIntegrationService aiService;
    
    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeRoute(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(routeService.optimizeRoute(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }
    
    @GetMapping("/ai/health")
    public ResponseEntity<?> checkAIHealth() {
        boolean healthy = aiService.isAIServiceHealthy();
        return ResponseEntity.ok(Map.of(
            "aiServiceHealthy", healthy,
            "message", healthy ? "AI service is running" : "AI service unavailable, using fallback"
        ));
    }
    
    @PostMapping("/ai/predict-eta")
    public ResponseEntity<?> predictETA(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(aiService.predictETA(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/ai/predict-maintenance")
    public ResponseEntity<?> predictMaintenance(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(aiService.predictMaintenance(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/ai/recommend-vehicle")
    public ResponseEntity<?> recommendVehicle(@RequestBody Map<String, Object> request) {
        try {
            return ResponseEntity.ok(aiService.recommendVehicle(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}