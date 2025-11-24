package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenancePriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    
    List<MaintenanceRecord> findByStatus(MaintenanceStatus status);
    
    List<MaintenanceRecord> findByPriority(MaintenancePriority priority);
    
    List<MaintenanceRecord> findByVehicleId(Long vehicleId);
    
    List<MaintenanceRecord> findByVehicleIdAndStatus(Long vehicleId, MaintenanceStatus status);
}