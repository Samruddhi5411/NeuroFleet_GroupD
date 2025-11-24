//package com.example.neurofleetbackkendD.service;
//
//import com.example.neurofleetbackkendD.model.MaintenanceRecord;
//import com.example.neurofleetbackkendD.model.Vehicle;
//import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
//import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
//import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
//import com.example.neurofleetbackkendD.repository.VehicleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.time.LocalDateTime;
//import java.util.*;
//
//@Service
//public class MaintenanceService {
//    
//    @Autowired
//    private MaintenanceRepository maintenanceRepository;
//    
//    @Autowired
//    private VehicleRepository vehicleRepository;
//    
//    @Autowired
//    private AIIntegrationService aiService;
//    
//    public List<MaintenanceRecord> getAllMaintenanceRecords() {
//        return maintenanceRepository.findAll();
//    }
//    
//    public List<MaintenanceRecord> getMaintenanceByVehicle(Long vehicleId) {
//        return maintenanceRepository.findByVehicleId(vehicleId);
//    }
//    
//    public List<MaintenanceRecord> getMaintenanceByStatus(MaintenanceStatus status) {
//        return maintenanceRepository.findByStatus(status);
//    }
//    
//    public MaintenanceRecord createMaintenanceRecord(MaintenanceRecord record) {
//        record.setCreatedAt(LocalDateTime.now());
//        return maintenanceRepository.save(record);
//    }
//    
//    public MaintenanceRecord updateMaintenanceRecord(Long id, MaintenanceRecord updates) {
//        MaintenanceRecord record = maintenanceRepository.findById(id)
//            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
//        
//        if (updates.getStatus() != null) {
//            record.setStatus(updates.getStatus());
//        }
//        if (updates.getActualCost() != null) {
//            record.setActualCost(updates.getActualCost());
//        }
//        if (updates.getNotes() != null) {
//            record.setNotes(updates.getNotes());
//        }
//        if (updates.getStatus() == MaintenanceStatus.COMPLETED) {
//            record.setCompletedDate(LocalDateTime.now());
//        }
//        
//        return maintenanceRepository.save(record);
//    }
//    
//    // AI-POWERED PREDICTIVE MAINTENANCE
//    public Map<String, Object> runPredictiveMaintenance(Long vehicleId) {
//        Vehicle vehicle = vehicleRepository.findById(vehicleId)
//            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//        
//        // Prepare vehicle data for AI
//        Map<String, Object> vehicleData = new HashMap<>();
//        vehicleData.put("healthScore", vehicle.getHealthScore());
//        vehicleData.put("mileage", vehicle.getMileage());
//        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
//        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
//        vehicleData.put("vehicleAge", 
//            java.time.Period.between(
//                vehicle.getCreatedAt().toLocalDate(), 
//                LocalDateTime.now().toLocalDate()
//            ).getYears()
//        );
//        
//        // Get AI prediction
//        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
//        
//        // If maintenance required, create record
//        if ((Boolean) prediction.getOrDefault("maintenanceRequired", false)) {
//            MaintenanceRecord record = new MaintenanceRecord();
//            record.setVehicle(vehicle);
//            record.setIsPredictive(true);
//            record.setIssueType("Predictive Maintenance Alert");
//            record.setDescription("AI detected potential maintenance need");
//            record.setPriority(MaintenancePriority.valueOf(
//                (String) prediction.getOrDefault("priority", "MEDIUM")
//            ));
//            record.setPredictedDaysToFailure(
//                (Integer) prediction.getOrDefault("predictedDaysToFailure", 30)
//            );
//            record.setScheduledDate(LocalDateTime.now().plusDays(3));
//            record.setEstimatedCost(500.0 + Math.random() * 1500);
//            
//            maintenanceRepository.save(record);
//            
//            System.out.println("⚠️ Predictive maintenance record created for vehicle: " + 
//                vehicle.getVehicleNumber());
//        }
//        
//        return prediction;
//    }
//    
//    // Run predictive maintenance for all vehicles
//    public List<Map<String, Object>> runPredictiveMaintenanceForFleet() {
//        List<Vehicle> vehicles = vehicleRepository.findAll();
//        List<Map<String, Object>> results = new ArrayList<>();
//        
//        for (Vehicle vehicle : vehicles) {
//            try {
//                Map<String, Object> prediction = runPredictiveMaintenance(vehicle.getId());
//                prediction.put("vehicleId", vehicle.getId());
//                prediction.put("vehicleNumber", vehicle.getVehicleNumber());
//                results.add(prediction);
//            } catch (Exception e) {
//                System.err.println("❌ Error predicting maintenance for vehicle " + 
//                    vehicle.getVehicleNumber() + ": " + e.getMessage());
//            }
//        }
//        
//        return results;
//    }
//}

package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    // ---------------- CONTROLLER COMPATIBLE METHODS ----------------

    // Controller calls this
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRepository.findAll();
    }

    // Controller uses this
    public List<MaintenanceRecord> getRecordsByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    // For GET /predictive
    public List<MaintenanceRecord> getPredictiveRecords() {
        return maintenanceRepository.findByIsPredictiveTrue();
    }

    // Controller expects this
    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord updates) {
        return updateMaintenanceRecord(id, updates);
    }

    // Controller calls this during POST /predict/{vehicleId}
    public Object predictMaintenanceForVehicle(Long vehicleId) {
        return runPredictiveMaintenance(vehicleId);
    }

    // Controller uses /run-predictive-analysis
    public void runPredictiveMaintenance1() {
        runPredictiveMaintenanceForFleet();
    }


    // ---------------- ORIGINAL METHODS YOU WROTE ----------------

    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }

    public List<MaintenanceRecord> getMaintenanceByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }

    public List<MaintenanceRecord> getMaintenanceByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    public MaintenanceRecord createMaintenanceRecord(MaintenanceRecord record) {
        record.setCreatedAt(LocalDateTime.now());
        return maintenanceRepository.save(record);
    }

    public MaintenanceRecord updateMaintenanceRecord(Long id, MaintenanceRecord updates) {
        MaintenanceRecord record = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));

        if (updates.getStatus() != null) record.setStatus(updates.getStatus());
        if (updates.getActualCost() != null) record.setActualCost(updates.getActualCost());
        if (updates.getNotes() != null) record.setNotes(updates.getNotes());
        if (updates.getStatus() == MaintenanceStatus.COMPLETED)
            record.setCompletedDate(LocalDateTime.now());

        return maintenanceRepository.save(record);
    }


    // ---------------- AI PREDICTIVE MAINTENANCE ----------------

    public Map<String, Object> runPredictiveMaintenance(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        // Prepare AI input
        Map<String, Object> vehicleData = new HashMap<>();
        vehicleData.put("healthScore", vehicle.getHealthScore());
        vehicleData.put("mileage", vehicle.getMileage());
        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
        vehicleData.put("vehicleAge",
            java.time.Period.between(
                vehicle.getCreatedAt().toLocalDate(),
                LocalDateTime.now().toLocalDate()
            ).getYears()
        );

        // AI prediction
        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);

        // Create maintenance record if needed
        if ((Boolean) prediction.getOrDefault("maintenanceRequired", false)) {
            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(vehicle);
            record.setIsPredictive(true);
            record.setIssueType("Predictive Maintenance Alert");
            record.setDescription("AI detected potential maintenance need");
            record.setPriority(MaintenancePriority.valueOf(
                (String) prediction.getOrDefault("priority", "MEDIUM")
            ));
            record.setPredictedDaysToFailure(
                (Integer) prediction.getOrDefault("predictedDaysToFailure", 30)
            );
            record.setScheduledDate(LocalDateTime.now().plusDays(3));
            record.setEstimatedCost(500.0 + Math.random() * 1500);

            maintenanceRepository.save(record);
        }

        return prediction;
    }

    public List<Map<String, Object>> runPredictiveMaintenanceForFleet() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> results = new ArrayList<>();

        for (Vehicle vehicle : vehicles) {
            try {
                Map<String, Object> prediction = runPredictiveMaintenance(vehicle.getId());
                prediction.put("vehicleId", vehicle.getId());
                prediction.put("vehicleNumber", vehicle.getVehicleNumber());
                results.add(prediction);
            } catch (Exception e) {
                System.err.println("Error predicting for " + vehicle.getVehicleNumber());
            }
        }
        return results;
    }
}
