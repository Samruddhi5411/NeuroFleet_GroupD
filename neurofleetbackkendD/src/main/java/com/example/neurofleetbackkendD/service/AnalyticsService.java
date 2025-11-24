package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    
    private static final DateTimeFormatter DATE_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    // KPI METRICS
    public Map<String, Object> getKPIMetrics() {
        Map<String, Object> kpi = new HashMap<>();
        
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<Booking> allBookings = bookingRepository.findAll();
        
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        List<Booking> todayBookings = allBookings.stream()
            .filter(b -> b.getCreatedAt().isAfter(today))
            .collect(Collectors.toList());
        
        kpi.put("totalVehicles", allVehicles.size());
        kpi.put("totalUsers", allUsers.size());
        kpi.put("totalDrivers", allUsers.stream()
            .filter(u -> u.getRole() == UserRole.DRIVER).count());
        kpi.put("totalCustomers", allUsers.stream()
            .filter(u -> u.getRole() == UserRole.CUSTOMER).count());
        kpi.put("tripsToday", todayBookings.size());
        kpi.put("activeVehicles", allVehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.IN_USE).count());
        
        double earningsToday = todayBookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
            .sum();
        
        kpi.put("earningsToday", Math.round(earningsToday * 100.0) / 100.0);
        
        return kpi;
    }
    
    // FLEET DISTRIBUTION
    public Map<String, Object> getFleetDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        Map<String, Long> statusCount = vehicles.stream()
            .collect(Collectors.groupingBy(
                v -> v.getStatus().name(),
                Collectors.counting()
            ));
        
        Map<String, Long> typeCount = vehicles.stream()
            .collect(Collectors.groupingBy(
                v -> v.getType().name(),
                Collectors.counting()
            ));
        
        distribution.put("byStatus", statusCount);
        distribution.put("byType", typeCount);
        distribution.put("totalFleet", vehicles.size());
        
        return distribution;
    }
    
    // HOURLY ACTIVITY
    public Map<String, Object> getHourlyActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        List<Booking> todayBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getCreatedAt().isAfter(today))
            .collect(Collectors.toList());
        
        List<String> labels = new ArrayList<>();
        List<Integer> values = new ArrayList<>();
        
        for (int hour = 0; hour < 24; hour++) {
            labels.add(String.format("%02d:00", hour));
            int finalHour = hour;
            long count = todayBookings.stream()
                .filter(b -> b.getCreatedAt().getHour() == finalHour)
                .count();
            values.add((int) count);
        }
        
        activity.put("labels", labels);
        activity.put("values", values);
        
        return activity;
    }
    
    // DAILY TRENDS
    public Map<String, Object> getDailyTrends(int days) {
        Map<String, Object> trends = new HashMap<>();
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        List<Booking> recentBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getCreatedAt().isAfter(startDate))
            .collect(Collectors.toList());
        
        Map<String, Integer> dailyBookings = new TreeMap<>();
        
        for (int i = 0; i < days; i++) {
            LocalDateTime date = LocalDateTime.now().minusDays(days - i - 1);
            String dateKey = date.toLocalDate().toString();
            
            long count = recentBookings.stream()
                .filter(b -> b.getCreatedAt().toLocalDate().toString().equals(dateKey))
                .count();
            
            dailyBookings.put(dateKey, (int) count);
        }
        
        trends.put("period", days + " days");
        trends.put("dailyBookings", dailyBookings);
        trends.put("totalBookings", recentBookings.size());
        
        return trends;
    }
    
    // VEHICLE PERFORMANCE
    public Map<String, Object> getVehiclePerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        
        List<Map<String, Object>> vehicleStats = new ArrayList<>();
        
        for (Vehicle vehicle : vehicles) {
            List<Booking> vehicleBookings = bookings.stream()
                .filter(b -> b.getVehicle() != null && 
                    b.getVehicle().getId().equals(vehicle.getId()))
                .collect(Collectors.toList());
            
            long totalTrips = vehicleBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .count();
            
            double revenue = vehicleBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                .sum();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("vehicleId", vehicle.getId());
            stats.put("vehicleNumber", vehicle.getVehicleNumber());
            stats.put("model", vehicle.getModel());
            stats.put("totalTrips", totalTrips);
            stats.put("revenue", Math.round(revenue * 100.0) / 100.0);
            stats.put("healthScore", vehicle.getHealthScore());
            stats.put("status", vehicle.getStatus().name());
            
            vehicleStats.add(stats);
        }
        
        vehicleStats.sort((a, b) -> 
            Long.compare((Long)b.get("totalTrips"), (Long)a.get("totalTrips")));
        
        performance.put("vehicleStats", vehicleStats);
        performance.put("topPerformers", vehicleStats.stream().limit(5).collect(Collectors.toList()));
        
        return performance;
    }
    
    // CSV GENERATION METHODS
    
    public byte[] generateFleetReportCSV() {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(baos)) {
            
            // Header
            writer.println("Vehicle ID,Vehicle Number,Model,Type,Capacity,Status,Health Score,Battery,Fuel,Created At");
            
            // Data
            List<Vehicle> vehicles = vehicleRepository.findAll();
            for (Vehicle v : vehicles) {
                writer.println(String.format("%d,%s,%s,%s,%d,%s,%d,%d,%d,%s",
                    v.getId(),
                    v.getVehicleNumber(),
                    v.getModel(),
                    v.getType().name(),
                    v.getCapacity(),
                    v.getStatus().name(),
                    v.getHealthScore(),
                    v.getBatteryLevel(),
                    v.getFuelLevel(),
                    v.getCreatedAt().format(DATE_FORMATTER)
                ));
            }
            
            writer.flush();
            return baos.toByteArray();
            
        } catch (Exception e) {
            System.err.println("❌ Error generating fleet report: " + e.getMessage());
            return new byte[0];
        }
    }
    
    public byte[] generateBookingsReportCSV() {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(baos)) {
            
            writer.println("Booking ID,Customer,Vehicle,Driver,Pickup,Dropoff,Status,Price,Created At");
            
            List<Booking> bookings = bookingRepository.findAll();
            for (Booking b : bookings) {
                writer.println(String.format("%d,%s,%s,%s,%s,%s,%s,%.2f,%s",
                    b.getId(),
                    b.getCustomer() != null ? b.getCustomer().getFullName() : "N/A",
                    b.getVehicle() != null ? b.getVehicle().getVehicleNumber() : "N/A",
                    b.getDriver() != null ? b.getDriver().getFullName() : "Not Assigned",
                    b.getPickupLocation(),
                    b.getDropoffLocation(),
                    b.getStatus().name(),
                    b.getTotalPrice() != null ? b.getTotalPrice() : 0.0,
                    b.getCreatedAt().format(DATE_FORMATTER)
                ));
            }
            
            writer.flush();
            return baos.toByteArray();
            
        } catch (Exception e) {
            System.err.println("❌ Error generating bookings report: " + e.getMessage());
            return new byte[0];
        }
    }
    
    public byte[] generateRevenueReportCSV() {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(baos)) {
            
            writer.println("Date,Total Bookings,Completed Trips,Revenue,Average Booking Value");
            
            List<Booking> completedBookings = bookingRepository
                .findByStatus(BookingStatus.COMPLETED);
            
            Map<String, List<Booking>> bookingsByDate = completedBookings.stream()
                .collect(Collectors.groupingBy(
                    b -> b.getCompletedAt().toLocalDate().toString()
                ));
            
            for (Map.Entry<String, List<Booking>> entry : bookingsByDate.entrySet()) {
                double revenue = entry.getValue().stream()
                    .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
                    .sum();
                
                double avg = revenue / entry.getValue().size();
                
                writer.println(String.format("%s,%d,%d,%.2f,%.2f",
                    entry.getKey(),
                    entry.getValue().size(),
                    entry.getValue().size(),
                    revenue,
                    avg
                ));
            }
            
            writer.flush();
            return baos.toByteArray();
            
        } catch (Exception e) {
            System.err.println("❌ Error generating revenue report: " + e.getMessage());
            return new byte[0];
        }
    }
    
    public byte[] generateTripsReportCSV() {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             PrintWriter writer = new PrintWriter(baos)) {
            
            writer.println("Trip ID,Driver,Vehicle,Start Time,End Time,Duration (mins),Distance (km),Price");
            
            List<Booking> completedBookings = bookingRepository
                .findByStatus(BookingStatus.COMPLETED);
            
            for (Booking b : completedBookings) {
                long duration = b.getStartTime() != null && b.getEndTime() != null ?
                    java.time.Duration.between(b.getStartTime(), b.getEndTime()).toMinutes() : 0;
                
                writer.println(String.format("%d,%s,%s,%s,%s,%d,%.2f,%.2f",
                    b.getId(),
                    b.getDriver() != null ? b.getDriver().getFullName() : "N/A",
                    b.getVehicle() != null ? b.getVehicle().getVehicleNumber() : "N/A",
                    b.getStartTime() != null ? b.getStartTime().format(DATE_FORMATTER) : "N/A",
                    b.getEndTime() != null ? b.getEndTime().format(DATE_FORMATTER) : "N/A",
                    duration,
                    0.0, // Can calculate from coordinates
                    b.getTotalPrice() != null ? b.getTotalPrice() : 0.0
                ));
            }
            
            writer.flush();
            return baos.toByteArray();
            
        } catch (Exception e) {
            System.err.println("❌ Error generating trips report: " + e.getMessage());
            return new byte[0];
        }
    }
}