package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import com.example.neurofleetbackkendD.service.MaintenanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    // Get all maintenance records
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        System.out.println("📋 GET /api/maintenance - Fetching all maintenance");
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    // Get maintenance by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        System.out.println("🔍 GET /api/maintenance/" + id);
        return maintenanceService.getMaintenanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get maintenance by vehicle
    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Maintenance>> getByVehicle(@PathVariable Long vehicleId) {
        System.out.println("🔍 GET /api/maintenance/vehicle/" + vehicleId);
        return ResponseEntity.ok(maintenanceService.getMaintenanceByVehicle(vehicleId));
    }

    // Get predictive maintenance
    @GetMapping("/predictive")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<List<Maintenance>> getPredictive() {
        System.out.println("🤖 GET /api/maintenance/predictive - AI predictions");
        return ResponseEntity.ok(maintenanceService.getPredictiveMaintenance());
    }

    // Create maintenance
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Maintenance> createMaintenance(@RequestBody Maintenance maintenance) {
        System.out.println("➕ POST /api/maintenance - Creating record");
        return ResponseEntity.ok(maintenanceService.createMaintenance(maintenance));
    }

    // Update maintenance
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MANAGER')")
    public ResponseEntity<Maintenance> updateMaintenance(@PathVariable Long id, @RequestBody Maintenance maintenance) {
        System.out.println("✏️ PUT /api/maintenance/" + id);
        try {
            Maintenance updated = maintenanceService.updateMaintenance(id, maintenance);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete maintenance
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        System.out.println("🗑️ DELETE /api/maintenance/" + id);
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok().build();
    }
}