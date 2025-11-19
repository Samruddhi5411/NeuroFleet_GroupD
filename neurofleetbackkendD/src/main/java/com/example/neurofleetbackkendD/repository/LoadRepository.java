package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Load;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoadRepository extends JpaRepository<Load, Long> {
    List<Load> findByStatus(String status);
    List<Load> findByVehicleId(Long vehicleId);
    List<Load> findByDriverId(Long driverId);
}