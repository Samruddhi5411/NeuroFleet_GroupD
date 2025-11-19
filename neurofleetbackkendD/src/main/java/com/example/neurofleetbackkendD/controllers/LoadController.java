package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.Load;
import com.example.neurofleetbackkendD.repository.LoadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loads")
@CrossOrigin(origins = "http://localhost:3000")
public class LoadController {
    
    @Autowired
    private LoadRepository loadRepository;
    
    @GetMapping
    public ResponseEntity<List<Load>> getAllLoads() {
        return ResponseEntity.ok(loadRepository.findAll());
    }
    
    @PostMapping
    public ResponseEntity<Load> createLoad(@RequestBody Load load) {
        load.setLoadId("LOAD-" + System.currentTimeMillis());
        return ResponseEntity.ok(loadRepository.save(load));
    }
    
    @PostMapping("/auto-assign")
    public ResponseEntity<?> autoAssignLoads() {
        // Basic auto-assignment logic
        List<Load> pendingLoads = loadRepository.findByStatus("PENDING");
        
        for (Load load : pendingLoads) {
            load.setStatus("ASSIGNED");
            loadRepository.save(load);
        }
        
        return ResponseEntity.ok(Map.of(
            "message", "Loads auto-assigned successfully",
            "assignedCount", pendingLoads.size()
        ));
    }
}