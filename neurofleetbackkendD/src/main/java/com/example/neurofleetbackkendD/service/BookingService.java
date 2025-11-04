package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;

    // ============ BASIC CRUD OPERATIONS ============
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getCustomerBookings(String username) {
        return bookingRepository.findByCustomerUsername(username);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Update vehicle status to IN_USE
        if (booking.getVehicle() != null) {
            Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            vehicle.setStatus(VehicleStatus.IN_USE);
            vehicleRepository.save(vehicle);
        }
        
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(bookingDetails.getStatus());
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        booking.setPickupLocation(bookingDetails.getPickupLocation());
        booking.setDropoffLocation(bookingDetails.getDropoffLocation());
        
        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // ============ DRIVER OPERATIONS ============
    
    public List<Booking> getDriverBookings(String username) {
        return bookingRepository.findByDriverUsername(username);
    }

    public List<Booking> getActiveDriverTrips(String username) {
        return bookingRepository.findByDriverUsername(username).stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
            .collect(Collectors.toList());
    }

    // ============ STATUS MANAGEMENT ============
    
    @Transactional
    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
        booking.setStatus(newStatus);
        
        // Update vehicle status based on booking status
        if (booking.getVehicle() != null) {
            Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            
            switch (newStatus) {
                case IN_PROGRESS:
                    vehicle.setStatus(VehicleStatus.IN_USE);
                    break;
                case COMPLETED:
                case CANCELLED:
                    vehicle.setStatus(VehicleStatus.AVAILABLE);
                    break;
                default:
                    break;
            }
            vehicleRepository.save(vehicle);
        }
        
        return bookingRepository.save(booking);
    }

    // ============ ANALYTICS & METRICS ============
    
    public long getActiveTripsCount() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .count();
    }

    public double getTotalRevenue() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(booking -> booking.getTotalPrice() != null ? booking.getTotalPrice() : 0.0)
                .sum();
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByVehicle(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }
}