package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AIService;
import com.example.neurofleetbackkendD.service.VehicleService;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerBookingController {
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private VehicleService vehicleService;
    
    @Autowired
    private AuthService authService;
    
    /**
     * Get AI-powered smart vehicle recommendations
     */
    @GetMapping("/smart-recommendations")
    public ResponseEntity<?> getSmartRecommendations(@RequestParam String username) {
        try {
            User customer = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            System.out.println("🤖 Generating AI recommendations for: " + customer.getFullName());
            
            // Get AI recommendations
            Map<String, Object> aiRecommendations = aiService.getRecommendations(customer.getId());
            
            return ResponseEntity.ok(aiRecommendations);
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}