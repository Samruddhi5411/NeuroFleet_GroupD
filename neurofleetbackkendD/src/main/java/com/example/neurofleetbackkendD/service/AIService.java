package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AIService {
    
    @Value("${ai.service.url:http://localhost:5001}")
    private String aiServiceUrl;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Get AI-powered vehicle recommendations
     */
    public Map<String, Object> getRecommendations(Long customerId) {
        return getRecommendations(customerId, new HashMap<>());
    }
    
    public Map<String, Object> getRecommendations(Long customerId, Map<String, Object> searchFilters) {
        try {
            List<Vehicle> availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
            
            if (availableVehicles.isEmpty()) {
                return createEmptyResponse("No vehicles available");
            }
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("customerId", customerId);
            requestBody.put("filters", searchFilters != null ? searchFilters : new HashMap<>());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            String url = aiServiceUrl + "/api/ai/recommend/vehicles";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
            
        } catch (Exception e) {
            System.err.println("❌ AI Service Error: " + e.getMessage());
        }
        
        return getFallbackRecommendations(customerId, 
            vehicleRepository.findByStatus(VehicleStatus.AVAILABLE), searchFilters);
    }
    
    /**
     * Predict maintenance for a vehicle
     */
    public Map<String, Object> predictMaintenance(Map<String, Object> vehicleData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(vehicleData, headers);
            
            String url = aiServiceUrl + "/api/ai/maintenance/predict";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("❌ AI Maintenance Prediction Error: " + e.getMessage());
        }
        
        return generateFallbackPrediction(vehicleData);
    }
    
    /**
     * Analyze fleet maintenance
     */
    public Map<String, Object> analyzeFleetMaintenance() {
        try {
            String url = aiServiceUrl + "/api/ai/maintenance/analyze-fleet";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("❌ AI Fleet Analysis Error: " + e.getMessage());
        }
        
        return generateFallbackFleetAnalysis();
    }
    
    /**
     * Optimize route using AI
     */
    public Map<String, Object> optimizeRoute(Map<String, Object> routeData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(routeData, headers);
            
            String url = aiServiceUrl + "/api/ai/route/optimize";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("❌ AI Route Optimization Error: " + e.getMessage());
        }
        
        return generateFallbackRoute(routeData);
    }
    
    // ========== HELPER METHODS ==========
    
    private Map<String, Object> getFallbackRecommendations(
            Long customerId, List<Vehicle> vehicles, Map<String, Object> filters) {
        
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        for (Vehicle vehicle : vehicles) {
            if (filters != null) {
                String vehicleType = (String) filters.get("vehicleType");
                if (vehicleType != null && !vehicleType.equals("ALL") && 
                    !vehicle.getType().name().equals(vehicleType)) {
                    continue;
                }
                
                Boolean isElectric = (Boolean) filters.get("isElectric");
                if (isElectric != null && !vehicle.getIsElectric().equals(isElectric)) {
                    continue;
                }
            }
            
            Map<String, Object> recommendation = new HashMap<>();
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("id", vehicle.getId());
            vehicleData.put("vehicleNumber", vehicle.getVehicleNumber());
            vehicleData.put("manufacturer", vehicle.getManufacturer());
            vehicleData.put("model", vehicle.getModel());
            vehicleData.put("type", vehicle.getType().name());
            vehicleData.put("capacity", vehicle.getCapacity());
            vehicleData.put("isElectric", vehicle.getIsElectric());
            vehicleData.put("status", vehicle.getStatus().name());
            vehicleData.put("healthScore", vehicle.getHealthScore());
            
            recommendation.put("vehicle", vehicleData);
            recommendation.put("recommendationScore", 70);
            recommendation.put("isRecommended", true);
            recommendation.put("pricePerHour", 10.0);
            recommendation.put("matchReasons", Arrays.asList("Available and ready"));
            
            recommendations.add(recommendation);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("totalVehicles", recommendations.size());
        response.put("recommendedCount", recommendations.size());
        response.put("recommendations", recommendations);
        
        return response;
    }
    
    private Map<String, Object> generateFallbackPrediction(Map<String, Object> vehicleData) {
        int healthScore = vehicleData.get("healthScore") != null ? 
            ((Number) vehicleData.get("healthScore")).intValue() : 100;
        
        Map<String, Object> prediction = new HashMap<>();
        prediction.put("vehicleId", vehicleData.get("id"));
        prediction.put("vehicleNumber", vehicleData.get("vehicleNumber"));
        prediction.put("healthScore", healthScore);
        prediction.put("riskScore", 100 - healthScore);
        prediction.put("riskLevel", healthScore < 70 ? "HIGH" : "LOW");
        prediction.put("predictedDaysToFailure", healthScore >= 80 ? 90 : 30);
        prediction.put("recommendedActions", Arrays.asList("Schedule routine inspection"));
        
        return prediction;
    }
    
    private Map<String, Object> generateFallbackFleetAnalysis() {
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalVehicles", 0);
        analysis.put("highRiskCount", 0);
        analysis.put("mediumRiskCount", 0);
        analysis.put("highRiskVehicles", new ArrayList<>());
        
        return analysis;
    }
    
    private Map<String, Object> generateFallbackRoute(Map<String, Object> routeData) {
        Map<String, Object> route = new HashMap<>();
        route.put("distanceKm", 50.0);
        route.put("etaMinutes", 60);
        route.put("trafficLevel", "MEDIUM");
        route.put("optimizationType", "BALANCED");
        
        return route;
    }
    
    private Map<String, Object> createEmptyResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("totalVehicles", 0);
        response.put("recommendations", new ArrayList<>());
        
        return response;
    }
}