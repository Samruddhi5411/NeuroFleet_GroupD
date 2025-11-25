package com.example.neurofleetbackkendD.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class AIServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;
    
    public AIServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    // ETA Prediction
    public Map<String, Object> predictETA(Double pickupLat, Double pickupLon, 
                                          Double dropoffLat, Double dropoffLon,
                                          Double vehicleHealth, Boolean isElectric) {
        String url = aiServiceUrl + "/predict/eta";
        
        Map<String, Object> request = new HashMap<>();
        request.put("pickupLat", pickupLat);
        request.put("pickupLon", pickupLon);
        request.put("dropoffLat", dropoffLat);
        request.put("dropoffLon", dropoffLon);
        request.put("vehicleHealth", vehicleHealth != null ? vehicleHealth : 0.85);
        request.put("isElectric", isElectric != null ? isElectric : false);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error calling AI service: " + e.getMessage());
            return null;
        }
    }
    
    // Vehicle Recommendations
    public List<Map<String, Object>> recommendVehicles(Double pickupLat, Double pickupLon,
                                                        Integer passengers, Boolean preferElectric) {
        String url = aiServiceUrl + "/recommend/vehicles";
        
        Map<String, Object> request = new HashMap<>();
        request.put("pickupLat", pickupLat);
        request.put("pickupLon", pickupLon);
        request.put("passengers", passengers != null ? passengers : 1);
        request.put("preferElectric", preferElectric != null ? preferElectric : false);
        request.put("topN", 5);
        
        try {
            ResponseEntity<List> response = restTemplate.postForEntity(url, request, List.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error calling AI service: " + e.getMessage());
            return Collections.emptyList();
        }
    }
    
    // Maintenance Prediction
    public Map<String, Object> predictMaintenance(Long vehicleId) {
        String url = aiServiceUrl + "/predict/maintenance/" + vehicleId;
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error calling AI service: " + e.getMessage());
            return null;
        }
    }
    
    // Train Models
    public Map<String, Object> trainModels() {
        String url = aiServiceUrl + "/train";
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, null, Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Error calling AI service: " + e.getMessage());
            return null;
        }
    }
}