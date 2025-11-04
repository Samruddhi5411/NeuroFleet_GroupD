package com.example.neurofleetbackkendD.controllers;




import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;

import java.util.List;
import java.util.Random;

//import com.example.neurofleetbackkendD.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.service.VehicleService;


@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // Get all vehicles
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'CUSTOMER', 'DRIVER')")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        System.out.println("📋 GET /api/vehicles - Fetching all vehicles");
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // Get vehicle by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        System.out.println("🔍 GET /api/vehicles/" + id);
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new vehicle
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        System.out.println("➕ POST /api/vehicles - Creating: " + vehicle.getVehicleNumber());
        Vehicle savedVehicle = vehicleService.createVehicle(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    // Update vehicle
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        System.out.println("✏️ PUT /api/vehicles/" + id);
        try {
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
            return ResponseEntity.ok(updatedVehicle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/vehicles/" + id);
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok().build();
    }

    // Update telemetry (simulate GPS, battery, etc.)
    @PutMapping("/{id}/telemetry")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> updateTelemetry(@PathVariable Long id) {
        System.out.println("📡 PUT /api/vehicles/" + id + "/telemetry - Updating telemetry");
        try {
            Vehicle updatedVehicle = vehicleService.updateTelemetry(id);
            return ResponseEntity.ok(updatedVehicle);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get vehicles by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(@PathVariable String status) {
        System.out.println("🔍 GET /api/vehicles/status/" + status);
        List<Vehicle> vehicles = vehicleService.getVehiclesByStatus(VehicleStatus.valueOf(status));
        return ResponseEntity.ok(vehicles);
    }
}
