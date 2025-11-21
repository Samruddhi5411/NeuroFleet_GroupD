package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.VehicleTelemetry;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleTelemetryRepository extends JpaRepository<VehicleTelemetry, Long> {
	
	@Modifying
	@Transactional
	@Query(
	        "UPDATE Vehicle v SET " +
	        "v.batteryLevel = :battery, " +
	        "v.fuelLevel = :fuel, " +
	        "v.latitude = :lat, " +
	        "v.longitude = :lng, " +
	        "v.lastUpdated = CURRENT_TIMESTAMP " +
	        "WHERE v.id = :id"
	)
	void updateTelemetry(
	        @Param("battery") int battery,
	        @Param("fuel") int fuel,
	        @Param("lat") double lat,
	        @Param("lng") double lng,
	        @Param("id") Long id
	);

//	  List<VehicleTelemetry> findByVehicleIdOrderByTimestampDesc(Long vehicleId);
//	    List<VehicleTelemetry> findByVehicleIdAndTimestampBetween(Long vehicleId, 
//	                                                                LocalDateTime start, 
//	   LocalDateTime end);
	  VehicleTelemetry findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);
	    List<VehicleTelemetry> findByVehicleIdAndTimestampBetween(Long vehicleId, LocalDateTime start, LocalDateTime end);
	    List<VehicleTelemetry> findByVehicleId(Long vehicleId);
	
}