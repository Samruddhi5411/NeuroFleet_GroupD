package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AIIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {
    
    @Autowired
    private AIIntegrationService aiService;
    
    /**
     * Get AI vehicle recommendations for a customer
     */
    @PostMapping("/recommend/vehicles")
    public ResponseEntity<?> recommendVehicles(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.parseLong(request.get("customerId").toString());
            Map<String, Object> filters = (Map<String, Object>) request.getOrDefault("filters", new HashMap<>());
            List<Map<String, Object>> bookingHistory = (List<Map<String, Object>>) request.getOrDefault("bookingHistory", new ArrayList<>());
            
            Map<String, Object> recommendations = aiService.getVehicleRecommendations(
                customerId, 
                filters, 
                bookingHistory
            );
            
            System.out.println("✅ AI vehicle recommendations generated for customer: " + customerId);
            return ResponseEntity.ok(recommendations);
            
        } catch (Exception e) {
            System.err.println("❌ Error in AI recommendations: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Optimize fleet selection based on location and availability
     */
    @PostMapping("/optimize/fleet")
    public ResponseEntity<?> optimizeFleet(@RequestBody Map<String, Object> request) {
        try {
            Double pickupLat = Double.parseDouble(request.get("pickupLat").toString());
            Double pickupLng = Double.parseDouble(request.get("pickupLng").toString());
            List<Map<String, Object>> availableVehicles = (List<Map<String, Object>>) request.get("availableVehicles");
            
            Map<String, Object> optimization = aiService.optimizeFleetSelection(
                pickupLat, 
                pickupLng, 
                availableVehicles
            );
            
            System.out.println("✅ Fleet optimization complete");
            return ResponseEntity.ok(optimization);
            
        } catch (Exception e) {
            System.err.println("❌ Error in fleet optimization: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Match best driver for a booking
     */
    @PostMapping("/optimize/driver-match")
    public ResponseEntity<?> matchDriver(@RequestBody Map<String, Object> request) {
        try {
            Double pickupLat = Double.parseDouble(request.get("pickupLat").toString());
            Double pickupLng = Double.parseDouble(request.get("pickupLng").toString());
            List<Map<String, Object>> availableDrivers = (List<Map<String, Object>>) request.get("availableDrivers");
            
            Map<String, Object> driverMatch = aiService.matchBestDriver(
                pickupLat, 
                pickupLng, 
                availableDrivers
            );
            
            System.out.println("✅ Driver matching complete");
            return ResponseEntity.ok(driverMatch);
            
        } catch (Exception e) {
            System.err.println("❌ Error in driver matching: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Detect telemetry anomalies in real-time
     */
    @PostMapping("/telemetry/detect-anomaly")
    public ResponseEntity<?> detectAnomaly(@RequestBody Map<String, Object> telemetryData) {
        try {
            Map<String, Object> anomalyDetection = aiService.detectTelemetryAnomaly(telemetryData);
            
            Boolean isAnomaly = (Boolean) anomalyDetection.getOrDefault("isAnomaly", false);
            if (isAnomaly) {
                System.out.println("⚠️ Anomaly detected: " + anomalyDetection.get("riskLevel"));
            }
            
            return ResponseEntity.ok(anomalyDetection);
            
        } catch (Exception e) {
            System.err.println("❌ Error in anomaly detection: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Predict vehicle maintenance needs
     */
    @PostMapping("/maintenance/predict")
    public ResponseEntity<?> predictMaintenance(@RequestBody Map<String, Object> vehicleData) {
        try {
            Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
            
            Boolean maintenanceRequired = (Boolean) prediction.getOrDefault("maintenanceRequired", false);
            if (maintenanceRequired) {
                System.out.println("🔧 Maintenance predicted for vehicle");
            }
            
            return ResponseEntity.ok(prediction);
            
        } catch (Exception e) {
            System.err.println("❌ Error in maintenance prediction: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Generate trip heatmap data
     */
    @GetMapping("/analytics/heatmap")
    public ResponseEntity<?> generateHeatmap(@RequestParam(defaultValue = "7") int days) {
        try {
            Map<String, Object> heatmap = aiService.generateTripHeatmap(days);
            
            System.out.println("✅ Trip heatmap generated");
            return ResponseEntity.ok(heatmap);
            
        } catch (Exception e) {
            System.err.println("❌ Error generating heatmap: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Forecast demand for future days
     */
    @GetMapping("/analytics/demand-forecast")
    public ResponseEntity<?> forecastDemand(@RequestParam(defaultValue = "7") int days) {
        try {
            Map<String, Object> forecast = aiService.forecastDemand(days);
            
            System.out.println("✅ Demand forecast generated");
            return ResponseEntity.ok(forecast);
            
        } catch (Exception e) {
            System.err.println("❌ Error forecasting demand: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Learn customer booking patterns
     */
    @PostMapping("/learn/customer-pattern")
    public ResponseEntity<?> learnCustomerPattern(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.parseLong(request.get("customerId").toString());
            Map<String, Object> bookingData = (Map<String, Object>) request.get("bookingData");
            
            aiService.learnCustomerPattern(customerId, bookingData);
            
            System.out.println("✅ Customer pattern learned for: " + customerId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Customer pattern learned successfully"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Error learning pattern: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Health check for AI service integration
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "AI Integration Service",
            "endpoints", Arrays.asList(
                "/api/ai/recommend/vehicles",
                "/api/ai/optimize/fleet",
                "/api/ai/optimize/driver-match",
                "/api/ai/telemetry/detect-anomaly",
                "/api/ai/maintenance/predict",
                "/api/ai/analytics/heatmap",
                "/api/ai/analytics/demand-forecast",
                "/api/ai/learn/customer-pattern"
            )
        ));
    }
}