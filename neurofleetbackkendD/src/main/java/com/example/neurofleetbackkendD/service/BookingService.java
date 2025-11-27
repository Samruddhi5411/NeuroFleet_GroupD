package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.UUID;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    // Customer creates booking
    @Transactional
    public Booking createBooking(Booking booking) {
        // Validate vehicle availability
        Vehicle vehicle = vehicleRepository.findById(booking.getVehicle().getId())
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Vehicle is not available");
        }
        
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setCreatedAt(LocalDateTime.now());
        
        // Calculate price based on distance
        if (booking.getPickupLatitude() != null && booking.getDropoffLatitude() != null) {
            double distance = calculateDistance(
                booking.getPickupLatitude(), booking.getPickupLongitude(),
                booking.getDropoffLatitude(), booking.getDropoffLongitude()
            );
            booking.setTotalPrice(distance * 15.0); // ₹15 per km
        } else {
            // Default price if coordinates not provided
            booking.setTotalPrice(500.0);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        //  SEND NOTIFICATION
        notificationService.notifyBookingCreated(savedBooking);
        
        System.out.println("✅ Booking created: " + savedBooking.getId() + " for customer: " + booking.getCustomer().getFullName());
        return savedBooking;
    }
    
    // Manager approves booking
    @Transactional
    public Booking approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }
        
        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedAt(LocalDateTime.now());
        
        System.out.println("✅ Booking approved: " + bookingId);
        return bookingRepository.save(booking);
    }
    
    // Assign driver to approved booking
    @Transactional
    public Booking assignDriverToBooking(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Booking must be approved before assigning driver");
        }
        
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        if (driver.getRole() != UserRole.DRIVER) {
            throw new RuntimeException("Selected user is not a driver");
        }
        
        if (!driver.getActive()) {
            throw new RuntimeException("Driver is not active");
        }
        
        booking.setDriver(driver);
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        
        // Auto-accept for demo (you can remove this to require manual acceptance)
        booking.setStatus(BookingStatus.DRIVER_ACCEPTED);
        booking.setDriverAcceptedAt(LocalDateTime.now());
        
        // Auto-confirm booking (skip payment for demo)
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod("CASH");
        booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        //  SEND NOTIFICATIONS
        notificationService.notifyBookingApproved(savedBooking);
        
        System.out.println("✅ Driver " + driver.getFullName() + " assigned to booking " + bookingId);
        return savedBooking;
    }
    
    // Driver starts trip
    @Transactional
    public Booking startTrip(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (booking.getStatus() != BookingStatus.CONFIRMED && 
            booking.getStatus() != BookingStatus.DRIVER_ACCEPTED) {
            throw new RuntimeException("Booking is not ready to start");
        }
        
        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setStartTime(LocalDateTime.now());
        
        // Update vehicle status
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.IN_USE);
        vehicle.setCurrentDriver(booking.getDriver());
        vehicleRepository.save(vehicle);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // 🔔 SEND NOTIFICATION TO CUSTOMER
        notificationService.notifyTripStarted(savedBooking);
        
        System.out.println("✅ Trip started for booking: " + bookingId);
        return savedBooking;
    }
    
    // Driver completes trip
//    @Transactional
//    public Booking completeTrip(Long bookingId, Long driverId) {
//        Booking booking = bookingRepository.findById(bookingId)
//            .orElseThrow(() -> new RuntimeException("Booking not found"));
//        
//        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
//            throw new RuntimeException("Unauthorized");
//        }
//        
//        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
//            throw new RuntimeException("Trip is not in progress");
//        }
//        
//        booking.setStatus(BookingStatus.COMPLETED);
//        booking.setEndTime(LocalDateTime.now());
//        booking.setCompletedAt(LocalDateTime.now());
//        
//        // Release vehicle
//        Vehicle vehicle = booking.getVehicle();
//        vehicle.setStatus(VehicleStatus.AVAILABLE);
//        vehicle.setCurrentDriver(null);
//        vehicleRepository.save(vehicle);
//        
//        // Update driver earnings
//        User driver = booking.getDriver();
//        driver.setTotalTrips(driver.getTotalTrips() + 1);
//        driver.setTotalEarnings(driver.getTotalEarnings() + (booking.getTotalPrice() * 0.7)); // 70% to driver
//        userRepository.save(driver);
//        
//        Booking savedBooking = bookingRepository.save(booking);
//        
//        //  SEND NOTIFICATION
//        notificationService.notifyTripCompleted(savedBooking);
//        
//        System.out.println("✅ Trip completed for booking: " + bookingId);
//        return savedBooking;
//    }
    @Transactional
    public Booking completeTrip(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Trip is not in progress");
        }
        
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setEndTime(LocalDateTime.now());
        booking.setCompletedAt(LocalDateTime.now());
        
        // Set payment status to PENDING if not already paid
        if (booking.getPaymentStatus() != PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.PENDING);
        }
        
        // Release vehicle
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setCurrentDriver(null);
        vehicleRepository.save(vehicle);
        
        // Update driver earnings ONLY after payment
        // Don't update earnings here, wait for payment confirmation
        
        Booking savedBooking = bookingRepository.save(booking);
        
        System.out.println("✅ Trip completed for booking: " + bookingId + " - Waiting for payment");
        return savedBooking;
    }

    // Add payment processing method
    @Transactional
    public Booking processCustomerPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Trip must be completed before payment");
        }
        
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod(paymentMethod);
        booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        // NOW update driver earnings
        User driver = booking.getDriver();
        driver.setTotalTrips(driver.getTotalTrips() + 1);
        driver.setTotalEarnings(driver.getTotalEarnings() + (booking.getTotalPrice() * 0.7));
        userRepository.save(driver);
        
        Booking savedBooking = bookingRepository.save(booking);
        
        System.out.println("✅ Payment processed for booking: " + bookingId);
        return savedBooking;
    }
    
    // Cancel booking (customer)
    @Transactional
    public Booking cancelBooking(Long bookingId, Long customerId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized: Not your booking");
        }
        
        List<BookingStatus> cancellableStatuses = Arrays.asList(
            BookingStatus.PENDING,
            BookingStatus.APPROVED,
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED
        );
        
        if (!cancellableStatuses.contains(booking.getStatus())) {
            throw new RuntimeException("Cannot cancel booking in current state: " + booking.getStatus());
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking.setCancelledAt(LocalDateTime.now());
        
        // Release vehicle if assigned
        if (booking.getVehicle() != null) {
            Vehicle vehicle = booking.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicle.setCurrentDriver(null);
            vehicleRepository.save(vehicle);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        //  SEND NOTIFICATION
        notificationService.notifyBookingCancelled(savedBooking);
        
        return savedBooking;
    }
    
    // Get bookings for manager review
    public List<Booking> getPendingBookingsForManager() {
        System.out.println("📋 Fetching pending bookings...");
        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.PENDING);
        System.out.println("✅ Found " + bookings.size() + " pending bookings");
        return bookings;
    }
 // Get driver's active booking (IN_PROGRESS or CONFIRMED)
    public Optional<Booking> getDriverActiveBooking(Long driverId) {
        List<Booking> activeBookings = bookingRepository.findByDriverIdAndStatusIn(
            driverId, 
            Arrays.asList(BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.DRIVER_ACCEPTED)
        );
        return activeBookings.isEmpty() ? Optional.empty() : Optional.of(activeBookings.get(0));
    }

    // Get bookings by vehicle
    public List<Booking> getBookingsByVehicle(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }
    // Get driver's bookings
    public List<Booking> getDriverBookings(Long driverId) {
        return bookingRepository.findByDriverId(driverId);
    }
    
    // Get driver's completed bookings
    public List<Booking> getDriverCompletedBookings(Long driverId) {
        return bookingRepository.findByDriverIdAndStatus(driverId, BookingStatus.COMPLETED);
    }
    
    // Get customer's bookings
    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }
    
    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Calculate distance using Haversine formula
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371; // Earth radius in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}