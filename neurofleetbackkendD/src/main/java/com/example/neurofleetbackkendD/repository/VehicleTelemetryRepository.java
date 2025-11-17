package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.VehicleTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleTelemetryRepository extends JpaRepository<VehicleTelemetry, Long> {
    List<VehicleTelemetry> findByVehicleId(Long vehicleId);
    List<VehicleTelemetry> findByVehicleIdAndTimestampBetween(
        Long vehicleId, LocalDateTime start, LocalDateTime end);
    VehicleTelemetry findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);
}
