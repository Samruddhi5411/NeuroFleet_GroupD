package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AIService;
import com.example.neurofleetbackkendD.service.VehicleService;
import com.example.neurofleetbackkendD.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private VehicleService vehicleService;
    
    /**
     * Predict maintenance for a specific vehicle
     */
    @PostMapping("/maintenance/predict/{vehicleId}")
    public ResponseEntity<?> predictMaintenance(@PathVariable Long vehicleId) {
        try {
            Vehicle vehicle = vehicleService.getVehicleById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("vehicleId", vehicle.getId());
            vehicleData.put("vehicleNumber", vehicle.getVehicleNumber());
            vehicleData.put("mileage", vehicle.getMileage());
            vehicleData.put("healthScore", vehicle.getHealthScore());
            vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
            vehicleData.put("fuelLevel", vehicle.getFuelLevel());
            vehicleData.put("isElectric", vehicle.getIsElectric());
            
            Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
            
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Analyze all vehicles for maintenance
     */
    @GetMapping("/maintenance/analyze-fleet")
    public ResponseEntity<?> analyzeFleet() {
        try {
            Map<String, Object> analysis = aiService.analyzeFleetMaintenance();
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Optimize route using AI
     */
    @PostMapping("/route/optimize")
    public ResponseEntity<?> optimizeRoute(@RequestBody Map<String, Object> routeData) {
        try {
            Map<String, Object> optimizedRoute = aiService.optimizeRoute(routeData);
            return ResponseEntity.ok(optimizedRoute);
        } catch (Exception e) {
        	return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get smart vehicle recommendations for customer
     */
    @GetMapping("/recommend/vehicles/{customerId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long customerId) {
        try {
            Map<String, Object> recommendations = aiService.getRecommendations(customerId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}