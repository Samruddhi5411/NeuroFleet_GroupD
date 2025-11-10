package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.model.enums.PaymentStatus;
import com.example.neurofleetbackkendD.model.enums.PaymentMethod;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
        // Set initial status to PENDING_APPROVAL
        booking.setStatus(BookingStatus.PENDING_APPROVAL);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        
        // Vehicle remains AVAILABLE until manager approves
        // No vehicle status change here!
        
        return bookingRepository.save(booking);
    }

    // ============ MANAGER APPROVAL SYSTEM ============
    
    @Transactional
    public Booking approveBooking(Long bookingId, Long managerId, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Booking is not pending approval");
        }
        
        // Update booking status
        booking.setStatus(BookingStatus.APPROVED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setApprovedAt(LocalDateTime.now());
        booking.setApprovedBy(managerId);
        booking.setApprovalNotes(notes);
        
        // Reserve vehicle (set to MAINTENANCE to indicate "reserved")
        if (booking.getVehicle() != null) {
            Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            vehicle.setStatus(VehicleStatus.MAINTENANCE);  // Reserved state
            vehicleRepository.save(vehicle);
        }
        
        return bookingRepository.save(booking);
    }
    
    @Transactional
    public Booking rejectBooking(Long bookingId, Long managerId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        booking.setApprovedBy(managerId);
        booking.setApprovedAt(LocalDateTime.now());
        
        // Vehicle remains AVAILABLE
        
        return bookingRepository.save(booking);
    }

    // ============ PAYMENT SYSTEM ============
    
    @Transactional
    public Booking processPayment(Long bookingId, PaymentMethod paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Booking must be approved before payment");
        }
        
        // Generate transaction ID
        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        
        // Update payment details
        booking.setPaymentMethod(paymentMethod);
        booking.setPaymentTransactionId(transactionId);
        booking.setPaymentStatus(PaymentStatus.COMPLETED);
        booking.setPaymentCompletedAt(LocalDateTime.now());
        
        // Update booking status to CONFIRMED
        booking.setStatus(BookingStatus.CONFIRMED);
        
        // Change vehicle status to IN_USE
        if (booking.getVehicle() != null) {
            Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            vehicle.setStatus(VehicleStatus.IN_USE);
            vehicleRepository.save(vehicle);
        }
        
        return bookingRepository.save(booking);
    }

    // ============ TRACKING SYSTEM ============
    
    @Transactional
    public Booking updateVehicleLocation(Long bookingId, Double latitude, Double longitude) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setCurrentLatitude(latitude);
        booking.setCurrentLongitude(longitude);
        
        // Calculate distance from customer (using Haversine formula)
        if (booking.getPickupLatitude() != null && booking.getPickupLongitude() != null) {
            double distance = calculateDistance(
                booking.getPickupLatitude(), 
                booking.getPickupLongitude(),
                latitude, 
                longitude
            );
            booking.setDistanceFromCustomer(distance);
        }
        
        return bookingRepository.save(booking);
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
                case REJECTED:
                    vehicle.setStatus(VehicleStatus.AVAILABLE);
                    break;
                default:
                    break;
            }
            vehicleRepository.save(vehicle);
        }
        
        return bookingRepository.save(booking);
    }

    // ============ QUERY METHODS ============
    
    public List<Booking> getPendingApprovalBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING_APPROVAL);
    }
    
    public List<Booking> getApprovedBookings() {
        return bookingRepository.findByStatus(BookingStatus.APPROVED);
    }
    
    public long getActiveTripsCount() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .count();
    }

    public double getTotalRevenue() {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED && 
                            b.getPaymentStatus() == PaymentStatus.COMPLETED)
                .mapToDouble(booking -> booking.getTotalPrice() != null ? booking.getTotalPrice() : 0.0)
                .sum();
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

    public List<Booking> getDriverBookings(String username) {
        return bookingRepository.findByDriverUsername(username);
    }

    public List<Booking> getActiveDriverTrips(String username) {
        return bookingRepository.findByDriverUsername(username).stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
            .collect(Collectors.toList());
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByVehicle(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }
}