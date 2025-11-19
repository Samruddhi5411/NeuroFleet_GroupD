package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Route;
import com.example.neurofleetbackkendD.model.enums.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByStatus(RouteStatus status);
    List<Route> findByVehicleId(Long vehicleId);
    List<Route> findByBookingId(Long bookingId);
}