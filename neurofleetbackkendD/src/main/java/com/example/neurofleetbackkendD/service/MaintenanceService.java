package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MaintenanceService {
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private AIIntegrationService aiService;
    
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRepository.findAll();
    }
    
    public List<MaintenanceRecord> getPredictiveRecords() {
        return maintenanceRepository.findByIsPredictive(true);
    }
    
    public List<MaintenanceRecord> getRecordsByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status.name());
    }
    
    public MaintenanceRecord createRecord(MaintenanceRecord record) {
        record.setCreatedAt(LocalDateTime.now());
        return maintenanceRepository.save(record);
    }
    
    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord record) {
        MaintenanceRecord existing = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
        
        existing.setIssueType(record.getIssueType());
        existing.setDescription(record.getDescription());
        existing.setPriority(record.getPriority());
        existing.setStatus(record.getStatus());
        existing.setScheduledDate(record.getScheduledDate());
        existing.setEstimatedCost(record.getEstimatedCost());
        existing.setMechanicAssigned(record.getMechanicAssigned());
        
        if (record.getStatus() == MaintenanceStatus.COMPLETED) {
            existing.setCompletedDate(LocalDateTime.now());
        }
        
        return maintenanceRepository.save(existing);
    }
    
    // AI-powered predictive maintenance check (runs daily)
    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM daily
    @Transactional
    public void runPredictiveMaintenance() {
        System.out.println("🔍 Running AI Predictive Maintenance Analysis...");
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        int predictionsCreated = 0;
        
        for (Vehicle vehicle : vehicles) {
            Map<String, Object> vehicleData = new HashMap<>();
            vehicleData.put("healthScore", vehicle.getHealthScore());
            vehicleData.put("mileage", vehicle.getMileage());
            vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
            vehicleData.put("fuelLevel", vehicle.getFuelLevel());
            vehicleData.put("kmsSinceService", vehicle.getMileage() % 5000); // Mock data
            
            Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
            
            int riskScore = ((Number) prediction.get("risk_score")).intValue();
            
            if (riskScore > 40) { // Only create record if significant risk
                MaintenanceRecord record = new MaintenanceRecord();
                record.setVehicle(vehicle);
                record.setIssueType("Predictive Maintenance Alert");
                record.setDescription(String.join(", ", 
                    (List<String>) prediction.get("issues")));
                record.setRiskScore(riskScore);
                record.setPredictedDaysToFailure(
                    ((Number) prediction.get("predicted_days_to_failure")).intValue());
                record.setIsPredictive(true);
                
                String priorityStr = (String) prediction.get("priority");
                record.setPriority(MaintenancePriority.valueOf(priorityStr));
                record.setStatus(MaintenanceStatus.PENDING);
                record.setEstimatedCost(2000.0 + (riskScore * 50.0));
                
                maintenanceRepository.save(record);
                predictionsCreated++;
            }
        }
        
        System.out.println("✅ Predictive Maintenance Complete. Created " + 
            predictionsCreated + " new alerts.");
    }
    
    // Manual prediction for a specific vehicle
    @Transactional
    public MaintenanceRecord predictMaintenanceForVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        Map<String, Object> vehicleData = new HashMap<>();
        vehicleData.put("healthScore", vehicle.getHealthScore());
        vehicleData.put("mileage", vehicle.getMileage());
        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
        vehicleData.put("kmsSinceService", vehicle.getMileage() % 5000);
        
        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
        
        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicle(vehicle);
        record.setIssueType("AI Maintenance Prediction");
        record.setDescription(String.join(", ", 
            (List<String>) prediction.get("issues")));
        record.setRiskScore(((Number) prediction.get("risk_score")).intValue());
        record.setPredictedDaysToFailure(
            ((Number) prediction.get("predicted_days_to_failure")).intValue());
        record.setIsPredictive(true);
        
        String priorityStr = (String) prediction.get("priority");
        record.setPriority(MaintenancePriority.valueOf(priorityStr));
        record.setStatus(MaintenanceStatus.PENDING);
        record.setEstimatedCost(2000.0 + (record.getRiskScore() * 50.0));
        
        return maintenanceRepository.save(record);
    }
}
