package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private VehicleHealthLogRepository vehicleHealthLogRepository;
    
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // KPI Cards
            long totalVehicles = vehicleRepository.count();
            long totalDrivers = userRepository.findByRole(UserRole.DRIVER).size();
            long totalCustomers = userRepository.findByRole(UserRole.CUSTOMER).size();
            long totalBookings = bookingRepository.count();
            
            dashboard.put("totalVehicles", totalVehicles);
            dashboard.put("totalDrivers", totalDrivers);
            dashboard.put("totalCustomers", totalCustomers);
            dashboard.put("totalBookings", totalBookings);
            
            // Vehicle Status Distribution
            Map<String, Long> vehicleStatus = new HashMap<>();
            vehicleStatus.put("available", (long) vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size());
            vehicleStatus.put("inUse", (long) vehicleRepository.findByStatus(VehicleStatus.IN_USE).size());
            vehicleStatus.put("maintenance", (long) vehicleRepository.findByStatus(VehicleStatus.MAINTENANCE).size());
            vehicleStatus.put("outOfService", (long) vehicleRepository.findByStatus(VehicleStatus.OUT_OF_SERVICE).size());
            dashboard.put("vehicleStatus", vehicleStatus);
            
            // Booking Status Distribution
            Map<String, Long> bookingStatus = new HashMap<>();
            bookingStatus.put("pending", (long) bookingRepository.findByStatus(BookingStatus.PENDING).size());
            bookingStatus.put("confirmed", (long) bookingRepository.findByStatus(BookingStatus.CONFIRMED).size());
            bookingStatus.put("inProgress", (long) bookingRepository.findByStatus(BookingStatus.IN_PROGRESS).size());
            bookingStatus.put("completed", (long) bookingRepository.findByStatus(BookingStatus.COMPLETED).size());
            bookingStatus.put("cancelled", (long) bookingRepository.findByStatus(BookingStatus.CANCELLED).size());
            dashboard.put("bookingStatus", bookingStatus);
            
            // Recent Bookings (Last 10)
            List<Booking> recentBookings = bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());
            dashboard.put("recentBookings", recentBookings);
            
            // Revenue
            List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
            double totalRevenue = completedBookings.stream()
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            dashboard.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            
            // Today's bookings
            LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            long todayBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt().isAfter(today))
                .count();
            dashboard.put("todayBookings", todayBookings);
            
            // Active drivers
            long activeDrivers = userRepository.findByRoleAndActive(UserRole.DRIVER, true).size();
            dashboard.put("activeDrivers", activeDrivers);
            
            // Maintenance alerts
            List<MaintenanceRecord> pendingMaintenance = maintenanceRepository.findByStatus("PENDING");
            dashboard.put("maintenanceAlerts", pendingMaintenance.size());
            dashboard.put("pendingMaintenance", pendingMaintenance);
            
            // Fleet health
            List<Vehicle> vehicles = vehicleRepository.findAll();
            double avgHealth = vehicles.stream()
                .mapToInt(Vehicle::getHealthScore)
                .average()
                .orElse(0);
            dashboard.put("averageFleetHealth", Math.round(avgHealth));
            
            // Vehicle list with details
            dashboard.put("vehicles", vehicles);
            
            // Active bookings
            List<BookingStatus> activeStatuses = Arrays.asList(
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_ACCEPTED,
                BookingStatus.CONFIRMED,
                BookingStatus.IN_PROGRESS
            );
            List<Booking> activeBookings = bookingRepository.findByStatusIn(activeStatuses);
            dashboard.put("activeBookings", activeBookings);
            
            System.out.println("✅ Admin Dashboard Data Loaded: " + dashboard.keySet());
            
        } catch (Exception e) {
            System.err.println("❌ Error loading admin dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    public Map<String, Object> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Pending approvals
        List<Booking> pendingBookings = bookingRepository.findByStatus(BookingStatus.PENDING);
        dashboard.put("pendingApprovals", pendingBookings.size());
        dashboard.put("pendingBookings", pendingBookings);
        
        // Available drivers
        List<User> availableDrivers = userRepository.findByRoleAndActive(UserRole.DRIVER, true);
        dashboard.put("availableDrivers", availableDrivers.size());
        dashboard.put("driversList", availableDrivers);
        
        // Active bookings
        List<BookingStatus> activeStatuses = Arrays.asList(
            BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.DRIVER_ACCEPTED,
            BookingStatus.CONFIRMED,
            BookingStatus.IN_PROGRESS
        );
        List<Booking> activeBookings = bookingRepository.findByStatusIn(activeStatuses);
        dashboard.put("activeBookings", activeBookings.size());
        dashboard.put("activeBookingsList", activeBookings);
        
        // Available vehicles
        List<Vehicle> availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        dashboard.put("availableVehicles", availableVehicles.size());
        
        // Today's completed trips
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long completedToday = bookingRepository.findByStatus(BookingStatus.COMPLETED).stream()
            .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
            .count();
        dashboard.put("completedToday", completedToday);
        
        return dashboard;
    }
    
    public Map<String, Object> getDriverDashboard(Long driverId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        List<Booking> allBookings = bookingRepository.findByDriverId(driverId);
        dashboard.put("totalBookings", allBookings.size());
        
        // Assigned booking (waiting for acceptance)
        Optional<Booking> assignedBooking = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.DRIVER_ASSIGNED)
            .findFirst();
        dashboard.put("hasAssignedBooking", assignedBooking.isPresent());
        if (assignedBooking.isPresent()) {
            dashboard.put("assignedBooking", assignedBooking.get());
        }
        
        // Current active booking
        Optional<Booking> activeBooking = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
            .findFirst();
        dashboard.put("hasActiveBooking", activeBooking.isPresent());
        if (activeBooking.isPresent()) {
            dashboard.put("activeBooking", activeBooking.get());
        }
        
        // Confirmed booking
        Optional<Booking> confirmedBooking = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
            .findFirst();
        dashboard.put("hasConfirmedBooking", confirmedBooking.isPresent());
        if (confirmedBooking.isPresent()) {
            dashboard.put("confirmedBooking", confirmedBooking.get());
        }
        
        // All driver bookings
        dashboard.put("allBookings", allBookings);
        
        // Completed trips
        long completedTrips = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .count();
        dashboard.put("completedTrips", completedTrips);
        
        // Today's earnings
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        double todayEarnings = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
            .sum();
        dashboard.put("todayEarnings", Math.round(todayEarnings * 100.0) / 100.0);
        
        // Total earnings
        double totalEarnings = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
            .sum();
        dashboard.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
        
        // Current vehicle
        List<Vehicle> assignedVehicles = vehicleRepository.findByCurrentDriverId(driverId);
        if (!assignedVehicles.isEmpty()) {
            dashboard.put("currentVehicle", assignedVehicles.get(0));
        }
        
        return dashboard;
    }
    
    public Map<String, Object> getCustomerDashboard(Long customerId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        List<Booking> allBookings = bookingRepository.findByCustomerId(customerId);
        dashboard.put("totalBookings", allBookings.size());
        dashboard.put("allBookings", allBookings);
        
        // Active booking
        Optional<Booking> activeBooking = allBookings.stream()
            .filter(b -> Arrays.asList(
                BookingStatus.PENDING,
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_ACCEPTED,
                BookingStatus.CONFIRMED,
                BookingStatus.IN_PROGRESS
            ).contains(b.getStatus()))
            .findFirst();
        dashboard.put("hasActiveBooking", activeBooking.isPresent());
        if (activeBooking.isPresent()) {
            dashboard.put("activeBooking", activeBooking.get());
        }
        
        // Completed trips
        long completedTrips = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .count();
        dashboard.put("completedTrips", completedTrips);
        
        // Total spent
        double totalSpent = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
            .sum();
        dashboard.put("totalSpent", Math.round(totalSpent * 100.0) / 100.0);
        
        // Cancelled bookings
        long cancelledBookings = allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
            .count();
        dashboard.put("cancelledBookings", cancelledBookings);
        
        // Recent bookings
        List<Booking> recentBookings = allBookings.stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(5)
            .collect(Collectors.toList());
        dashboard.put("recentBookings", recentBookings);
        
        // Available vehicles
        List<Vehicle> availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        dashboard.put("availableVehicles", availableVehicles.size());
        dashboard.put("availableVehiclesList", availableVehicles);
        
        return dashboard;
    }
}
