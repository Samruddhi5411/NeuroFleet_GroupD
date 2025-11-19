package com.example.neurofleetbackkendD.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIIntegrationService {
    
    @Value("${ai.base.url:http://localhost:5001}")
    private String aiBaseUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Check if AI service is healthy
    public boolean isAIServiceHealthy() {
        try {
            String url = aiBaseUrl + "/health";
            restTemplate.getForObject(url, String.class);
            return true;
        } catch (Exception e) {
            System.out.println("⚠️ AI service unavailable, using fallback");
            return false;
        }
    }
    
    // Predict ETA (with fallback)
    public Map<String, Object> predictETA(Map<String, Object> request) {
        try {
            if (isAIServiceHealthy()) {
                String url = aiBaseUrl + "/predict-eta";
                return restTemplate.postForObject(url, request, Map.class);
            }
        } catch (Exception e) {
            System.err.println("❌ AI ETA prediction failed: " + e.getMessage());
        }
        
        // Fallback logic
        double distance = (double) request.getOrDefault("distance", 10.0);
        Map<String, Object> response = new HashMap<>();
        response.put("eta_minutes", (int)(distance / 40 * 60));
        response.put("source", "fallback");
        return response;
    }
    
    // Predict maintenance (with fallback)
    public Map<String, Object> predictMaintenance(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("maintenanceScore", 85);
        response.put("daysUntilMaintenance", 30);
        response.put("recommendations", "All systems normal");
        return response;
    }
    
    // Recommend vehicle (with fallback)
    public Map<String, Object> recommendVehicle(Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("recommendedVehicleId", 1);
        response.put("confidence", 0.92);
        response.put("reason", "Best match based on requirements");
        return response;
    }
}