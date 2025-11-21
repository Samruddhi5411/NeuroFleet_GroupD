package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.model.enums.PaymentStatus;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
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
        }
        
        System.out.println("✅ Creating booking for customer: " + booking.getCustomer().getFullName());
        return bookingRepository.save(booking);
    }
    
    // Manager approves booking (without driver assignment)
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
    
    //  Assign driver to approved booking
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
        
        System.out.println("✅ Driver " + driver.getFullName() + " assigned to booking " + bookingId);
        return bookingRepository.save(booking);
    }
    
    // Manager approves and assigns driver 
    public Booking managerApproveAndAssignDriver(Long bookingId, Long managerId, 
                                                  Long driverId, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not in pending state");
        }
        
        User manager = userRepository.findById(managerId)
            .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        if (manager.getRole() != UserRole.MANAGER && manager.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only managers can approve bookings");
        }
        
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        if (driver.getRole() != UserRole.DRIVER) {
            throw new RuntimeException("Selected user is not a driver");
        }
        
        if (!driver.getActive()) {
            throw new RuntimeException("Driver is not active");
        }
        
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        booking.setApprovedByManager(manager);
        booking.setDriver(driver);
        booking.setManagerNotes(notes);
        booking.setApprovedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    // Driver accepts booking
    @Transactional
    public Booking driverAcceptBooking(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("This booking is not assigned to you");
        }
        
        if (booking.getStatus() != BookingStatus.DRIVER_ASSIGNED) {
            throw new RuntimeException("Booking is not in assigned state");
        }
        
        booking.setStatus(BookingStatus.DRIVER_ACCEPTED);
        booking.setDriverAcceptedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    // Driver rejects booking
    @Transactional
    public Booking driverRejectBooking(Long bookingId, Long driverId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("This booking is not assigned to you");
        }
        
        if (booking.getStatus() != BookingStatus.DRIVER_ASSIGNED) {
            throw new RuntimeException("Cannot reject booking in current state");
        }
        
        booking.setStatus(BookingStatus.PENDING);
        booking.setDriver(null);
        booking.setDriverNotes("Rejected: " + reason);
        
        return bookingRepository.save(booking);
    }
    
    // Customer makes payment
    @Transactional
    public Booking processPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != BookingStatus.DRIVER_ACCEPTED) {
            throw new RuntimeException("Booking not ready for payment");
        }
        
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentMethod(paymentMethod);
        booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
        booking.setStatus(BookingStatus.CONFIRMED);
        
        // Mark vehicle as IN_USE
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.IN_USE);
        vehicle.setCurrentDriver(booking.getDriver());
        vehicleRepository.save(vehicle);
        
        return bookingRepository.save(booking);
    }
    
    // Driver starts trip
    @Transactional
    public Booking startTrip(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getDriver() == null || !booking.getDriver().getId().equals(driverId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking is not confirmed");
        }
        
        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setStartTime(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    // Driver completes trip
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
        
        // Release vehicle and driver
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setCurrentDriver(null);
        vehicleRepository.save(vehicle);
        
        return bookingRepository.save(booking);
    }
    
    // Cancel booking (customer)
    @Transactional
    public Booking cancelBooking(Long bookingId, Long customerId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized: Not your booking");
        }
        
        // Only allow cancellation for certain statuses
        List<BookingStatus> cancellableStatuses = Arrays.asList(
            BookingStatus.PENDING,
            BookingStatus.APPROVED,
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.CONFIRMED
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
            if (vehicle.getStatus() == VehicleStatus.IN_USE) {
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicle.setCurrentDriver(null);
                vehicleRepository.save(vehicle);
            }
        }
        
        // Process refund if payment was made
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        
        return bookingRepository.save(booking);
    }
    
    // Get bookings for manager review
    public List<Booking> getPendingBookingsForManager() {
        System.out.println("📋 Fetching pending bookings from database...");
        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.PENDING);
        System.out.println("✅ Found " + bookings.size() + " pending bookings");
        return bookings;
    }
    
    // Get driver's bookings
    public List<Booking> getDriverBookings(Long driverId) {
        return bookingRepository.findByDriverId(driverId);
    }
    
    // Get driver's active booking
    public Optional<Booking> getDriverActiveBooking(Long driverId) {
        List<BookingStatus> activeStatuses = Arrays.asList(
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.CONFIRMED,
            BookingStatus.IN_PROGRESS
        );
        
        List<Booking> bookings = bookingRepository.findByDriverId(driverId);
        return bookings.stream()
            .filter(b -> activeStatuses.contains(b.getStatus()))
            .findFirst();
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
    
    // Get bookings by vehicle
    public List<Booking> getBookingsByVehicle(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }
    
    // Calculate distance using Haversine formula
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in km
    }
}