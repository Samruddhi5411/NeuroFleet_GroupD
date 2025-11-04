package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenanceType;
import com.example.neurofleetbackkendD.model.enums.Priority;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private final Random random = new Random();

    // ============ BASIC CRUD OPERATIONS ============
    
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Optional<Maintenance> getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id);
    }

    public List<Maintenance> getMaintenanceByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }

    @Transactional
    public Maintenance createMaintenance(Maintenance maintenance) {
        if (maintenance.getScheduledDate() == null) {
            maintenance.setScheduledDate(LocalDateTime.now().plusDays(7));
        }
        return maintenanceRepository.save(maintenance);
    }

    @Transactional
    public Maintenance updateMaintenance(Long id, Maintenance maintenanceDetails) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found with id: " + id));
        
        maintenance.setStatus(maintenanceDetails.getStatus());
        maintenance.setDescription(maintenanceDetails.getDescription());
        maintenance.setPriority(maintenanceDetails.getPriority());
        maintenance.setScheduledDate(maintenanceDetails.getScheduledDate());
        maintenance.setActualCost(maintenanceDetails.getActualCost());
        maintenance.setMechanicNotes(maintenanceDetails.getMechanicNotes());
        
        if (maintenanceDetails.getStatus() == MaintenanceStatus.COMPLETED) {
            maintenance.setCompletedDate(LocalDateTime.now());
        }
        
        return maintenanceRepository.save(maintenance);
    }

    @Transactional
    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }

    // ============ PREDICTIVE MAINTENANCE (AI) ============
    
    public List<Maintenance> getPredictiveMaintenance() {
        return maintenanceRepository.findByIsPredictiveTrue();
    }

    @Transactional
    public List<Maintenance> generatePredictiveMaintenance() {
        List<Maintenance> predictedMaintenances = new ArrayList<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        for (Vehicle vehicle : vehicles) {
            // AI-based prediction logic
            int riskScore = calculateRiskScore(vehicle);
            
            if (riskScore > 40) {
                // Check if predictive maintenance already exists for this vehicle
                List<Maintenance> existing = maintenanceRepository.findByVehicleId(vehicle.getId());
                boolean hasPendingPredictive = existing.stream()
                    .anyMatch(m -> m.getIsPredictive() && m.getStatus() == MaintenanceStatus.PENDING);
                
                if (!hasPendingPredictive) {
                    Maintenance predictive = new Maintenance();
                    predictive.setVehicle(vehicle);
                    predictive.setIsPredictive(true);
                    
                    // Determine issue type based on vehicle condition
                    if (vehicle.getHealthScore() < 70) {
                        predictive.setIssueType(MaintenanceType.ENGINE);
                        predictive.setDescription("AI detected potential engine issues based on health score");
                    } else if (vehicle.getKmsSinceService() > 5000) {
                        predictive.setIssueType(MaintenanceType.GENERAL_SERVICE);
                        predictive.setDescription("Regular service overdue - " + vehicle.getKmsSinceService() + " km since last service");
                    } else if (vehicle.getIsElectric() && vehicle.getBatteryLevel() < 20) {
                        predictive.setIssueType(MaintenanceType.BATTERY);
                        predictive.setDescription("Low battery health detected");
                    } else {
                        predictive.setIssueType(MaintenanceType.OIL_CHANGE);
                        predictive.setDescription("Preventive maintenance recommended");
                    }
                    
                    // Set priority based on risk score
                    if (riskScore > 70) {
                        predictive.setPriority(Priority.CRITICAL);
                        predictive.setPredictedDaysToFailure(random.nextInt(7) + 1);
                    } else if (riskScore > 55) {
                        predictive.setPriority(Priority.HIGH);
                        predictive.setPredictedDaysToFailure(random.nextInt(8) + 7);
                    } else {
                        predictive.setPriority(Priority.MEDIUM);
                        predictive.setPredictedDaysToFailure(random.nextInt(15) + 15);
                    }
                    
                    predictive.setStatus(MaintenanceStatus.PENDING);
                    predictive.setScheduledDate(LocalDateTime.now().plusDays(predictive.getPredictedDaysToFailure()));
                    predictive.setEstimatedCost(estimateCost(predictive.getIssueType()));
                    
                    Maintenance saved = maintenanceRepository.save(predictive);
                    predictedMaintenances.add(saved);
                }
            }
        }
        
        return predictedMaintenances;
    }

    // ============ HELPER METHODS ============
    
    private int calculateRiskScore(Vehicle vehicle) {
        int riskScore = 0;
        
        // Health score factor (30 points)
        if (vehicle.getHealthScore() < 70) {
            riskScore += 30;
        } else if (vehicle.getHealthScore() < 85) {
            riskScore += 15;
        }
        
        // Kilometers since service (25 points)
        if (vehicle.getKmsSinceService() > 5000) {
            riskScore += 25;
        } else if (vehicle.getKmsSinceService() > 3000) {
            riskScore += 15;
        }
        
        // Battery/Fuel level (20 points)
        if (vehicle.getIsElectric()) {
            if (vehicle.getBatteryLevel() < 20) {
                riskScore += 20;
            }
        } else {
            if (vehicle.getFuelLevel() < 20) {
                riskScore += 10;
            }
        }
        
        // Mileage factor (15 points)
        if (vehicle.getMileage() > 100000) {
            riskScore += 15;
        } else if (vehicle.getMileage() > 50000) {
            riskScore += 8;
        }
        
        // Age factor (10 points) - based on last service
        if (vehicle.getLastServiceDate() != null) {
            long daysSinceService = java.time.temporal.ChronoUnit.DAYS.between(
                vehicle.getLastServiceDate(), LocalDateTime.now()
            );
            if (daysSinceService > 180) {
                riskScore += 10;
            } else if (daysSinceService > 90) {
                riskScore += 5;
            }
        }
        
        return riskScore;
    }

    private double estimateCost(MaintenanceType type) {
        switch (type) {
            case ENGINE: return 8000.0 + random.nextInt(4000);
            case TRANSMISSION: return 12000.0 + random.nextInt(6000);
            case BATTERY: return 5000.0 + random.nextInt(3000);
            case BRAKES: return 3000.0 + random.nextInt(2000);
            case TIRES: return 4000.0 + random.nextInt(2000);
            case OIL_CHANGE: return 1500.0 + random.nextInt(1000);
            case SUSPENSION: return 6000.0 + random.nextInt(3000);
            case ELECTRICAL: return 4500.0 + random.nextInt(2500);
            case GENERAL_SERVICE: return 3500.0 + random.nextInt(1500);
            default: return 2000.0;
        }
    }

    // ============ ANALYTICS ============
    
    public long getPendingMaintenanceCount() {
        return maintenanceRepository.findByStatus(MaintenanceStatus.PENDING).size();
    }

    public List<Maintenance> getMaintenanceByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    public List<Maintenance> getMaintenanceByPriority(Priority priority) {
        return maintenanceRepository.findByPriority(priority);
    }

    public List<Maintenance> getCriticalMaintenance() {
        return maintenanceRepository.findByStatusAndPriority(MaintenanceStatus.PENDING, Priority.CRITICAL);
    }
}