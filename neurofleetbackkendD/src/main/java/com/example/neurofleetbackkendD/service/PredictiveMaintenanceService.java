package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictiveMaintenanceService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private VehicleHealthLogRepository healthLogRepository;
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private AIIntegrationService aiService;
    
    // Monitor and log vehicle health (runs every 5 minutes)
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void monitorVehicleHealth() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        Random random = new Random();
        
        for (Vehicle vehicle : vehicles) {
            VehicleHealthLog healthLog = new VehicleHealthLog();
            healthLog.setVehicle(vehicle);
            
            // Simulate health parameters with realistic degradation
            healthLog.setEngineHealth(calculateEngineHealth(vehicle, random));
            healthLog.setTirePressureFrontLeft(30.0 + random.nextDouble() * 5);
            healthLog.setTirePressureFrontRight(30.0 + random.nextDouble() * 5);
            healthLog.setTirePressureRearLeft(30.0 + random.nextDouble() * 5);
            healthLog.setTirePressureRearRight(30.0 + random.nextDouble() * 5);
            healthLog.setBatteryHealth(Math.max(0, vehicle.getBatteryLevel() - random.nextInt(5)));
            healthLog.setFuelSystemHealth(85 + random.nextInt(15));
            healthLog.setEngineTemperature(85.0 + random.nextDouble() * 20);
            healthLog.setOilPressure(30.0 + random.nextDouble() * 20);
            healthLog.setBrakeHealth(80 + random.nextInt(20));
            healthLog.setTransmissionHealth(85 + random.nextInt(15));
            
            // Calculate overall health score
            int overallScore = calculateOverallHealth(healthLog);
            healthLog.setOverallHealthScore(overallScore);
            
            // Determine health status and alerts
            List<String> alerts = new ArrayList<>();
            String status = determineHealthStatus(healthLog, alerts);
            healthLog.setHealthStatus(status);
            healthLog.setAlerts(String.join(", ", alerts));
            
            // Predict next maintenance
            predictNextMaintenance(healthLog, vehicle);
            
            healthLogRepository.save(healthLog);
            
            // Update vehicle health score
            vehicle.setHealthScore(overallScore);
            vehicleRepository.save(vehicle);
            
            // Create maintenance alert if critical
            if (status.equals("CRITICAL") && !alerts.isEmpty()) {
                createMaintenanceAlert(vehicle, alerts, overallScore);
            }
        }
    }
    
    private int calculateEngineHealth(Vehicle vehicle, Random random) {
        int baseHealth = 100;
        
        // Degrade based on mileage
        baseHealth -= (vehicle.getMileage() / 10000) * 2;
        
        // Add random variation
        baseHealth += random.nextInt(10) - 5;
        
        return Math.max(50, Math.min(100, baseHealth));
    }
    
    private int calculateOverallHealth(VehicleHealthLog log) {
        double engineWeight = 0.30;
        double tireWeight = 0.15;
        double batteryWeight = 0.20;
        double fuelWeight = 0.10;
        double brakeWeight = 0.15;
        double transmissionWeight = 0.10;
        
        double avgTirePressure = (log.getTirePressureFrontLeft() + 
                                   log.getTirePressureFrontRight() +
                                   log.getTirePressureRearLeft() + 
                                   log.getTirePressureRearRight()) / 4.0;
        int tireScore = (int) ((avgTirePressure / 35.0) * 100);
        
        int score = (int) (
            log.getEngineHealth() * engineWeight +
            tireScore * tireWeight +
            log.getBatteryHealth() * batteryWeight +
            log.getFuelSystemHealth() * fuelWeight +
            log.getBrakeHealth() * brakeWeight +
            log.getTransmissionHealth() * transmissionWeight
        );
        
        return Math.max(0, Math.min(100, score));
    }
    
    private String determineHealthStatus(VehicleHealthLog log, List<String> alerts) {
        int score = log.getOverallHealthScore();
        
        // Check individual components
        if (log.getEngineHealth() < 60) {
            alerts.add("Engine health critical");
        }
        if (log.getBatteryHealth() < 30) {
            alerts.add("Battery needs replacement");
        }
        if (log.getBrakeHealth() < 60) {
            alerts.add("Brake system requires attention");
        }
        if (log.getEngineTemperature() > 100) {
            alerts.add("Engine overheating detected");
        }
        
        double avgTire = (log.getTirePressureFrontLeft() + 
                         log.getTirePressureFrontRight() +
                         log.getTirePressureRearLeft() + 
                         log.getTirePressureRearRight()) / 4.0;
        if (avgTire < 28 || avgTire > 38) {
            alerts.add("Tire pressure abnormal");
        }
        
        // Determine status
        if (score >= 80 && alerts.isEmpty()) {
            return "HEALTHY";
        } else if (score >= 60 || alerts.size() <= 1) {
            return "WARNING";
        } else {
            return "CRITICAL";
        }
    }
    
    private void predictNextMaintenance(VehicleHealthLog log, Vehicle vehicle) {
        int mileage = vehicle.getMileage();
        int healthScore = log.getOverallHealthScore();
        
        // Calculate km until maintenance (standard is 5000km)
        int lastServiceKm = (mileage / 5000) * 5000;
        int nextServiceKm = lastServiceKm + 5000;
        int kmUntil = nextServiceKm - mileage;
        
        // Adjust based on health
        if (healthScore < 70) {
            kmUntil = Math.min(kmUntil, 1000); // Immediate service needed
        } else if (healthScore < 85) {
            kmUntil = Math.min(kmUntil, 2500);
        }
        
        log.setKmUntilMaintenance(kmUntil);
        
        // Predict date (assuming 100km per day average)
        int daysUntil = kmUntil / 100;
        log.setNextMaintenanceDate(LocalDateTime.now().plusDays(daysUntil));
    }
    
    private void createMaintenanceAlert(Vehicle vehicle, List<String> alerts, int riskScore) {
        // Check if alert already exists for this vehicle
        List<MaintenanceRecord> existing = maintenanceRepository.findByVehicleId(vehicle.getId());
        boolean hasOpenAlert = existing.stream()
            .anyMatch(m -> m.getStatus() == MaintenanceStatus.PENDING && 
                          m.getIsPredictive() &&
                          m.getCreatedAt().isAfter(LocalDateTime.now().minusDays(1)));
        
        if (!hasOpenAlert) {
            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(vehicle);
            record.setIssueType("Predictive Health Alert");
            record.setDescription(String.join("; ", alerts));
            record.setIsPredictive(true);
            record.setRiskScore(100 - riskScore);
            record.setPredictedDaysToFailure(riskScore < 60 ? 7 : 14);
            record.setPriority(riskScore < 60 ? MaintenancePriority.CRITICAL : MaintenancePriority.HIGH);
            record.setStatus(MaintenanceStatus.PENDING);
            record.setEstimatedCost(3000.0 + (100 - riskScore) * 50);
            
            maintenanceRepository.save(record);
        }
    }
    
    // Get health analytics dashboard data
    public Map<String, Object> getHealthAnalyticsDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        List<VehicleHealthLog> allLogs = healthLogRepository.findAll();
        
        // Overall fleet health statistics
        long healthyCount = allLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getVehicle().getId(),
                Collectors.maxBy(Comparator.comparing(VehicleHealthLog::getTimestamp))
            ))
            .values().stream()
            .filter(Optional::isPresent)
            .map(Optional::get)
            .filter(log -> log.getHealthStatus().equals("HEALTHY"))
            .count();
        
        long warningCount = allLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getVehicle().getId(),
                Collectors.maxBy(Comparator.comparing(VehicleHealthLog::getTimestamp))
            ))
            .values().stream()
            .filter(Optional::isPresent)
            .map(Optional::get)
            .filter(log -> log.getHealthStatus().equals("WARNING"))
            .count();
        
        long criticalCount = allLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getVehicle().getId(),
                Collectors.maxBy(Comparator.comparing(VehicleHealthLog::getTimestamp))
            ))
            .values().stream()
            .filter(Optional::isPresent)
            .map(Optional::get)
            .filter(log -> log.getHealthStatus().equals("CRITICAL"))
            .count();
        
        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("healthy", healthyCount);
        statusDistribution.put("warning", warningCount);
        statusDistribution.put("critical", criticalCount);
        
        dashboard.put("totalVehicles", allVehicles.size());
        dashboard.put("statusDistribution", statusDistribution);
        
        // Average health scores
        double avgHealth = allVehicles.stream()
            .mapToInt(Vehicle::getHealthScore)
            .average()
            .orElse(0);
        dashboard.put("averageFleetHealth", Math.round(avgHealth));
        
        // Vehicles needing immediate attention
        List<Map<String, Object>> criticalVehicles = allLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getVehicle().getId(),
                Collectors.maxBy(Comparator.comparing(VehicleHealthLog::getTimestamp))
            ))
            .values().stream()
            .filter(Optional::isPresent)
            .map(Optional::get)
            .filter(log -> log.getHealthStatus().equals("CRITICAL"))
            .map(log -> {
                Map<String, Object> vehicleData = new HashMap<>();
                vehicleData.put("vehicleId", log.getVehicle().getId());
                vehicleData.put("vehicleNumber", log.getVehicle().getVehicleNumber());
                vehicleData.put("healthScore", log.getOverallHealthScore());
                vehicleData.put("alerts", log.getAlerts());
                vehicleData.put("nextMaintenance", log.getNextMaintenanceDate());
                return vehicleData;
            })
            .collect(Collectors.toList());
        
        dashboard.put("criticalVehicles", criticalVehicles);
        
        // Upcoming maintenance
        List<Map<String, Object>> upcomingMaintenance = allLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getVehicle().getId(),
                Collectors.maxBy(Comparator.comparing(VehicleHealthLog::getTimestamp))
            ))
            .values().stream()
            .filter(Optional::isPresent)
            .map(Optional::get)
            .filter(log -> log.getKmUntilMaintenance() != null && log.getKmUntilMaintenance() < 2000)
            .sorted(Comparator.comparing(VehicleHealthLog::getKmUntilMaintenance))
            .limit(10)
            .map(log -> {
                Map<String, Object> data = new HashMap<>();
                data.put("vehicleId", log.getVehicle().getId());
                data.put("vehicleNumber", log.getVehicle().getVehicleNumber());
                data.put("kmUntilMaintenance", log.getKmUntilMaintenance());
                data.put("nextMaintenanceDate", log.getNextMaintenanceDate());
                data.put("healthScore", log.getOverallHealthScore());
                return data;
            })
            .collect(Collectors.toList());
        
        dashboard.put("upcomingMaintenance", upcomingMaintenance);
        
        return dashboard;
    }
    
    // Get health trend for a vehicle (last 30 days)
    public Map<String, Object> getVehicleHealthTrend(Long vehicleId, int days) {
        Map<String, Object> trend = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<VehicleHealthLog> logs = healthLogRepository.findByVehicleId(vehicleId).stream()
            .filter(log -> log.getTimestamp().isAfter(startDate))
            .sorted(Comparator.comparing(VehicleHealthLog::getTimestamp))
            .collect(Collectors.toList());
        
        List<Map<String, Object>> healthData = logs.stream()
            .map(log -> {
                Map<String, Object> point = new HashMap<>();
                point.put("timestamp", log.getTimestamp().toString());
                point.put("overallHealth", log.getOverallHealthScore());
                point.put("engineHealth", log.getEngineHealth());
                point.put("batteryHealth", log.getBatteryHealth());
                point.put("brakeHealth", log.getBrakeHealth());
                point.put("status", log.getHealthStatus());
                return point;
            })
            .collect(Collectors.toList());
        
        trend.put("vehicleId", vehicleId);
        trend.put("period", days + " days");
        trend.put("dataPoints", healthData);
        
        // Latest status
        if (!logs.isEmpty()) {
            VehicleHealthLog latest = logs.get(logs.size() - 1);
            trend.put("currentHealth", latest.getOverallHealthScore());
            trend.put("currentStatus", latest.getHealthStatus());
            trend.put("alerts", latest.getAlerts());
        }
        
        return trend;
    }
    
    // Get component-wise health breakdown
    public Map<String, Object> getComponentHealthBreakdown(Long vehicleId) {
        VehicleHealthLog latest = healthLogRepository.findTopByVehicleIdOrderByTimestampDesc(vehicleId);
        
        if (latest == null) {
            return Map.of("error", "No health data available");
        }
        
        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("vehicleId", vehicleId);
        breakdown.put("timestamp", latest.getTimestamp());
        breakdown.put("overallHealth", latest.getOverallHealthScore());
        
        Map<String, Integer> components = new HashMap<>();
        components.put("engine", latest.getEngineHealth());
        components.put("battery", latest.getBatteryHealth());
        components.put("brakes", latest.getBrakeHealth());
        components.put("transmission", latest.getTransmissionHealth());
        components.put("fuelSystem", latest.getFuelSystemHealth());
        
        breakdown.put("components", components);
        
        Map<String, Double> tires = new HashMap<>();
        tires.put("frontLeft", latest.getTirePressureFrontLeft());
        tires.put("frontRight", latest.getTirePressureFrontRight());
        tires.put("rearLeft", latest.getTirePressureRearLeft());
        tires.put("rearRight", latest.getTirePressureRearRight());
        
        breakdown.put("tirePressure", tires);
        
        Map<String, Double> sensors = new HashMap<>();
        sensors.put("engineTemperature", latest.getEngineTemperature());
        sensors.put("oilPressure", latest.getOilPressure());
        
        breakdown.put("sensors", sensors);
        
        breakdown.put("nextMaintenance", latest.getNextMaintenanceDate());
        breakdown.put("kmUntilMaintenance", latest.getKmUntilMaintenance());
        
        return breakdown;
    }
}
