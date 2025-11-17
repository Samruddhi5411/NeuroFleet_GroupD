package com.example.neurofleetbackkendD.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AIIntegrationService {
    
    private final String AI_SERVICE_URL = "http://localhost:5001";
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Predict ETA using AI
    public Map<String, Object> predictETA(Map<String, Object> request) {
        try {
            String url = AI_SERVICE_URL + "/predict-eta";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return fallbackETA(request);
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
            return fallbackETA(request);
        }
    }
    
    // Predict maintenance using AI
    public Map<String, Object> predictMaintenance(Map<String, Object> vehicleData) {
        try {
            String url = AI_SERVICE_URL + "/predict-maintenance";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(vehicleData, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return fallbackMaintenance(vehicleData);
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
            return fallbackMaintenance(vehicleData);
        }
    }
    
    // Recommend vehicle using AI
    public Map<String, Object> recommendVehicle(Map<String, Object> request) {
        try {
            String url = AI_SERVICE_URL + "/recommend-vehicle";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
        }
        
        return Map.of("recommendations", request.get("vehicles"));
    }
    
    // Optimize route using AI
    public Map<String, Object> optimizeRoute(Map<String, Object> request) {
        try {
            String url = AI_SERVICE_URL + "/optimize-route";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Service error: " + e.getMessage());
        }
        
        return fallbackRouteOptimization(request);
    }
    
    // Fallback ETA calculation
    private Map<String, Object> fallbackETA(Map<String, Object> request) {
        double distanceKm = ((Number) request.getOrDefault("distanceKm", 10)).doubleValue();
        double avgSpeed = ((Number) request.getOrDefault("avgSpeed", 50)).doubleValue();
        String trafficLevel = (String) request.getOrDefault("trafficLevel", "Medium");
        
        double trafficFactor = 1.0;
        switch (trafficLevel) {
            case "Low": trafficFactor = 1.1; break;
            case "Medium": trafficFactor = 1.3; break;
            case "High": trafficFactor = 1.6; break;
        }
        
        double eta = (distanceKm / avgSpeed) * 60 * trafficFactor;
        
        Map<String, Object> result = new HashMap<>();
        result.put("predicted_eta", Math.round(eta * 100.0) / 100.0);
        result.put("distance_km", distanceKm);
        result.put("avg_speed", avgSpeed);
        result.put("traffic_level", trafficLevel);
        
        return result;
    }
    
    // Fallback maintenance prediction
    private Map<String, Object> fallbackMaintenance(Map<String, Object> data) {
        int healthScore = ((Number) data.getOrDefault("healthScore", 100)).intValue();
        int mileage = ((Number) data.getOrDefault("mileage", 0)).intValue();
        
        int riskScore = 0;
        List<String> issues = new ArrayList<>();
        
        if (healthScore < 70) {
            riskScore += 30;
            issues.add("Low health score");
        }
        if (mileage > 50000) {
            riskScore += 20;
            issues.add("High mileage");
        }
        
        String priority = riskScore > 60 ? "CRITICAL" : riskScore > 40 ? "HIGH" : "LOW";
        int daysToFailure = riskScore > 60 ? 7 : riskScore > 40 ? 15 : 30;
        
        Map<String, Object> result = new HashMap<>();
        result.put("risk_score", riskScore);
        result.put("priority", priority);
        result.put("predicted_days_to_failure", daysToFailure);
        result.put("issues", issues);
        result.put("recommended_action", riskScore > 40 ? "Schedule maintenance" : "Monitor");
        
        return result;
    }
    
    // Fallback route optimization
    private Map<String, Object> fallbackRouteOptimization(Map<String, Object> request) {
        Map<String, Object> pickup = (Map<String, Object>) request.get("pickup");
        Map<String, Object> dropoff = (Map<String, Object>) request.get("dropoff");
        
        double lat1 = ((Number) pickup.getOrDefault("lat", 19.0760)).doubleValue();
        double lon1 = ((Number) pickup.getOrDefault("lon", 72.8777)).doubleValue();
        double lat2 = ((Number) dropoff.getOrDefault("lat", 19.1136)).doubleValue();
        double lon2 = ((Number) dropoff.getOrDefault("lon", 72.8697)).doubleValue();
        
        double distanceKm = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111;
        
        List<Map<String, Object>> routes = new ArrayList<>();
        routes.add(Map.of(
            "name", "Fastest Route",
            "distance_km", Math.round(distanceKm * 100.0) / 100.0,
            "duration_minutes", Math.round(distanceKm / 40 * 60),
            "traffic_condition", "Medium",
            "fuel_efficiency", "Medium"
        ));
        
        return Map.of("routes", routes, "recommended", routes.get(0));
    }
    
    // Health check for AI service
    public boolean isAIServiceHealthy() {
        try {
            String url = AI_SERVICE_URL + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }
}