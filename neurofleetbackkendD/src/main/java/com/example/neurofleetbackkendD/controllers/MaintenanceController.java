package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;

import com.example.neurofleetbackkendD.service.MaintenanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MaintenanceController {
    
    @Autowired
    private MaintenanceService maintenanceService;
    
    
//    @GetMapping("/admin/maintenance")  // Add this line
//    public ResponseEntity<List<MaintenanceRecord>> getAllRecords11() {
//        return ResponseEntity.ok(maintenanceService.getAllRecords());
//    }
    @GetMapping("/maintenance")
    public ResponseEntity<List<MaintenanceRecord>> getAllRecords1() {
        return ResponseEntity.ok(maintenanceService.getAllRecords());
    }
    
    @GetMapping
    public ResponseEntity<List<MaintenanceRecord>> getAllRecords() {
        return ResponseEntity.ok(maintenanceService.getAllRecords());
    }
    
    @GetMapping("/predictive")
    public ResponseEntity<List<MaintenanceRecord>> getPredictiveRecords() {
        return ResponseEntity.ok(maintenanceService.getPredictiveRecords());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MaintenanceRecord>> getRecordsByStatus(
            @PathVariable MaintenanceStatus status) {
        return ResponseEntity.ok(maintenanceService.getRecordsByStatus(status));
    }
  
    
//    @PostMapping
//    public ResponseEntity<MaintenanceRecord> createRecord(
//            @RequestBody MaintenanceRecord record) {
//        return ResponseEntity.ok(maintenanceService.createRecord(record));
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecord(@PathVariable Long id, 
                                         @RequestBody MaintenanceRecord record) {
        try {
            return ResponseEntity.ok(maintenanceService.updateRecord(id, record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/predict/{vehicleId}")
    public ResponseEntity<?> predictForVehicle(@PathVariable Long vehicleId) {
        try {
            MaintenanceRecord prediction = 
                (MaintenanceRecord) maintenanceService.predictMaintenanceForVehicle(vehicleId);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/run-predictive-analysis")
    public ResponseEntity<?> runPredictiveAnalysis() {
        try {
            maintenanceService.runPredictiveMaintenance1();
            return ResponseEntity.ok(Map.of("message", "Predictive analysis completed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
