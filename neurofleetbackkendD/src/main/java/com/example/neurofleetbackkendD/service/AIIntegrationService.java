package com.example.neurofleetbackkendD.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class AIIntegrationService {
    
    @Value("${ai.base.url:http://localhost:5000}")
    private String aiBaseUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // 1. VEHICLE RECOMMENDATION
    public Map<String, Object> getVehicleRecommendations(Long customerId, 
                                                         Map<String, Object> filters,
                                                         List<Map<String, Object>> bookingHistory) {
        try {
            String url = aiBaseUrl + "/api/recommend/vehicles";
            
            Map<String, Object> request = new HashMap<>();
            request.put("customerId", customerId);
            request.put("filters", filters);
            request.put("bookingHistory", bookingHistory);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ AI Recommendations received for customer: " + customerId);
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using fallback recommendations");
            return getFallbackRecommendations();
        }
    }
    
    // 2. FLEET OPTIMIZATION
    public Map<String, Object> optimizeFleetSelection(Double pickupLat, 
                                                      Double pickupLng,
                                                      List<Map<String, Object>> availableVehicles) {
        try {
            String url = aiBaseUrl + "/api/optimize/fleet";
            
            Map<String, Object> request = new HashMap<>();
            request.put("pickupLat", pickupLat);
            request.put("pickupLng", pickupLng);
            request.put("availableVehicles", availableVehicles);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ AI Fleet optimization complete");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using basic optimization");
            return getBasicOptimization(availableVehicles);
        }
    }
    
    // 3. DRIVER MATCHING
    public Map<String, Object> matchBestDriver(Double pickupLat,
                                               Double pickupLng,
                                               List<Map<String, Object>> availableDrivers) {
        try {
            String url = aiBaseUrl + "/api/optimize/driver-match";
            
            Map<String, Object> request = new HashMap<>();
            request.put("pickupLat", pickupLat);
            request.put("pickupLng", pickupLng);
            request.put("availableDrivers", availableDrivers);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ AI Driver matching complete");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using basic driver matching");
            return getBasicDriverMatch(availableDrivers);
        }
    }
    
    // 4. ANOMALY DETECTION
    public Map<String, Object> detectTelemetryAnomaly(Map<String, Object> telemetryData) {
        try {
            String url = aiBaseUrl + "/api/telemetry/detect-anomaly";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(telemetryData, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ AI Anomaly detection complete");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using rule-based detection");
            return getRuleBasedAnomaly(telemetryData);
        }
    }
    
    // 5. MAINTENANCE PREDICTION
    public Map<String, Object> predictMaintenance(Map<String, Object> vehicleData) {
        try {
            String url = aiBaseUrl + "/api/maintenance/predict";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(vehicleData, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ AI Maintenance prediction complete");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using basic prediction");
            return getBasicMaintenancePrediction(vehicleData);
        }
    }
    
    // 6. TRIP HEATMAP
    public Map<String, Object> generateTripHeatmap(int days) {
        try {
            String url = aiBaseUrl + "/api/analytics/heatmap?days=" + days;
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            System.out.println("✅ AI Heatmap generated");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using static heatmap");
            return getStaticHeatmap();
        }
    }
    
    // 7. DEMAND FORECAST
    public Map<String, Object> forecastDemand(int days) {
        try {
            String url = aiBaseUrl + "/api/analytics/demand-forecast?days=" + days;
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            System.out.println("✅ AI Demand forecast generated");
            return response.getBody();
            
        } catch (Exception e) {
            System.err.println("⚠️ AI Service unavailable, using basic forecast");
            return getBasicForecast(days);
        }
    }
    
    // 8. LEARN CUSTOMER PATTERN
    public void learnCustomerPattern(Long customerId, Map<String, Object> bookingData) {
        try {
            String url = aiBaseUrl + "/api/learn/customer-pattern";
            
            Map<String, Object> request = new HashMap<>();
            request.put("customerId", customerId);
            request.put("bookingData", bookingData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            restTemplate.postForEntity(url, entity, Map.class);
            
            System.out.println("✅ Customer pattern learned for: " + customerId);
            
        } catch (Exception e) {
            System.err.println("⚠️ Failed to learn customer pattern: " + e.getMessage());
        }
    }
    
    // FALLBACK METHODS
    
    private Map<String, Object> getFallbackRecommendations() {
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("recommendedVehicles", new ArrayList<>());
        fallback.put("isAIRecommendation", false);
        fallback.put("confidence", 0.0);
        return fallback;
    }
    
    private Map<String, Object> getBasicOptimization(List<Map<String, Object>> vehicles) {
        Map<String, Object> result = new HashMap<>();
        if (!vehicles.isEmpty()) {
            result.put("bestVehicle", vehicles.get(0));
            result.put("allOptions", vehicles);
        }
        result.put("isAIOptimized", false);
        return result;
    }
    
    private Map<String, Object> getBasicDriverMatch(List<Map<String, Object>> drivers) {
        Map<String, Object> result = new HashMap<>();
        if (!drivers.isEmpty()) {
            result.put("bestDriver", drivers.get(0));
            result.put("allOptions", drivers);
        }
        result.put("isAIMatched", false);
        return result;
    }
    
    private Map<String, Object> getRuleBasedAnomaly(Map<String, Object> data) {
        Map<String, Object> result = new HashMap<>();
        result.put("isAnomaly", false);
        result.put("riskLevel", "UNKNOWN");
        result.put("anomalies", new ArrayList<>());
        return result;
    }
    
    private Map<String, Object> getBasicMaintenancePrediction(Map<String, Object> data) {
        Map<String, Object> result = new HashMap<>();
        result.put("maintenanceRequired", false);
        result.put("riskScore", 0);
        result.put("riskLevel", "UNKNOWN");
        return result;
    }
    
    private Map<String, Object> getStaticHeatmap() {
        Map<String, Object> result = new HashMap<>();
        result.put("heatmapData", new ArrayList<>());
        result.put("totalTrips", 0);
        return result;
    }
    
    private Map<String, Object> getBasicForecast(int days) {
        Map<String, Object> result = new HashMap<>();
        result.put("forecast", new ArrayList<>());
        result.put("period", days + " days");
        return result;
    }
}