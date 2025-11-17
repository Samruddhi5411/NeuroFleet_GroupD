package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ManagerSpecificController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/overview")
    public ResponseEntity<?> getManagerOverview() {
        return ResponseEntity.ok(dashboardService.getManagerDashboard());
    }
}