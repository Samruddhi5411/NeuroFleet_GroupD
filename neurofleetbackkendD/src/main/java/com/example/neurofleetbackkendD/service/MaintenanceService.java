//package com.example.neurofleetbackkendD.service;
//
//import com.example.neurofleetbackkendD.model.MaintenanceRecord;
//import com.example.neurofleetbackkendD.model.Vehicle;
//import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
//import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
//import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
//import com.example.neurofleetbackkendD.repository.VehicleRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
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
//    private AIService aiService;
//    
//    @Autowired
//    private NotificationService notificationService;
//    
//    public List<MaintenanceRecord> getAllRecords() {
//        return maintenanceRepository.findAll();
//    }
//    
//    public List<MaintenanceRecord> getPredictiveRecords() {
//        return maintenanceRepository.findByIsPredictive(true);
//    }
//    
//    public List<MaintenanceRecord> getRecordsByStatus(MaintenanceStatus status) {
//        return maintenanceRepository.findByStatus(status.name());
//    }
//    
//    public MaintenanceRecord createRecord(MaintenanceRecord record) {
//        record.setCreatedAt(LocalDateTime.now());
//        return maintenanceRepository.save(record);
//    }
//    
//    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord record) {
//        MaintenanceRecord existing = maintenanceRepository.findById(id)
//            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
//        
//        existing.setIssueType(record.getIssueType());
//        existing.setDescription(record.getDescription());
//        existing.setPriority(record.getPriority());
//        existing.setStatus(record.getStatus());
//        existing.setScheduledDate(record.getScheduledDate());
//        existing.setEstimatedCost(record.getEstimatedCost());
//        existing.setMechanicAssigned(record.getMechanicAssigned());
//        
//        if (record.getStatus() == MaintenanceStatus.COMPLETED) {
//            existing.setCompletedDate(LocalDateTime.now());
//        }
//        
//        return maintenanceRepository.save(existing);
//    }
//    
////    // AI-powered predictive maintenance check (runs daily)
////    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM daily
////    @Transactional
////    public void runPredictiveMaintenance() {
////        System.out.println("🔍 Running AI Predictive Maintenance Analysis...");
////        
////        List<Vehicle> vehicles = vehicleRepository.findAll();
////        int predictionsCreated = 0;
////        
////        for (Vehicle vehicle : vehicles) {
////            Map<String, Object> vehicleData = new HashMap<>();
////            vehicleData.put("healthScore", vehicle.getHealthScore());
////            vehicleData.put("mileage", vehicle.getMileage());
////            vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
////            vehicleData.put("fuelLevel", vehicle.getFuelLevel());
////            vehicleData.put("kmsSinceService", vehicle.getMileage() % 5000); // Mock data
////            
////            Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
////            
////            int riskScore = ((Number) prediction.get("risk_score")).intValue();
////            
////            if (riskScore > 40) { // Only create record if significant risk
////                MaintenanceRecord record = new MaintenanceRecord();
////                record.setVehicle(vehicle);
////                record.setIssueType("Predictive Maintenance Alert");
////                record.setDescription(String.join(", ", 
////                    (List<String>) prediction.get("issues")));
////                record.setRiskScore(riskScore);
////                record.setPredictedDaysToFailure(
////                    ((Number) prediction.get("predicted_days_to_failure")).intValue());
////                record.setIsPredictive(true);
////                
////                String priorityStr = (String) prediction.get("priority");
////                record.setPriority(MaintenancePriority.valueOf(priorityStr));
////                record.setStatus(MaintenanceStatus.PENDING);
////                record.setEstimatedCost(2000.0 + (riskScore * 50.0));
////                
////                maintenanceRepository.save(record);
////                predictionsCreated++;
////            }
////        }
////        
////        System.out.println("✅ Predictive Maintenance Complete. Created " + 
////            predictionsCreated + " new alerts.");
////    }
////    
////    // Manual prediction for a specific vehicle
////    @Transactional
////    public MaintenanceRecord predictMaintenanceForVehicle(Long vehicleId) {
////        Vehicle vehicle = vehicleRepository.findById(vehicleId)
////            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
////        
////        Map<String, Object> vehicleData = new HashMap<>();
////        vehicleData.put("healthScore", vehicle.getHealthScore());
////        vehicleData.put("mileage", vehicle.getMileage());
////        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
////        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
////        vehicleData.put("kmsSinceService", vehicle.getMileage() % 5000);
////        
////        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
////        
////        MaintenanceRecord record = new MaintenanceRecord();
////        record.setVehicle(vehicle);
////        record.setIssueType("AI Maintenance Prediction");
////        record.setDescription(String.join(", ", 
////            (List<String>) prediction.get("issues")));
////        record.setRiskScore(((Number) prediction.get("risk_score")).intValue());
////        record.setPredictedDaysToFailure(
////            ((Number) prediction.get("predicted_days_to_failure")).intValue());
////        record.setIsPredictive(true);
////        
////        String priorityStr = (String) prediction.get("priority");
////        record.setPriority(MaintenancePriority.valueOf(priorityStr));
////        record.setStatus(MaintenanceStatus.PENDING);
////        record.setEstimatedCost(2000.0 + (record.getRiskScore() * 50.0));
////        
////        return maintenanceRepository.save(record);
////    }
////}
// // Predict maintenance using AI
//    public MaintenanceRecord predictMaintenanceForVehicle(Long vehicleId) {
//        Vehicle vehicle = vehicleRepository.findById(vehicleId)
//            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//        Map<String, Object> vehicleData = new HashMap<>();
//        vehicleData.put("vehicleId", vehicle.getId());
//        vehicleData.put("mileage", vehicle.getMileage());
//        vehicleData.put("healthScore", vehicle.getHealthScore());
//        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
//        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
//        vehicleData.put("lastServiceDate", vehicle.getLastUpdated());
//        
//        // Call AI service
//        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
//        
//        // Create maintenance record if risk is high
//        boolean maintenanceRequired = (boolean) prediction.getOrDefault("maintenanceRequired", false);
//        int riskScore = (int) prediction.getOrDefault("riskScore", 0);
//        
//        if (maintenanceRequired || riskScore > 70) {
//            MaintenanceRecord record = new MaintenanceRecord();
//            record.setVehicle(vehicle);
//            record.setIssueType("PREDICTIVE_CHECK");
//            record.setDescription((String) prediction.getOrDefault("recommendations", "Scheduled maintenance required"));
//            record.setRiskScore(riskScore);
//            record.setIsPredictive(true);
//            record.setStatus(MaintenanceStatus.SCHEDULED);
//            
//            // Set priority based on risk score
//            if (riskScore >= 80) {
//                record.setPriority(MaintenancePriority.URGENT);
//            } else if (riskScore >= 60) {
//                record.setPriority(MaintenancePriority.HIGH);
//            } else {
//                record.setPriority(MaintenancePriority.MEDIUM);
//            }
//            
//            record.setScheduledDate(LocalDateTime.now().plusDays(
//                (int) prediction.getOrDefault("daysUntilMaintenance", 7)
//            ));
//            
//            record = maintenanceRepository.save(record);
//            
//            // Send notification
//            notificationService.notifyMaintenanceAlert(record);
//            
//            System.out.println("🔧 Predictive maintenance scheduled for vehicle: " + 
//                              vehicle.getVehicleNumber() + " | Risk: " + riskScore);
//            
//            return record;
//        }
//        
//        return null;
//    }
//
//    // Run predictive maintenance for all vehicles
//    public void runPredictiveMaintenance1() {
//        List<Vehicle> vehicles = vehicleRepository.findAll();
//        int alertsCreated = 0;
//        
//        for (Vehicle vehicle : vehicles) {
//            try {
//                MaintenanceRecord record = predictMaintenanceForVehicle(vehicle.getId());
//                if (record != null) {
//                    alertsCreated++;
//                }
//            } catch (Exception e) {
//                System.err.println("❌ Error predicting maintenance for vehicle " + 
//                                  vehicle.getId() + ": " + e.getMessage());
//            }
//        }
//        
//        System.out.println("✅ Predictive maintenance completed. Created " + 
//                          alertsCreated + " maintenance alerts.");
//    }
//}

package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
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
    private AIService aiService;
    
    @Autowired
    private NotificationService notificationService;
    
    // ========== ADMIN METHODS ==========
    
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRepository.findAll();
    }
    
    public List<MaintenanceRecord> getPredictiveRecords() {
        return maintenanceRepository.findByIsPredictive(true);
    }
    
    public List<MaintenanceRecord> getRecordsByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }
    
    public MaintenanceRecord updateRecord(Long id, MaintenanceRecord updates) {
        MaintenanceRecord record = maintenanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
        
        if (updates.getStatus() != null) {
            record.setStatus(updates.getStatus());
        }
        if (updates.getMechanicAssigned() != null) {
            record.setMechanicAssigned(updates.getMechanicAssigned());
        }
        if (updates.getEstimatedCost() != null) {
            record.setEstimatedCost(updates.getEstimatedCost());
        }
        if (updates.getScheduledDate() != null) {
            record.setScheduledDate(updates.getScheduledDate());
        }
        
        if (updates.getStatus() == MaintenanceStatus.COMPLETED) {
            record.setCompletedDate(LocalDateTime.now());
            Vehicle vehicle = record.getVehicle();
            vehicle.setHealthScore(Math.min(100, vehicle.getHealthScore() + 20));
            vehicleRepository.save(vehicle);
        }
        
        return maintenanceRepository.save(record);
    }
    
    public Map<String, Object> predictMaintenanceForVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        Map<String, Object> vehicleData = new HashMap<>();
        vehicleData.put("id", vehicle.getId());
        vehicleData.put("vehicleNumber", vehicle.getVehicleNumber());
        vehicleData.put("healthScore", vehicle.getHealthScore());
        vehicleData.put("mileage", vehicle.getMileage());
        vehicleData.put("fuelLevel", vehicle.getFuelLevel());
        vehicleData.put("batteryLevel", vehicle.getBatteryLevel());
        
        Map<String, Object> prediction = aiService.predictMaintenance(vehicleData);
        
        String riskLevel = (String) prediction.get("riskLevel");
        if ("HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel)) {
            createMaintenanceRecord(vehicle, prediction);
        }
        
        return prediction;
    }
    
    public Map<String, Object> runPredictiveMaintenance1() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> predictions = new ArrayList<>();
        int recordsCreated = 0;
        
        for (Vehicle vehicle : vehicles) {
            Map<String, Object> prediction = predictMaintenanceForVehicle(vehicle.getId());
            predictions.add(prediction);
            
            String riskLevel = (String) prediction.get("riskLevel");
            if ("HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel)) {
                recordsCreated++;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalVehiclesScanned", vehicles.size());
        result.put("maintenanceRecordsCreated", recordsCreated);
        result.put("predictions", predictions);
        result.put("message", "Predictive maintenance scan completed");
        
        return result;
    }
    
    // ========== MANAGER METHODS ==========
    
    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }
    
    public List<MaintenanceRecord> getPendingMaintenance() {
        return maintenanceRepository.findByStatus(MaintenanceStatus.PENDING);
    }
    
    public Map<String, Object> predictMaintenance(Long vehicleId) {
        return predictMaintenanceForVehicle(vehicleId);
    }
    
    public Map<String, Object> analyzeFleetHealth() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> predictions = new ArrayList<>();
        int criticalCount = 0;
        int highRiskCount = 0;
        int mediumRiskCount = 0;
        int lowRiskCount = 0;
        double totalHealth = 0;
        
        for (Vehicle vehicle : vehicles) {
            Map<String, Object> prediction = predictMaintenanceForVehicle(vehicle.getId());
            predictions.add(prediction);
            
            String riskLevel = (String) prediction.get("riskLevel");
            totalHealth += vehicle.getHealthScore();
            
            switch (riskLevel) {
                case "CRITICAL": criticalCount++; break;
                case "HIGH": highRiskCount++; break;
                case "MEDIUM": mediumRiskCount++; break;
                case "LOW": lowRiskCount++; break;
            }
        }
        
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalVehicles", vehicles.size());
        analysis.put("averageHealth", vehicles.size() > 0 ? totalHealth / vehicles.size() : 0);
        analysis.put("criticalCount", criticalCount);
        analysis.put("highRiskCount", highRiskCount);
        analysis.put("mediumRiskCount", mediumRiskCount);
        analysis.put("lowRiskCount", lowRiskCount);
        analysis.put("healthyCount", lowRiskCount);
        analysis.put("vehiclesPredictions", predictions);
        analysis.put("fleetStatus", criticalCount > 0 ? "CRITICAL" : "HEALTHY");
        
        return analysis;
    }
    
    public Map<String, Object> getVehicleHealthChart(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        Map<String, Object> prediction = predictMaintenanceForVehicle(vehicleId);
        Map<String, Object> componentHealth = (Map<String, Object>) prediction.get("componentHealth");
        
        List<Map<String, Object>> chartData = new ArrayList<>();
        
        if (componentHealth != null) {
            for (Map.Entry<String, Object> entry : componentHealth.entrySet()) {
                Map<String, Object> component = (Map<String, Object>) entry.getValue();
                
                Map<String, Object> dataPoint = new HashMap<>();
                dataPoint.put("component", entry.getKey());
                dataPoint.put("health", component.get("health"));
                dataPoint.put("status", component.get("status"));
                
                chartData.add(dataPoint);
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("vehicleId", vehicleId);
        result.put("vehicleNumber", vehicle.getVehicleNumber());
        result.put("overallHealth", vehicle.getHealthScore());
        result.put("componentHealthData", chartData);
        result.put("lastUpdated", LocalDateTime.now());
        
        return result;
    }
    
    public Map<String, Object> getFleetHealthStats() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        long criticalCount = vehicles.stream().filter(v -> v.getHealthScore() < 60).count();
        long needsAttention = vehicles.stream().filter(v -> v.getHealthScore() < 80).count();
        long healthy = vehicles.stream().filter(v -> v.getHealthScore() >= 80).count();
        
        double avgHealth = vehicles.stream()
            .mapToDouble(Vehicle::getHealthScore)
            .average()
            .orElse(0.0);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVehicles", vehicles.size());
        stats.put("averageHealth", Math.round(avgHealth * 10) / 10.0);
        stats.put("criticalCount", criticalCount);
        stats.put("needsAttentionCount", needsAttention);
        stats.put("healthyCount", healthy);
        stats.put("pendingMaintenanceCount", getPendingMaintenance().size());
        
        return stats;
    }
    
    public MaintenanceRecord updateMaintenanceRecord(Long id, MaintenanceRecord updates) {
        return updateRecord(id, updates);
    }
    
    // ========== HELPER METHODS ==========
    
    private MaintenanceRecord createMaintenanceRecord(Vehicle vehicle, Map<String, Object> prediction) {
        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicle(vehicle);
        record.setIssueType("Predictive Maintenance Alert");
        
        List<String> actions = (List<String>) prediction.get("recommendedActions");
        record.setDescription(actions != null ? String.join(", ", actions) : "Maintenance required");
        
        record.setStatus(MaintenanceStatus.PENDING);
        
        String riskLevel = (String) prediction.get("riskLevel");
        record.setPriority(MaintenancePriority.valueOf(
            "CRITICAL".equals(riskLevel) ? "CRITICAL" :
            "HIGH".equals(riskLevel) ? "HIGH" : "MEDIUM"
        ));
        
        record.setRiskScore(((Number) prediction.get("riskScore")).intValue());
        record.setPredictedDaysToFailure(((Number) prediction.get("predictedDaysToFailure")).intValue());
        record.setIsPredictive(true);
        record.setCreatedAt(LocalDateTime.now());
        record.setScheduledDate(LocalDateTime.now().plusDays(7));
        record.setEstimatedCost(1000.0);
        
        MaintenanceRecord saved = maintenanceRepository.save(record);
        
        notificationService.notifyMaintenanceAlert(saved);
        
        System.out.println("🔧 Maintenance record created for vehicle: " + vehicle.getVehicleNumber());
        
        return saved;
    }
}