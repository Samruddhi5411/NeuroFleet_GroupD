package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    // Find trips by driver
    List<Trip> findByDriverId(Long driverId);
    
    // Find trips by customer
    List<Trip> findByCustomerId(Long customerId);
    
    // Find trips by vehicle
    List<Trip> findByVehicleId(Long vehicleId);
    
    // Find trips by booking
    List<Trip> findByBookingId(Long bookingId);
    
    // Find trips by status
    List<Trip> findByStatus(String status);
    
    // Find trips between dates
    List<Trip> findByStartTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find completed trips
    List<Trip> findByStatusAndCompletedAtIsNotNull(String status);
    
    // Find active trips (in progress)
    List<Trip> findByStatusIn(List<String> statuses);
}