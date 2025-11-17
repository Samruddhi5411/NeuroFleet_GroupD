package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.VehicleAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleAvailabilityRepository extends JpaRepository<VehicleAvailability, Long> {
    List<VehicleAvailability> findByVehicleId(Long vehicleId);
    List<VehicleAvailability> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT v FROM VehicleAvailability v WHERE v.vehicle.id = ?1 " +
           "AND v.startTime >= ?2 AND v.endTime <= ?3")
    List<VehicleAvailability> findVehicleAvailabilityInRange(
        Long vehicleId, LocalDateTime start, LocalDateTime end);
}
