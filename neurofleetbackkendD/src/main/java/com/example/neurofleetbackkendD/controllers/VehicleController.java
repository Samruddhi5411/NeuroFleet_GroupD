package com.example.neurofleetbackkendD.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.service.VehicleService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping("/admin/vehicles")
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            System.out.println("✅ Retrieved " + vehicles.size() + " vehicles for admin");
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("❌ Error getting vehicles: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/manager/vehicles")
    public ResponseEntity<?> getVehiclesForManager() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            System.out.println("✅ Manager retrieved " + vehicles.size() + " vehicles");
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/customer/vehicles")
    public ResponseEntity<?> getAvailableVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAvailableVehicles();
            System.out.println("✅ Retrieved " + vehicles.size() + " available vehicles for customer");
            
            if (vehicles.isEmpty()) {
                System.out.println("⚠️ No available vehicles found");
            }
            
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("❌ Error getting available vehicles: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/customer/vehicles/search")
    public ResponseEntity<?> searchVehicles(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isElectric,
            @RequestParam(required = false) Integer minCapacity) {
        try {
            List<Vehicle> vehicles = vehicleService.getAvailableVehicles();
            
            // Filter by type
            if (type != null && !type.isEmpty()) {
                vehicles = vehicles.stream()
                    .filter(v -> v.getType().name().equalsIgnoreCase(type))
                    .collect(Collectors.toList());
            }
            
            // Filter by electric
            if (isElectric != null) {
                vehicles = vehicles.stream()
                    .filter(v -> v.getIsElectric().equals(isElectric))
                    .collect(Collectors.toList());
            }
            
            // Filter by capacity
            if (minCapacity != null) {
                vehicles = vehicles.stream()
                    .filter(v -> v.getCapacity() >= minCapacity)
                    .collect(Collectors.toList());
            }
            
            System.out.println("✅ Search returned " + vehicles.size() + " vehicles");
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.err.println("❌ Error searching vehicles: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vehicles/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/admin/vehicles")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.createVehicle(vehicle));
    }
    
    @PutMapping("/admin/vehicles/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, 
                                          @RequestBody Vehicle vehicle) {
        try {
            return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/admin/vehicles/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
