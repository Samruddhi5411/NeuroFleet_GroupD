package com.example.neurofleetbackkendD.controllers;




import com.example.neurofleetbackkendD.model.Vehicle;

import java.util.List;
import java.util.Random;

//import com.example.neurofleetbackkendD.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.neurofleetbackkendD.repository.VehicleRepository;



@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER', 'CUSTOMER')")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleRepository.findById(id)
                .map(existingVehicle -> {
                    vehicle.setId(id);
                    return ResponseEntity.ok(vehicleRepository.save(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/telemetry")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Vehicle> updateTelemetry(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    // Simulate telemetry updates
                    Random random = new Random();
                    if (vehicle.getIsElectric()) {
                        vehicle.setBatteryLevel(Math.max(0, vehicle.getBatteryLevel() - random.nextInt(5)));
                    } else {
                        vehicle.setFuelLevel(Math.max(0, vehicle.getFuelLevel() - random.nextInt(5)));
                    }
                    vehicle.setLatitude(vehicle.getLatitude() + (random.nextDouble() - 0.5) * 0.01);
                    vehicle.setLongitude(vehicle.getLongitude() + (random.nextDouble() - 0.5) * 0.01);
                    vehicle.setSpeed((double) random.nextInt(100));
                    vehicle.setHealthScore(Math.max(60, 100.0 - random.nextInt(40)));
                    
                    return ResponseEntity.ok(vehicleRepository.save(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(@PathVariable String status) {
        List<Vehicle> vehicles = vehicleRepository.findByStatus(VehicleStatus.valueOf(status));
        return ResponseEntity.ok(vehicles);
    }
}