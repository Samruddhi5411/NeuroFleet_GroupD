package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find by status
    List<Booking> findByStatus(BookingStatus status);
    
    // Find by customer
    List<Booking> findByCustomerId(Long customerId);
    
    // Find by driver
    List<Booking> findByDriverId(Long driverId);
    
    // Find by driver and status
    List<Booking> findByDriverIdAndStatus(Long driverId, BookingStatus status);
    
    // Find by driver and multiple statuses
    List<Booking> findByDriverIdAndStatusIn(Long driverId, List<BookingStatus> statuses);
    Long countByDriverIdAndStatus(Long driverId, BookingStatus status);
    // Find by vehicle
    List<Booking> findByVehicleId(Long vehicleId);
    
    // Find active bookings (for monitoring)
    List<Booking> findByStatusIn(List<BookingStatus> statuses);
    
}