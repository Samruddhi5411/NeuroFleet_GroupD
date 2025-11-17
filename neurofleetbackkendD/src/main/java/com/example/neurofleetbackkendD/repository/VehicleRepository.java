package com.example.neurofleetbackkendD.repository;



import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByType(VehicleType type);
    List<Vehicle> findByCurrentDriverId(Long driverId);
}