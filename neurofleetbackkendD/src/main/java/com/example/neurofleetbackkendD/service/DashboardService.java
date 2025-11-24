package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
    
    // ADMIN DASHBOARD
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            dashboard.put("totalFleet", allVehicles.size());
            dashboard.put("vehiclesAvailable", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
            dashboard.put("vehiclesInUse", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
            dashboard.put("vehiclesMaintenance", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count());
            
            List<Booking> allBookings = bookingRepository.findAll();
            List<Booking> todayBookings = allBookings.stream()
                .filter(b -> b.getCreatedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .collect(Collectors.toList());
            
            dashboard.put("totalBookings", allBookings.size());
            dashboard.put("activeTrips", allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count());
            dashboard.put("tripsToday", todayBookings.size());
            dashboard.put("completedTrips", allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count());
            
            double todayEarnings = todayBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            dashboard.put("earningsToday", Math.round(todayEarnings * 100.0) / 100.0);
            dashboard.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            
            List<MaintenanceRecord> maintenanceSchedule = maintenanceRepository
                .findByStatus(MaintenanceStatus.SCHEDULED);
            dashboard.put("maintenanceSchedule", maintenanceSchedule);
            
            Map<String, Object> hourlyActivity = getHourlyActivity();
            dashboard.put("hourlyActivity", hourlyActivity);
            
            System.out.println("✅ Admin dashboard generated successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error generating admin dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // MANAGER DASHBOARD
    public Map<String, Object> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            List<Booking> pendingBookings = bookingRepository
                .findByStatus(BookingStatus.PENDING);
            dashboard.put("pendingApprovals", pendingBookings.size());
            dashboard.put("pendingBookings", pendingBookings);
            
            List<Booking> activeTrips = bookingRepository
                .findByStatus(BookingStatus.IN_PROGRESS);
            dashboard.put("activeTrips", activeTrips.size());
            dashboard.put("activeTripsData", activeTrips);
            
            List<User> availableDrivers = userRepository
                .findByRoleAndActive(UserRole.DRIVER, true);
            dashboard.put("availableDrivers", availableDrivers.size());
            dashboard.put("driversList", availableDrivers);
            
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            dashboard.put("totalVehicles", allVehicles.size());
            dashboard.put("availableVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
            dashboard.put("vehiclesInUse", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
            
            System.out.println("✅ Manager dashboard generated successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error generating manager dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // DRIVER DASHBOARD
    public Map<String, Object> getDriverDashboard(Long driverId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> assignedBookings = bookingRepository.findByDriverId(driverId);
            List<Booking> activeBookings = assignedBookings.stream()
                .filter(b -> Arrays.asList(
                    BookingStatus.DRIVER_ASSIGNED,
                    BookingStatus.DRIVER_ACCEPTED,
                    BookingStatus.CONFIRMED,
                    BookingStatus.IN_PROGRESS
                ).contains(b.getStatus()))
                .collect(Collectors.toList());
            
            dashboard.put("assignedTrips", assignedBookings.size());
            dashboard.put("activeTrips", activeBookings);
            dashboard.put("completedTrips", assignedBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count());
            
            double totalEarnings = assignedBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
                .sum();
            
            double todayEarnings = assignedBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getCompletedAt() != null && 
                    b.getCompletedAt().toLocalDate().equals(LocalDateTime.now().toLocalDate()))
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
                .sum();
            
            dashboard.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
            dashboard.put("todayEarnings", Math.round(todayEarnings * 100.0) / 100.0);
            dashboard.put("rating", driver.getRating());
            
            System.out.println("✅ Driver dashboard generated successfully for: " + driver.getFullName());
            
        } catch (Exception e) {
            System.err.println("❌ Error generating driver dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // HOURLY ACTIVITY CHART
    private Map<String, Object> getHourlyActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        List<String> labels = new ArrayList<>();
        List<Integer> values = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dayStart = now.truncatedTo(ChronoUnit.DAYS);
        
        List<Booking> todayBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getCreatedAt().isAfter(dayStart))
            .collect(Collectors.toList());
        
        for (int hour = 0; hour < 24; hour++) {
            labels.add(String.format("%02d:00", hour));
            
            int hourFinal = hour;
            long count = todayBookings.stream()
                .filter(b -> b.getCreatedAt().getHour() == hourFinal)
                .count();
            
            values.add((int) count);
        }
        
        activity.put("labels", labels);
        activity.put("values", values);
        
        return activity;
    }
    
    // MANAGER PERFORMANCE METRICS
    public Map<String, Object> getManagerPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        try {
            List<User> managers = userRepository.findByRole(UserRole.MANAGER);
            List<Booking> allBookings = bookingRepository.findAll();
            
            List<Map<String, Object>> managerStats = new ArrayList<>();
            
            for (User manager : managers) {
                List<Booking> approvedByManager = allBookings.stream()
                    .filter(b -> b.getApprovedByManager() != null && 
                        b.getApprovedByManager().getId().equals(manager.getId()))
                    .collect(Collectors.toList());
                
                double avgApprovalTime = approvedByManager.stream()
                    .filter(b -> b.getCreatedAt() != null && b.getApprovedAt() != null)
                    .mapToLong(b -> ChronoUnit.MINUTES.between(b.getCreatedAt(), b.getApprovedAt()))
                    .average()
                    .orElse(0);
                
                Map<String, Object> stats = new HashMap<>();
                stats.put("managerId", manager.getId());
                stats.put("managerName", manager.getFullName());
                stats.put("totalApprovals", approvedByManager.size());
                stats.put("avgApprovalTime", Math.round(avgApprovalTime));
                stats.put("pendingApprovals", bookingRepository.findByStatus(BookingStatus.PENDING).size());
                
                managerStats.add(stats);
            }
            
            performance.put("totalManagers", managers.size());
            performance.put("managerStats", managerStats);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting manager performance: " + e.getMessage());
        }
        
        return performance;
    }
    
    // DRIVER PERFORMANCE METRICS
    public Map<String, Object> getDriverPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        try {
            List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
            List<Booking> allBookings = bookingRepository.findAll();
            
            List<Map<String, Object>> driverStats = new ArrayList<>();
            
            for (User driver : drivers) {
                List<Booking> driverBookings = allBookings.stream()
                    .filter(b -> b.getDriver() != null && 
                        b.getDriver().getId().equals(driver.getId()))
                    .collect(Collectors.toList());
                
                long completedTrips = driverBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .count();
                
                double totalEarnings = driverBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
                    .sum();
                
                Map<String, Object> stats = new HashMap<>();
                stats.put("driverId", driver.getId());
                stats.put("driverName", driver.getFullName());
                stats.put("rating", driver.getRating());
                stats.put("completedTrips", completedTrips);
                stats.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
                stats.put("active", driver.getActive());
                
                driverStats.add(stats);
            }
            
            driverStats.sort((a, b) -> 
                Long.compare((Long)b.get("completedTrips"), (Long)a.get("completedTrips")));
            
            performance.put("totalDrivers", drivers.size());
            performance.put("activeDrivers", drivers.stream().filter(User::getActive).count());
            performance.put("driverStats", driverStats);
            performance.put("topPerformers", driverStats.stream().limit(5).collect(Collectors.toList()));
            
        } catch (Exception e) {
            System.err.println("❌ Error getting driver performance: " + e.getMessage());
        }
        
        return performance;
    }
}