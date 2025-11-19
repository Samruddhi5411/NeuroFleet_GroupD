package com.example.neurofleetbackkendD.repository;





import com.example.neurofleetbackkendD.model.Booking;

import com.example.neurofleetbackkendD.model.enums.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByDriverId(Long driverId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByVehicleId(Long vehicleId);
   
    List<Booking> findByStatusIn(List<BookingStatus> statuses);
    List<Booking> findByDriverIdAndStatus(Long driverId, BookingStatus status);
}