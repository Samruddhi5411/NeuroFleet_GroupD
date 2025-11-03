package com.example.neurofleetbackkendD.controllers;



import com.example.neurofleetbackkendD.service.RouteOptimizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class RouteController {

    @Autowired
    private RouteOptimizationService routeService;

    @PostMapping("/optimize")
    public ResponseEntity<Map<String, Object>> optimizeRoute(
            @RequestParam String pickup,
            @RequestParam String dropoff,
            @RequestParam(defaultValue = "fastest") String preference) {
        
        Map<String, Object> result = routeService.optimizeRoute(pickup, dropoff, preference);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/load-balance")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> optimizeFleetLoad(
            @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<Long> vehicleIds = (List<Long>) request.get("vehicleIds");
        Integer totalBookings = (Integer) request.get("totalBookings");
        
        Map<String, Object> result = routeService.optimizeFleetLoad(vehicleIds, totalBookings);
        return ResponseEntity.ok(result);
    }
}