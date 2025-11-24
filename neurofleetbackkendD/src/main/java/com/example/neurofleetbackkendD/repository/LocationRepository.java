package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByVehicleId(Long vehicleId);
    List<Location> findByDriverId(Long driverId);
    List<Location> findByBookingId(Long bookingId);
    Location findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);
    Location findTopByDriverIdOrderByTimestampDesc(Long driverId);
}