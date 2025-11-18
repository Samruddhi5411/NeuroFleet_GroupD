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
    
    /**
     * Get comprehensive admin dashboard data
     */
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Fleet Statistics
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            dashboard.put("totalFleet", allVehicles.size());
            dashboard.put("availableVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
            dashboard.put("inUseVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
            dashboard.put("maintenanceVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count());
            
            // Booking Statistics
            List<Booking> allBookings = bookingRepository.findAll();
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            
            dashboard.put("totalBookings", allBookings.size());
            dashboard.put("activeTrips", allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count());
            dashboard.put("pendingBookings", allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING).count());
            dashboard.put("tripsToday", allBookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(today)).count());
            
            // Revenue Statistics
            double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            double revenueToday = allBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            dashboard.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            dashboard.put("revenueToday", Math.round(revenueToday * 100.0) / 100.0);
            
            // Maintenance Statistics
            List<MaintenanceRecord> maintenance = maintenanceRepository.findAll();
            dashboard.put("maintenanceDue", maintenance.stream()
                .filter(m -> m.getStatus() == MaintenanceStatus.PENDING).count());
            dashboard.put("predictiveAlerts", maintenance.stream()
                .filter(MaintenanceRecord::getIsPredictive).count());
            
            // User Statistics
            dashboard.put("totalUsers", userRepository.count());
            dashboard.put("activeDrivers", userRepository.findByRoleAndActive(UserRole.DRIVER, true).size());
            
            // Fleet Utilization
            double utilization = allVehicles.isEmpty() ? 0 : 
                (allVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.IN_USE).count() * 100.0) 
                / allVehicles.size();
            dashboard.put("fleetUtilization", Math.round(utilization * 100.0) / 100.0);
            
            // Average health score
            double avgHealth = allVehicles.stream()
                .mapToInt(v -> v.getHealthScore() != null ? v.getHealthScore() : 100)
                .average()
                .orElse(100.0);
            dashboard.put("averageUtilization", Math.round(avgHealth * 100.0) / 100.0);
            
            // Active routes (bookings in progress)
            dashboard.put("activeRoutes", allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count());
            
            System.out.println("✅ Admin dashboard data compiled successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error compiling dashboard: " + e.getMessage());
            e.printStackTrace();
            dashboard.put("error", e.getMessage());
        }
        
        return dashboard;
    }
    
    /**
     * Get Manager Dashboard Data
     */
    public Map<String, Object> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            List<Booking> allBookings = bookingRepository.findAll();
            List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            
            // Fleet Overview
            dashboard.put("totalFleet", allVehicles.size());
            dashboard.put("availableVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
            dashboard.put("inUseVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
            dashboard.put("maintenanceVehicles", allVehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count());
            
            // Booking Management
            long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING).count();
            long activeBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count();
            long todayBookings = allBookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(today)).count();
            
            dashboard.put("pendingBookings", pendingBookings);
            dashboard.put("activeBookings", activeBookings);
            dashboard.put("todayBookings", todayBookings);
            dashboard.put("totalBookings", allBookings.size());
            
            // Driver Management
            long activeDrivers = drivers.stream().filter(User::getActive).count();
            long busyDrivers = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .map(Booking::getDriver)
                .filter(Objects::nonNull)
                .distinct()
                .count();
            long availableDrivers = activeDrivers - busyDrivers;
            
            dashboard.put("totalDrivers", drivers.size());
            dashboard.put("activeDrivers", activeDrivers);
            dashboard.put("availableDrivers", Math.max(0, availableDrivers));
            dashboard.put("busyDrivers", busyDrivers);
            
            // Revenue
            double todayRevenue = allBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            dashboard.put("todayRevenue", Math.round(todayRevenue * 100.0) / 100.0);
            dashboard.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            
            // Fleet Utilization
            double utilization = allVehicles.isEmpty() ? 0 : 
                (allVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.IN_USE).count() * 100.0) 
                / allVehicles.size();
            dashboard.put("fleetUtilization", Math.round(utilization * 100.0) / 100.0);
            
            // Maintenance Alerts
            List<MaintenanceRecord> maintenance = maintenanceRepository.findAll();
            long pendingMaintenance = maintenance.stream()
                .filter(m -> m.getStatus() == MaintenanceStatus.PENDING).count();
            long criticalMaintenance = maintenance.stream()
                .filter(m -> m.getPriority() == MaintenancePriority.CRITICAL).count();
            
            dashboard.put("pendingMaintenance", pendingMaintenance);
            dashboard.put("criticalMaintenance", criticalMaintenance);
            
            System.out.println("✅ Manager dashboard data compiled successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error compiling manager dashboard: " + e.getMessage());
            e.printStackTrace();
            dashboard.put("error", e.getMessage());
        }
        
        return dashboard;
    }
    
    /**
     * Get Driver Dashboard Data
     */
    public Map<String, Object> getDriverDashboard(Long driverId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            List<Booking> driverBookings = bookingRepository.findByDriverId(driverId);
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            LocalDateTime thisWeek = LocalDateTime.now().minusWeeks(1);
            LocalDateTime thisMonth = LocalDateTime.now().minusMonths(1);
            
            // Driver Info
            dashboard.put("driverName", driver.getFullName());
            dashboard.put("driverEmail", driver.getEmail());
            dashboard.put("driverPhone", driver.getPhone());
            dashboard.put("active", driver.getActive());
            
            // Current Status
            Optional<Booking> activeBooking = driverBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .findFirst();
            
            dashboard.put("hasActiveTrip", activeBooking.isPresent());
            dashboard.put("activeBooking", activeBooking.orElse(null));
            
            // Trip Statistics
            long totalTrips = driverBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
            
            long todayTrips = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            long weekTrips = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(thisWeek))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            long monthTrips = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(thisMonth))
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            dashboard.put("totalTrips", totalTrips);
            dashboard.put("todayTrips", todayTrips);
            dashboard.put("weekTrips", weekTrips);
            dashboard.put("monthTrips", monthTrips);
            
            // Earnings (70% of booking price goes to driver)
            double totalEarnings = driverBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(b -> b.getTotalPrice() * 0.7)
                .sum();
            
            double todayEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(b -> b.getTotalPrice() * 0.7)
                .sum();
            
            double weekEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(thisWeek))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(b -> b.getTotalPrice() * 0.7)
                .sum();
            
            double monthEarnings = driverBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(thisMonth))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(b -> b.getTotalPrice() * 0.7)
                .sum();
            
            dashboard.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
            dashboard.put("todayEarnings", Math.round(todayEarnings * 100.0) / 100.0);
            dashboard.put("weekEarnings", Math.round(weekEarnings * 100.0) / 100.0);
            dashboard.put("monthEarnings", Math.round(monthEarnings * 100.0) / 100.0);
            
            // Pending Assignments
            long pendingAssignments = driverBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
            
            dashboard.put("pendingAssignments", pendingAssignments);
            
            // Recent Trips
            List<Booking> recentTrips = driverBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .sorted((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()))
                .limit(5)
                .collect(Collectors.toList());
            
            dashboard.put("recentTrips", recentTrips);
            
            // Performance Rating (mock - implement real rating system)
            dashboard.put("rating", 4.7);
            dashboard.put("totalRatings", totalTrips);
            
            System.out.println("✅ Driver dashboard data compiled for driver ID: " + driverId);
            
        } catch (Exception e) {
            System.err.println("❌ Error compiling driver dashboard: " + e.getMessage());
            e.printStackTrace();
            dashboard.put("error", e.getMessage());
        }
        
        return dashboard;
    }
    
    /**
     * Get Customer Dashboard Data
     */
    public Map<String, Object> getCustomerDashboard(Long customerId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            List<Booking> customerBookings = bookingRepository.findByCustomerId(customerId);
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            LocalDateTime thisMonth = LocalDateTime.now().minusMonths(1);
            
            // Customer Info
            dashboard.put("customerName", customer.getFullName());
            dashboard.put("customerEmail", customer.getEmail());
            dashboard.put("customerPhone", customer.getPhone());
            
            // Booking Statistics
            long totalBookings = customerBookings.size();
            long completedBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
            long activeBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count();
            long pendingBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING).count();
            long cancelledBookings = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
            
            dashboard.put("totalBookings", totalBookings);
            dashboard.put("completedBookings", completedBookings);
            dashboard.put("activeBookings", activeBookings);
            dashboard.put("pendingBookings", pendingBookings);
            dashboard.put("cancelledBookings", cancelledBookings);
            
            // Current Active Trip
            Optional<Booking> activeTrip = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS)
                .findFirst();
            
            dashboard.put("hasActiveTrip", activeTrip.isPresent());
            dashboard.put("activeTrip", activeTrip.orElse(null));
            
            // Spending Statistics
            double totalSpent = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            double monthSpent = customerBookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(thisMonth))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            double avgBookingCost = completedBookings > 0 ? totalSpent / completedBookings : 0;
            
            dashboard.put("totalSpent", Math.round(totalSpent * 100.0) / 100.0);
            dashboard.put("monthSpent", Math.round(monthSpent * 100.0) / 100.0);
            dashboard.put("avgBookingCost", Math.round(avgBookingCost * 100.0) / 100.0);
            
            // Recent Bookings
            List<Booking> recentBookings = customerBookings.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
            
            dashboard.put("recentBookings", recentBookings);
            
            // Favorite Vehicle Type (most booked)
            Map<String, Long> vehicleTypeCount = customerBookings.stream()
                .filter(b -> b.getVehicle() != null)
                .collect(Collectors.groupingBy(
                    b -> b.getVehicle().getType().name(),
                    Collectors.counting()
                ));
            
            String favoriteType = vehicleTypeCount.isEmpty() ? "None" : 
                Collections.max(vehicleTypeCount.entrySet(), Map.Entry.comparingByValue()).getKey();
            
            dashboard.put("favoriteVehicleType", favoriteType);
            
            // Member Since
            dashboard.put("memberSince", customer.getCreatedAt());
            
            // Loyalty Points (mock - implement real loyalty system)
            int loyaltyPoints = (int) (completedBookings * 10);
            dashboard.put("loyaltyPoints", loyaltyPoints);
            
            System.out.println("✅ Customer dashboard data compiled for customer ID: " + customerId);
            
        } catch (Exception e) {
            System.err.println("❌ Error compiling customer dashboard: " + e.getMessage());
            e.printStackTrace();
            dashboard.put("error", e.getMessage());
        }
        
        return dashboard;
    }
    
    /**
     * Get KPI metrics for analytics dashboard
     */
    public Map<String, Object> getKPIMetrics() {
        Map<String, Object> kpi = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Booking> bookings = bookingRepository.findAll();
            
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime weekAgo = now.minusWeeks(1);
            
            // Current metrics
            long totalFleet = vehicles.size();
            long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
            long inUseVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count();
            long maintenanceVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count();
            
            long totalBookings = bookings.size();
            double totalRevenue = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            // Last week metrics for growth calculation
            long bookingsLastWeek = bookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(weekAgo) && b.getCreatedAt().isBefore(now.minusDays(7)))
                .count();
            
            long bookingsThisWeek = bookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(weekAgo))
                .count();
            
            double revenueLastWeek = bookings.stream()
                .filter(b -> b.getCompletedAt() != null)
                .filter(b -> b.getCompletedAt().isAfter(weekAgo) && b.getCompletedAt().isBefore(now.minusDays(7)))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            double revenueThisWeek = bookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(weekAgo))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            // Calculate growth percentages
            double bookingsGrowth = bookingsLastWeek > 0 ? 
                ((bookingsThisWeek - bookingsLastWeek) * 100.0 / bookingsLastWeek) : 0;
            double revenueGrowth = revenueLastWeek > 0 ? 
                ((revenueThisWeek - revenueLastWeek) * 100.0 / revenueLastWeek) : 0;
            
            double fleetUtilization = totalFleet > 0 ? (inUseVehicles * 100.0 / totalFleet) : 0;
            double utilizationGrowth = 5.2; // Mock growth - you can calculate historical comparison
            
            // Today's metrics
            LocalDateTime today = now.truncatedTo(ChronoUnit.DAYS);
            long tripsToday = bookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(today)).count();
            
            long activeRoutes = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count();
            
            double revenueToday = bookings.stream()
                .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
                .filter(b -> b.getTotalPrice() != null)
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            
            // Populate KPI map
            kpi.put("totalFleet", totalFleet);
            kpi.put("availableVehicles", availableVehicles);
            kpi.put("inUseVehicles", inUseVehicles);
            kpi.put("maintenanceVehicles", maintenanceVehicles);
            
            kpi.put("totalBookings", totalBookings);
            kpi.put("bookingsGrowth", Math.round(bookingsGrowth * 100.0) / 100.0);
            
            kpi.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            kpi.put("revenueGrowth", Math.round(revenueGrowth * 100.0) / 100.0);
            kpi.put("revenueToday", Math.round(revenueToday * 100.0) / 100.0);
            
            kpi.put("fleetUtilization", Math.round(fleetUtilization * 100.0) / 100.0);
            kpi.put("utilizationGrowth", utilizationGrowth);
            
            kpi.put("tripsToday", tripsToday);
            kpi.put("activeRoutes", activeRoutes);
            
            double avgUtilization = vehicles.stream()
                .mapToInt(v -> v.getHealthScore() != null ? v.getHealthScore() : 100)
                .average()
                .orElse(100.0);
            kpi.put("averageUtilization", Math.round(avgUtilization * 100.0) / 100.0);
            
            System.out.println("✅ KPI metrics calculated successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error calculating KPI: " + e.getMessage());
            e.printStackTrace();
            kpi.put("error", e.getMessage());
        }
        
        return kpi;
    }
    
    /**
     * Get fleet distribution data
     */
    public Map<String, Object> getFleetDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            
            // Type distribution
            Map<String, Long> typeDistribution = vehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getType().name(),
                    Collectors.counting()
                ));
            
            // Status distribution
            Map<String, Long> statusDistribution = vehicles.stream()
                .collect(Collectors.groupingBy(
                    v -> v.getStatus().name(),
                    Collectors.counting()
                ));
            
            // Location distribution (mock data - enhance with real GPS clustering)
            Map<String, Integer> locationDistribution = new HashMap<>();
            locationDistribution.put("Downtown", 45);
            locationDistribution.put("Airport", 32);
            locationDistribution.put("Business District", 28);
            locationDistribution.put("Residential Areas", 35);
            
            // For charts
            List<String> labels = new ArrayList<>(typeDistribution.keySet());
            List<Long> values = new ArrayList<>(typeDistribution.values());
            
            distribution.put("typeDistribution", typeDistribution);
            distribution.put("statusDistribution", statusDistribution);
            distribution.put("locationDistribution", locationDistribution);
            distribution.put("labels", labels);
            distribution.put("values", values);
            distribution.put("totalVehicles", vehicles.size());
            
        } catch (Exception e) {
            System.err.println("❌ Error getting fleet distribution: " + e.getMessage());
            distribution.put("error", e.getMessage());
        }
        
        return distribution;
    }
    
    /**
     * Get hourly activity data
     */
    public Map<String, Object> getHourlyActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findAll();
            LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
            
            // Count bookings by hour
            Map<Integer, Long> hourlyBookings = new TreeMap<>();
            for (int i = 0; i < 24; i++) {
                hourlyBookings.put(i, 0L);
            }
            
            bookings.stream()
                .filter(b -> b.getCreatedAt().isAfter(today))
                .forEach(b -> {
                    int hour = b.getCreatedAt().getHour();
                    hourlyBookings.put(hour, hourlyBookings.get(hour) + 1);
                });
            
            activity.put("hours", new ArrayList<>(hourlyBookings.keySet()));
            activity.put("bookingCounts", new ArrayList<>(hourlyBookings.values()));
            
        } catch (Exception e) {
            System.err.println("❌ Error getting hourly activity: " + e.getMessage());
            activity.put("error", e.getMessage());
        }
        
        return activity;
    }
    
    /**
     * Get daily trends for the past N days
     */
    public Map<String, Object> getDailyTrends(int days) {
        Map<String, Object> trends = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findAll();
            LocalDateTime startDate = LocalDateTime.now().minusDays(days);
            
            Map<String, Long> dailyBookings = new TreeMap<>();
            Map<String, Double> dailyRevenue = new TreeMap<>();
            List<String> dates = new ArrayList<>();
            
            for (int i = 0; i < days; i++) {
                LocalDateTime date = LocalDateTime.now().minusDays(days - i - 1);
                String dateKey = date.toLocalDate().toString();
                dates.add(dateKey);
                
                long count = bookings.stream()
                    .filter(b -> b.getCreatedAt().toLocalDate().toString().equals(dateKey))
                    .count();
                
                double revenue = bookings.stream()
                    .filter(b -> b.getCompletedAt() != null)
                    .filter(b -> b.getCompletedAt().toLocalDate().toString().equals(dateKey))
                    .filter(b -> b.getTotalPrice() != null)
                    .mapToDouble(Booking::getTotalPrice)
                    .sum();
                
                dailyBookings.put(dateKey, count);
                dailyRevenue.put(dateKey, Math.round(revenue * 100.0) / 100.0);
            }
            
            trends.put("labels", dates);
            trends.put("dates", dates);
            trends.put("bookings", new ArrayList<>(dailyBookings.values()));
            trends.put("revenue", new ArrayList<>(dailyRevenue.values()));
            
        } catch (Exception e) {
            System.err.println("❌ Error getting daily trends: " + e.getMessage());
            trends.put("error", e.getMessage());
        }
        
        return trends;
    }
    
    /**
     * Get vehicle performance data
     */
    public Map<String, Object> getVehiclePerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            List<Booking> bookings = bookingRepository.findAll();
            
            List<Map<String, Object>> topVehicles = new ArrayList<>();
            
            for (Vehicle vehicle : vehicles) {
                List<Booking> vehicleBookings = bookings.stream()
                    .filter(b -> b.getVehicle() != null && b.getVehicle().getId().equals(vehicle.getId()))
                    .collect(Collectors.toList());
                
                long trips = vehicleBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .count();
                
                double revenue = vehicleBookings.stream()
                    .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                    .filter(b -> b.getTotalPrice() != null)
                    .mapToDouble(Booking::getTotalPrice)
                    .sum();
                
                if (trips > 0) {
                    Map<String, Object> vehicleData = new HashMap<>();
                    vehicleData.put("vehicleId", vehicle.getVehicleNumber());
                    vehicleData.put("vehicleNumber", vehicle.getVehicleNumber());
                    vehicleData.put("model", vehicle.getModel());
                    vehicleData.put("trips", trips);
                    vehicleData.put("totalTrips", trips);
                    vehicleData.put("revenue", Math.round(revenue * 100.0) / 100.0);
                    vehicleData.put("totalRevenue", Math.round(revenue * 100.0) / 100.0);
                    topVehicles.add(vehicleData);
                }
            }
            
            // Sort by revenue descending
            topVehicles.sort((a, b) -> 
                Double.compare((Double)b.get("revenue"), (Double)a.get("revenue")));
            
            performance.put("topVehicles", topVehicles);
            performance.put("topPerformers", topVehicles.stream().limit(10).collect(Collectors.toList()));
            
        } catch (Exception e) {
            System.err.println("❌ Error getting vehicle performance: " + e.getMessage());
            e.printStackTrace();
            performance.put("error", e.getMessage());
        }
        
        return performance;
    }
}