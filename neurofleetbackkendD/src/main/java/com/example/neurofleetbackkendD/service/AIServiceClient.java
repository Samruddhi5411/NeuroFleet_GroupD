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
    
    //  ETA Prediction
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
            System.out.println("📡 Calling AI Service ETA: " + url);
            System.out.println("📊 Request: " + request);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            System.out.println("✅ AI ETA Response: " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ Error calling AI ETA service: " + e.getMessage());
            e.printStackTrace();
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
            System.out.println("📡 Calling AI Service Recommendations: " + url);
            System.out.println("📊 Request: " + request);
            
            ResponseEntity<List> response = restTemplate.postForEntity(url, request, List.class);
            List<Map<String, Object>> recommendations = response.getBody();
            
            System.out.println("✅ AI Recommendations Response: " + recommendations);
            System.out.println("📊 Number of recommendations: " + (recommendations != null ? recommendations.size() : 0));
            
            return recommendations != null ? recommendations : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("❌ Error calling AI recommendation service: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    //  Maintenance Prediction
    public Map<String, Object> predictMaintenance(Long vehicleId) {
        String url = aiServiceUrl + "/predict/maintenance/" + vehicleId;
        
        try {
            System.out.println("📡 Calling AI Service Maintenance: " + url);
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            System.out.println("✅ AI Maintenance Response: " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ Error calling AI maintenance service: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    // Get all maintenance predictions
    public List<Map<String, Object>> predictAllMaintenance() {
        String url = aiServiceUrl + "/predict/maintenance/all";
        
        try {
            System.out.println("📡 Calling AI Service All Maintenance: " + url);
            
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List<Map<String, Object>> predictions = response.getBody();
            
            System.out.println("✅ AI All Maintenance Response: " + predictions);
            System.out.println("📊 Number of predictions: " + (predictions != null ? predictions.size() : 0));
            
            return predictions != null ? predictions : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("❌ Error calling AI all maintenance service: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
    
    //  Train Models
    public Map<String, Object> trainModels() {
        String url = aiServiceUrl + "/train";
        
        try {
            System.out.println("📡 Calling AI Service Train: " + url);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, null, Map.class);
            
            System.out.println("✅ AI Train Response: " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("❌ Error calling AI train service: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}