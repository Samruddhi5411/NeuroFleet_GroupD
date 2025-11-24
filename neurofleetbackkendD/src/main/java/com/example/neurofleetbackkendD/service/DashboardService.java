package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.MaintenanceRecord;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    /**
     * Admin Dashboard - Complete Overview
     */
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Fleet Stats
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        dashboard.put("totalFleet", allVehicles.size());
        dashboard.put("vehiclesAvailable", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
        dashboard.put("vehiclesInUse", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
        dashboard.put("vehiclesMaintenance", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count());
        
        // Booking Stats
        List<Booking> allBookings = bookingRepository.findAll();
        dashboard.put("totalBookings", allBookings.size());
        dashboard.put("activeTrips", allBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count());
        
        // User Stats
        dashboard.put("totalDrivers", userRepository.findByRole(UserRole.DRIVER).size());
        dashboard.put("totalManagers", userRepository.findByRole(UserRole.MANAGER).size());
        dashboard.put("totalCustomers", userRepository.findByRole(UserRole.CUSTOMER).size());
        
        // Maintenance Schedule
        List<MaintenanceRecord> maintenance = maintenanceRepository.findAll();
        dashboard.put("maintenanceSchedule", maintenance.stream()
            .limit(10)
            .collect(Collectors.toList()));
        
        // Hourly Activity - Sample data
        Map<String, Object> hourlyActivity = new HashMap<>();
        hourlyActivity.put("labels", Arrays.asList("00:00", "06:00", "12:00", "18:00"));
        hourlyActivity.put("values", Arrays.asList(5, 15, 30, 20));
        dashboard.put("hourlyActivity", hourlyActivity);
        
        System.out.println("✅ Admin Dashboard loaded with " + allVehicles.size() + " vehicles");
        
        return dashboard;
    }
    
    /**
     * Manager Dashboard
     */
    public Map<String, Object> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Pending bookings count
        long pendingCount = bookingRepository.findByStatus(BookingStatus.PENDING).size();
        dashboard.put("pendingBookings", pendingCount);
        
        // Active trips
        long activeTrips = bookingRepository.findAll().stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS || 
                        b.getStatus() == BookingStatus.CONFIRMED)
            .count();
        dashboard.put("activeTrips", activeTrips);
        
        // Available drivers
        long availableDrivers = userRepository.findByRole(UserRole.DRIVER).stream()
            .filter(User::getActive)
            .count();
        dashboard.put("availableDrivers", availableDrivers);
        
        // Vehicles needing attention
        long maintenanceVehicles = vehicleRepository.findByStatus(VehicleStatus.MAINTENANCE).size();
        dashboard.put("maintenanceVehicles", maintenanceVehicles);
        
        System.out.println("✅ Manager Dashboard loaded");
        return dashboard;
    }
    
    /**
     * Driver Dashboard
     */
    public Map<String, Object> getDriverDashboard(Long driverId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        // Driver stats
        dashboard.put("totalTrips", driver.getTotalTrips());
        dashboard.put("totalEarnings", driver.getTotalEarnings());
        dashboard.put("rating", driver.getRating());
        
        // Assigned bookings
        List<Booking> assignedBookings = bookingRepository.findByDriverId(driverId);
        dashboard.put("assignedBookings", assignedBookings.size());
        
        // Active booking
        Optional<Booking> activeBooking = assignedBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS || 
                        b.getStatus() == BookingStatus.CONFIRMED)
            .findFirst();
        dashboard.put("activeBooking", activeBooking.orElse(null));
        
        System.out.println("✅ Driver Dashboard loaded for " + driver.getFullName());
        return dashboard;
    }
    
    /**
     * Manager Performance Metrics
     */
    public Map<String, Object> getManagerPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        List<User> managers = userRepository.findByRole(UserRole.MANAGER);
        List<Map<String, Object>> managerStats = new ArrayList<>();
        
        for (User manager : managers) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", manager.getId());
            stats.put("name", manager.getFullName());
            
            // Count bookings approved by this manager
            long approvedCount = bookingRepository.findAll().stream()
                .filter(b -> b.getApprovedByManager() != null && 
                           b.getApprovedByManager().getId().equals(manager.getId()))
                .count();
            stats.put("approvedBookings", approvedCount);
            
            managerStats.add(stats);
        }
        
        performance.put("managers", managerStats);
        return performance;
    }
    
    /**
     * Driver Performance Metrics
     */
    public Map<String, Object> getDriverPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        List<Map<String, Object>> driverStats = new ArrayList<>();
        
        for (User driver : drivers) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", driver.getId());
            stats.put("name", driver.getFullName());
            stats.put("totalTrips", driver.getTotalTrips());
            stats.put("totalEarnings", driver.getTotalEarnings());
            stats.put("rating", driver.getRating());
            
            // Active status
            Optional<Booking> activeBooking = bookingRepository.findByDriverId(driver.getId())
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .findFirst();
            stats.put("currentlyActive", activeBooking.isPresent());
            
            driverStats.add(stats);
        }
        
        performance.put("drivers", driverStats);
        return performance;
    }
}