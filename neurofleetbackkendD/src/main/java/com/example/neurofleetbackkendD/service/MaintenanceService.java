package com.example.neurofleetbackkendD.service;



import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.Vehicle;
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

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Optional<Maintenance> getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id);
    }

    public List<Maintenance> getMaintenanceByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }

    public List<Maintenance> getPredictiveMaintenance() {
        return maintenanceRepository.findByIsPredictiveTrue();
    }

    public Maintenance createMaintenance(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }

    public Maintenance updateMaintenance(Long id, Maintenance maintenanceDetails) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
        
        maintenance.setStatus(maintenanceDetails.getStatus());
        maintenance.setDescription(maintenanceDetails.getDescription());
        maintenance.setPriority(maintenanceDetails.getPriority());
        maintenance.setActualCost(maintenanceDetails.getActualCost());
        maintenance.setMechanicNotes(maintenanceDetails.getMechanicNotes());
        
        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepository.deleteById(id);
    }
}