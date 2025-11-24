package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    List<Vehicle> findByStatus(VehicleStatus status);
    
    List<Vehicle> findByType(VehicleType type);
    
    List<Vehicle> findByIsElectric(Boolean isElectric);
    
    Long countByStatus(VehicleStatus status);
}