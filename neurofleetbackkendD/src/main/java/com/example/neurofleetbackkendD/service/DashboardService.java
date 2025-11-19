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
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // ✅ ADMIN DASHBOARD
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            List<Booking> allBookings = bookingRepository.findAll();
            List<User> allUsers = userRepository.findAll();
            
            // Fleet metrics
            long availableVehicles = allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .count();
            
            long inUseVehicles = allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE)
                .count();
            
            // Booking metrics
            long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();
            
            long completedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            // Revenue
            double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            // Today's metrics
            LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
            long tripsToday = allBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .count();
            
            double revenueToday = allBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            // User metrics
            long activeDrivers = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.DRIVER && u.getActive())
                .count();
            
            long totalCustomers = allUsers.stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER)
                .count();
            
            dashboard.put("totalFleet", allVehicles.size());
            dashboard.put("availableVehicles", availableVehicles);
            dashboard.put("inUseVehicles", inUseVehicles);
            dashboard.put("totalBookings", allBookings.size());
            dashboard.put("pendingBookings", pendingBookings);
            dashboard.put("completedBookings", completedBookings);
            dashboard.put("totalRevenue", totalRevenue);
            dashboard.put("tripsToday", tripsToday);
            dashboard.put("revenueToday", revenueToday);
            dashboard.put("activeDrivers", activeDrivers);
            dashboard.put("totalCustomers", totalCustomers);
            dashboard.put("fleetUtilization", allVehicles.isEmpty() ? 0 : 
                (inUseVehicles * 100.0 / allVehicles.size()));
            
            System.out.println("✅ Admin dashboard loaded successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error loading admin dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // ✅ MANAGER DASHBOARD
    public Map<String, Object> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            List<Booking> pendingBookings = bookingRepository.findByStatus(BookingStatus.PENDING);
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            List<User> activeDrivers = userRepository.findByRoleAndActive(UserRole.DRIVER, true);
            
            long availableVehicles = allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .count();
            
            dashboard.put("pendingBookings", pendingBookings.size());
            dashboard.put("totalFleet", allVehicles.size());
            dashboard.put("availableVehicles", availableVehicles);
            dashboard.put("activeDrivers", activeDrivers.size());
            
            System.out.println("✅ Manager dashboard loaded successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error loading manager dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // ✅ DRIVER DASHBOARD
    public Map<String, Object> getDriverDashboard(Long driverId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> driverBookings = bookingRepository.findByDriverId(driverId);
            
            // Today's earnings
            LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
            double todayEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            // This week's earnings
            LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
            double weekEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(weekStart))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            // This month's earnings
            LocalDateTime monthStart = LocalDateTime.now().minusMonths(1);
            double monthEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(monthStart))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            // Today's trips
            long todayTrips = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .count();
            
            dashboard.put("todayEarnings", todayEarnings);
            dashboard.put("weekEarnings", weekEarnings);
            dashboard.put("monthEarnings", monthEarnings);
            dashboard.put("totalEarnings", driver.getTotalEarnings());
            dashboard.put("todayTrips", todayTrips);
            dashboard.put("totalTrips", driver.getTotalTrips());
            dashboard.put("rating", driver.getRating());
            dashboard.put("assignedBookings", driverBookings);
            
            System.out.println("✅ Driver dashboard loaded for: " + driver.getFullName());
            
        } catch (Exception e) {
            System.err.println("❌ Error loading driver dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // ✅ CUSTOMER DASHBOARD
    public Map<String, Object> getCustomerDashboard(Long customerId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            List<Booking> customerBookings = bookingRepository.findByCustomerId(customerId);
            
            // Active bookings
            long activeBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS || 
                            b.getStatus() == BookingStatus.CONFIRMED)
                .count();
            
            // Completed bookings
            long completedBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            // Pending bookings
            long pendingBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING)
                .count();
            
            // Total spent
            double totalSpent = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            dashboard.put("activeBookings", activeBookings);
            dashboard.put("completedBookings", completedBookings);
            dashboard.put("pendingBookings", pendingBookings);
            dashboard.put("totalBookings", customerBookings.size());
            dashboard.put("totalSpent", totalSpent);
            dashboard.put("recentBookings", customerBookings.stream()
                .limit(5)
                .collect(Collectors.toList()));
            
            System.out.println("✅ Customer dashboard loaded for: " + customer.getFullName());
            
        } catch (Exception e) {
            System.err.println("❌ Error loading customer dashboard: " + e.getMessage());
            e.printStackTrace();
        }
        
        return dashboard;
    }
    
    // ✅ KPI METRICS (for Analytics)
    public Map<String, Object> getKPIMetrics() {
        Map<String, Object> kpi = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Booking> bookings = bookingRepository.findAll();
            
            long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .count();
            
            long inUseVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE)
                .count();
            
            double totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            kpi.put("totalFleet", vehicles.size());
            kpi.put("availableVehicles", availableVehicles);
            kpi.put("inUseVehicles", inUseVehicles);
            kpi.put("totalBookings", bookings.size());
            kpi.put("totalRevenue", totalRevenue);
            kpi.put("fleetUtilization", vehicles.isEmpty() ? 0 : 
                (inUseVehicles * 100.0 / vehicles.size()));
            kpi.put("activeRoutes", inUseVehicles);
            
            LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
            long tripsToday = bookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .count();
            kpi.put("tripsToday", tripsToday);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting KPI metrics: " + e.getMessage());
            e.printStackTrace();
        }
        
        return kpi;
    }
    
    // ✅ FLEET DISTRIBUTION
    public Map<String, Object> getFleetDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            
            Map<String, Long> typeDistribution = vehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getType().name(),
                    Collectors.counting()
                ));
            
            Map<String, Long> statusDistribution = vehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getStatus().name(),
                    Collectors.counting()
                ));
            
            distribution.put("typeDistribution", typeDistribution);
            distribution.put("statusDistribution", statusDistribution);
            distribution.put("totalVehicles", vehicles.size());
            
        } catch (Exception e) {
            System.err.println("❌ Error getting fleet distribution: " + e.getMessage());
            e.printStackTrace();
        }
        
        return distribution;
    }
    
    // ✅ HOURLY ACTIVITY
    public Map<String, Object> getHourlyActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findAll();
            
            Map<Integer, Long> hourlyBookings = bookings.stream()
                .filter(b -> b.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                    b -> b.getCreatedAt().getHour(),
                    Collectors.counting()
                ));
            
            activity.put("hourlyBookings", hourlyBookings);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting hourly activity: " + e.getMessage());
            e.printStackTrace();
        }
        
        return activity;
    }
    
    // ✅ DAILY TRENDS
    public Map<String, Object> getDailyTrends(int days) {
        Map<String, Object> trends = new HashMap<>();
        
        try {
            LocalDateTime startDate = LocalDateTime.now().minusDays(days);
            List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
            
            List<String> dates = new ArrayList<>();
            List<Long> bookingCounts = new ArrayList<>();
            List<Double> revenues = new ArrayList<>();
            
            for (int i = 0; i < days; i++) {
                LocalDateTime date = LocalDateTime.now().minusDays(days - i - 1);
                String dateKey = date.toLocalDate().toString();
                dates.add(dateKey);
                
                long count = bookings.stream()
                    .filter(b -> b.getCreatedAt().toLocalDate().toString().equals(dateKey))
                    .count();
                bookingCounts.add(count);
                
                double revenue = bookings.stream()
                    .filter(b -> b.getCreatedAt().toLocalDate().toString().equals(dateKey))
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                    .sum();
                revenues.add(revenue);
            }
            
            trends.put("dates", dates);
            trends.put("bookings", bookingCounts);
            trends.put("revenue", revenues);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting daily trends: " + e.getMessage());
            e.printStackTrace();
        }
        
        return trends;
    }
    
    // ✅ VEHICLE PERFORMANCE
    public Map<String, Object> getVehiclePerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Booking> bookings = bookingRepository.findAll();
            
            List<Map<String, Object>> topVehicles = vehicles.stream()
                .limit(10)
                .map(vehicle -> {
                    long trips = bookings.stream()
                        .filter(b -> b.getVehicle() != null && 
                                    b.getVehicle().getId().equals(vehicle.getId()))
                        .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                        .count();
                    
                    double revenue = bookings.stream()
                        .filter(b -> b.getVehicle() != null && 
                                    b.getVehicle().getId().equals(vehicle.getId()))
                        .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                        .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                        .sum();
                    
                    Map<String, Object> vehicleData = new HashMap<>();
                    vehicleData.put("vehicleNumber", vehicle.getVehicleNumber());
                    vehicleData.put("model", vehicle.getModel());
                    vehicleData.put("trips", trips);
                    vehicleData.put("revenue", revenue);
                    
                    return vehicleData;
                })
                .collect(Collectors.toList());
            
            performance.put("topVehicles", topVehicles);
            
        } catch (Exception e) {
            System.err.println("❌ Error getting vehicle performance: " + e.getMessage());
            e.printStackTrace();
        }
        
        return performance;
    }
}