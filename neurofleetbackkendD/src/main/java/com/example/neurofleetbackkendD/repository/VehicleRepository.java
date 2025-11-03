package com.example.neurofleetbackkendD.repository;



import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(VehicleStatus status);
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    List<Vehicle> findByIsElectric(Boolean isElectric);
    List<Vehicle> findByType(VehicleType type);
}
