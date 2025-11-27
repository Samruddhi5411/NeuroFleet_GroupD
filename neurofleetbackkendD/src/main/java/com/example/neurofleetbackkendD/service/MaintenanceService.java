package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceService {
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    
     // Get all maintenance records
     
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRepository.findAll();
    }
    
    /**
     * Get all maintenance records (alias)
     */
    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }
    
    
     //Get predictive maintenance records
    
    public List<MaintenanceRecord> getPredictiveRecords() {
        return maintenanceRepository.findByStatus(MaintenanceStatus.PREDICTIVE);
    }
    
    
     //Get records by status
     
    public List<MaintenanceRecord> getRecordsByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }
    
    
     // Get records by vehicle
     
    public List<MaintenanceRecord> getRecordsByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }
    
    
     // Create maintenance record
     
    @Transactional
    public MaintenanceRecord createRecord(MaintenanceRecord record) {
        record.setCreatedAt(LocalDateTime.now());
        
        // Update vehicle status if high priority
        if (record.getPriority() == MaintenancePriority.HIGH) {
            Vehicle vehicle = record.getVehicle();
            vehicle.setStatus(VehicleStatus.MAINTENANCE);
            vehicleRepository.save(vehicle);
        }
        
        MaintenanceRecord saved = maintenanceRepository.save(record);
        
        // Send notification
        notificationService.notifyMaintenanceAlert(saved);
        
        return saved;
    }
    
    
     // Update maintenance record
     
    @Transactional
    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord updates) {
        MaintenanceRecord record = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
        
        if (updates.getStatus() != null) {
            record.setStatus(updates.getStatus());
            
            // If completed, set vehicle back to available
            if (updates.getStatus() == MaintenanceStatus.COMPLETED) {
                Vehicle vehicle = record.getVehicle();
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle);
            }
        }
        
        if (updates.getPriority() != null) {
            record.setPriority(updates.getPriority());
        }
        
        if (updates.getDescription() != null) {
            record.setDescription(updates.getDescription());
        }
        
        if (updates.getEstimatedCost() != null) {
            record.setEstimatedCost(updates.getEstimatedCost());
        }

        if (updates.getActualCost() != null) {
            record.setActualCost(updates.getActualCost());
        }

        
        return maintenanceRepository.save(record);
    }
    
    
    // Predict maintenance for a vehicle
     
    public MaintenanceRecord predictMaintenanceForVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        // Simple prediction logic based on health score
        if (vehicle.getHealthScore() < 60) {
            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(vehicle);
            record.setIssueType("Predictive Maintenance Required");
            record.setStatus(MaintenanceStatus.PREDICTIVE);
            record.setPriority(MaintenancePriority.MEDIUM);
            record.setRiskScore((double) (100 - vehicle.getHealthScore()));

            record.setCreatedAt(LocalDateTime.now());
            
            return maintenanceRepository.save(record);
        }
        
        return null;
    }
    
    
     // Run predictive maintenance for all vehicles
     
    @Transactional
    public void runPredictiveMaintenance1() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        int predictedCount = 0;
        
        for (Vehicle vehicle : vehicles) {
            // Check if vehicle needs maintenance
            if (vehicle.getHealthScore() < 70 && 
                vehicle.getStatus() != VehicleStatus.MAINTENANCE) {
                
                // Check if prediction already exists
                List<MaintenanceRecord> existing = maintenanceRepository
                    .findByVehicleIdAndStatus(vehicle.getId(), MaintenanceStatus.PREDICTIVE);
                
                if (existing.isEmpty()) {
                    MaintenanceRecord record = new MaintenanceRecord();
                    record.setVehicle(vehicle);
                    record.setIssueType("Predictive Maintenance - Low Health Score");
                    record.setStatus(MaintenanceStatus.PREDICTIVE);
                    record.setDescription("Vehicle health score: " + vehicle.getHealthScore() + "%");
                    
                    // Determine priority based on health score
                    if (vehicle.getHealthScore() < 50) {
                        record.setPriority(MaintenancePriority.HIGH);
                    } else if (vehicle.getHealthScore() < 60) {
                        record.setPriority(MaintenancePriority.MEDIUM);
                    } else {
                        record.setPriority(MaintenancePriority.LOW);
                    }
                    
                    record.setRiskScore((double) (100 - vehicle.getHealthScore()));

                    record.setCreatedAt(LocalDateTime.now());
                    
                    maintenanceRepository.save(record);
                    predictedCount++;
                }
            }
        }
        
        System.out.println("✅ Predictive maintenance completed. " + predictedCount + " new predictions.");
    }
}