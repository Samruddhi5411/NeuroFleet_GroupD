package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByVehicleId(Long vehicleId);
    List<MaintenanceRecord> findByStatus(String status);
    List<MaintenanceRecord> findByIsPredictive(Boolean isPredictive);
}