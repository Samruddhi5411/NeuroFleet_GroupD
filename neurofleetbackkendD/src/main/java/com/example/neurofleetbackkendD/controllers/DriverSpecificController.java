package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import com.example.neurofleetbackkendD.service.AuthService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('DRIVER')")
public class DriverSpecificController {
	 @Autowired
	    private DashboardService dashboardService;
	    
	    @Autowired
	    private AuthService authService;
	    
	    @GetMapping("/overview")
	    public ResponseEntity<?> getDriverOverview(@RequestParam String username) {
	        try {
	            var driver = authService.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("Driver not found"));
	            return ResponseEntity.ok(dashboardService.getDriverDashboard(driver.getId()));
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
	        }
	    }
	}