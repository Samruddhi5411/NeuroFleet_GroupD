package com.example.neurofleetbackkendD.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * AIServiceClient - Connects Spring Boot backend to Python Flask AI service
 * Location: backend/src/main/java/com/example/service/AIServiceClient.java
 * 
 * Purpose: Call Python ML endpoints from Java backend
 */
@Service
public class AIServiceClient {

    @Value("${ai.service.url:http://localhost:5001}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    public AIServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Predict ETA using Python ML model
     * Calls: POST http://localhost:5001/predict-eta
     */
    public Map<String, Object> predictETA(Double distanceKm, Double avgSpeed, String trafficLevel,
                                           Double batteryLevel, Double fuelLevel) {
        try {
            String url = aiServiceUrl + "/predict-eta";
            
            Map<String, Object> request = new HashMap<>();
            request.put("distanceKm", distanceKm);
            request.put("avgSpeed", avgSpeed);
            request.put("trafficLevel", trafficLevel);
            request.put("batteryLevel", batteryLevel);
            request.put("fuelLevel", fuelLevel);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            System.out.println("🤖 Calling AI Service: " + url);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            
            // Fallback calculation if AI service is down
            double baseTime = (distanceKm / avgSpeed) * 60;
            double trafficFactor = getTrafficFactor(trafficLevel);
            double eta = baseTime * trafficFactor;
            
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("predicted_eta", Math.round(eta * 100.0) / 100.0);
            fallback.put("fallback", true);
            return fallback;
        }
    }

    /**
     * Predict vehicle maintenance needs
     * Calls: POST http://localhost:5001/predict-maintenance
     */
    public Map<String, Object> predictMaintenance(Double healthScore, Integer mileage,
                                                    Integer kmsSinceService, Double batteryLevel) {
        try {
            String url = aiServiceUrl + "/predict-maintenance";
            
            Map<String, Object> request = new HashMap<>();
            request.put("healthScore", healthScore);
            request.put("mileage", mileage);
            request.put("kmsSinceService", kmsSinceService);
            request.put("batteryLevel", batteryLevel);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            System.out.println("🤖 Calling AI Service: " + url);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            
            // Fallback logic
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("risk_score", 0);
            fallback.put("priority", "LOW");
            fallback.put("fallback", true);
            return fallback;
        }
    }

    /**
     * Optimize route
     * Calls: POST http://localhost:5001/optimize-route
     */
    public Map<String, Object> optimizeRoute(Map<String, Double> pickup, Map<String, Double> dropoff,
                                              String trafficCondition) {
        try {
            String url = aiServiceUrl + "/optimize-route";
            
            Map<String, Object> request = new HashMap<>();
            request.put("pickup", pickup);
            request.put("dropoff", dropoff);
            request.put("trafficCondition", trafficCondition);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            System.out.println("🤖 Calling AI Service: " + url);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * Check if AI service is running
     * Calls: GET http://localhost:5001/health
     */
    public boolean isAIServiceAvailable() {
        try {
            String url = aiServiceUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    // Helper method
    private double getTrafficFactor(String trafficLevel) {
        switch (trafficLevel.toUpperCase()) {
            case "HIGH": return 1.8;
            case "MEDIUM": return 1.5;
            case "LOW":
            default: return 1.2;
        }
    }
}