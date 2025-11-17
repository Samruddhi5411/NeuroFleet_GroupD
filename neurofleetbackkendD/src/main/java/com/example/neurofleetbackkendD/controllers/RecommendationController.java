package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import com.example.neurofleetbackkendD.service.SmartRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {
    
    @Autowired
    private SmartRecommendationService recommendationService;
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/smart")
    public ResponseEntity<?> getSmartRecommendations(
            @RequestParam String username,
            @RequestBody Map<String, Object> filters) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            return ResponseEntity.ok(
                recommendationService.getSmartRecommendations(customer.getId(), filters));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vehicle/{vehicleId}/availability")
    public ResponseEntity<?> getVehicleAvailability(
            @PathVariable Long vehicleId,
            @RequestParam(required = false) String startDate,
            @RequestParam(defaultValue = "30") int days) {
        try {
            LocalDateTime start = startDate != null ? 
                LocalDateTime.parse(startDate) : LocalDateTime.now();
            
            return ResponseEntity.ok(
                recommendationService.getVehicleAvailabilityCalendar(vehicleId, start, days));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/search")
    public ResponseEntity<?> searchVehicles(@RequestBody Map<String, Object> searchParams) {
        try {
            return ResponseEntity.ok(recommendationService.searchVehicles(searchParams));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
