package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.Priority;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;



@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByVehicleId(Long vehicleId);
    List<Maintenance> findByIsPredictiveTrue();
    List<Maintenance> findByStatus(MaintenanceStatus status);
    List<Maintenance> findByPriority(Priority priority);
    List<Maintenance> findByStatusAndPriority(MaintenanceStatus status, Priority priority);
}
