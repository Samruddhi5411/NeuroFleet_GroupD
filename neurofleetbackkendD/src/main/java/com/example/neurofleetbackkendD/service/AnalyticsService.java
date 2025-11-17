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
public class AnalyticsService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    public Map<String, Object> getRevenueAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        
        try {
            List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
            
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startDate;
            
            switch (period.toLowerCase()) {
                case "today":
                    startDate = now.truncatedTo(ChronoUnit.DAYS);
                    break;
                case "week":
                    startDate = now.minusWeeks(1);
                    break;
                case "month":
                    startDate = now.minusMonths(1);
                    break;
                case "year":
                    startDate = now.minusYears(1);
                    break;
                default:
                    startDate = now.minusMonths(1);
            }
            
            double totalRevenue = completedBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(startDate))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            long totalBookings = completedBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(startDate))
                .count();
            
            double avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
            
            analytics.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            analytics.put("totalBookings", totalBookings);
            analytics.put("averageBookingValue", Math.round(avgBookingValue * 100.0) / 100.0);
            analytics.put("period", period);
            
        } catch (Exception e) {
            System.err.println("❌ Error in revenue analytics: " + e.getMessage());
            analytics.put("error", e.getMessage());
        }
        
        return analytics;
    }
    
    public Map<String, Object> getVehicleUtilization() {
        Map<String, Object> utilization = new HashMap<>();
        
        try {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            long totalVehicles = allVehicles.size();
            
            Map<String, Long> statusCount = allVehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getStatus().name(),
                    Collectors.counting()
                ));
            
            long inUse = statusCount.getOrDefault("IN_USE", 0L);
            double utilizationRate = totalVehicles > 0 ? 
                (inUse * 100.0 / totalVehicles) : 0;
            
            utilization.put("totalVehicles", totalVehicles);
            utilization.put("inUse", inUse);
            utilization.put("available", statusCount.getOrDefault("AVAILABLE", 0L));
            utilization.put("maintenance", statusCount.getOrDefault("MAINTENANCE", 0L));
            utilization.put("utilizationRate", Math.round(utilizationRate * 100.0) / 100.0);
            
            Map<String, Long> typeDistribution = allVehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getType().name(),
                    Collectors.counting()
                ));
            utilization.put("typeDistribution", typeDistribution);
            
        } catch (Exception e) {
            System.err.println("❌ Error in vehicle utilization: " + e.getMessage());
            utilization.put("error", e.getMessage());
        }
        
        return utilization;
    }
    
    // Driver Performance Analytics
    public Map<String, Object> getDriverPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
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
            stats.put("completedTrips", completedTrips);
            stats.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
            stats.put("active", driver.getActive());
            
            driverStats.add(stats);
        }
        
        // Sort by completed trips
        driverStats.sort((a, b) -> 
            Long.compare((Long)b.get("completedTrips"), (Long)a.get("completedTrips")));
        
        performance.put("totalDrivers", drivers.size());
        performance.put("activeDrivers", drivers.stream().filter(User::getActive).count());
        performance.put("driverStats", driverStats);
        performance.put("topPerformers", driverStats.stream().limit(5).collect(Collectors.toList()));
        
        return performance;
    }
    
    // Maintenance Analytics
    public Map<String, Object> getMaintenanceAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<MaintenanceRecord> allRecords = maintenanceRepository.findAll();
        
        Map<MaintenanceStatus, Long> statusCount = allRecords.stream()
            .collect(Collectors.groupingBy(
                MaintenanceRecord::getStatus,
                Collectors.counting()
            ));
        
        Map<MaintenancePriority, Long> priorityCount = allRecords.stream()
            .collect(Collectors.groupingBy(
                MaintenanceRecord::getPriority,
                Collectors.counting()
            ));
        
        long predictiveAlerts = allRecords.stream()
            .filter(MaintenanceRecord::getIsPredictive)
            .count();
        
        double totalCost = allRecords.stream()
            .filter(r -> r.getEstimatedCost() != null)
            .mapToDouble(MaintenanceRecord::getEstimatedCost)
            .sum();
        
        analytics.put("totalRecords", allRecords.size());
        analytics.put("statusBreakdown", statusCount);
        analytics.put("priorityBreakdown", priorityCount);
        analytics.put("predictiveAlerts", predictiveAlerts);
        analytics.put("totalEstimatedCost", Math.round(totalCost * 100.0) / 100.0);
        
        return analytics;
    }
    
    // Booking Trends
    public Map<String, Object> getBookingTrends(int days) {
        Map<String, Object> trends = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Booking> recentBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getCreatedAt().isAfter(startDate))
            .collect(Collectors.toList());
        
        Map<String, Long> dailyBookings = new TreeMap<>();
        
        for (int i = 0; i < days; i++) {
            LocalDateTime date = LocalDateTime.now().minusDays(days - i - 1);
            String dateKey = date.toLocalDate().toString();
            
            long count = recentBookings.stream()
                .filter(b -> b.getCreatedAt().toLocalDate().toString().equals(dateKey))
                .count();
            
            dailyBookings.put(dateKey, count);
        }
        
        trends.put("period", days + " days");
        trends.put("dailyBookings", dailyBookings);
        trends.put("totalBookings", recentBookings.size());
        
        return trends;
    }
}
