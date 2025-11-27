package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    
    // Get KPI Metrics
     
    public Map<String, Object> getKPIMetrics() {
        Map<String, Object> kpi = new HashMap<>();
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        
        kpi.put("totalVehicles", vehicles.size());
        kpi.put("availableVehicles", vehicles.stream()
            .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count());
        kpi.put("activeTrips", bookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.IN_PROGRESS).count());
        kpi.put("totalRevenue", bookings.stream()
            .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
            .mapToDouble(Booking::getTotalPrice)
            .sum());
        
        return kpi;
    }
    
    
     //Get Fleet Distribution
     
    public Map<String, Object> getFleetDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        Map<String, Long> byStatus = new HashMap<>();
        for (VehicleStatus status : VehicleStatus.values()) {
            byStatus.put(status.name(), vehicles.stream()
                .filter(v -> v.getStatus() == status).count());
        }
        
        Map<String, Long> byType = new HashMap<>();
        for (VehicleType type : VehicleType.values()) {
            byType.put(type.name(), vehicles.stream()
                .filter(v -> v.getType() == type).count());
        }
        
        distribution.put("byStatus", byStatus);
        distribution.put("byType", byType);
        
        return distribution;
    }
    
    
     // Get Hourly Activity
     
    public Map<String, Object> getHourlyActivity() {
        Map<String, Object> activity = new HashMap<>();
        
        List<String> hours = Arrays.asList(
            "00:00", "03:00", "06:00", "09:00", "12:00", 
            "15:00", "18:00", "21:00"
        );
        
        List<Integer> bookings = Arrays.asList(5, 8, 15, 25, 30, 28, 20, 12);
        
        activity.put("labels", hours);
        activity.put("values", bookings);
        
        return activity;
    }
    
    
     // Get Daily Trends
     
    public Map<String, Object> getDailyTrends(int days) {
        Map<String, Object> trends = new HashMap<>();
        
        List<String> dates = new ArrayList<>();
        List<Long> counts = new ArrayList<>();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            dates.add(date.toLocalDate().toString());
            
            long count = bookingRepository.findAll().stream()
                .filter(b -> b.getCreatedAt().toLocalDate().equals(date.toLocalDate()))
                .count();
            counts.add(count);
        }
        
        trends.put("dates", dates);
        trends.put("bookings", counts);
        
        return trends;
    }
    
    
     // Get Vehicle Performance
     
    public Map<String, Object> getVehiclePerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Map<String, Object>> vehicleStats = new ArrayList<>();
        
        for (Vehicle vehicle : vehicles) {
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", vehicle.getId());
            stats.put("vehicleNumber", vehicle.getVehicleNumber());
            stats.put("model", vehicle.getModel());
            stats.put("healthScore", vehicle.getHealthScore());
            stats.put("mileage", vehicle.getMileage());
            stats.put("status", vehicle.getStatus());
            
            long tripCount = bookingRepository.findByVehicleId(vehicle.getId()).size();
            stats.put("totalTrips", tripCount);
            
            vehicleStats.add(stats);
        }
        
        performance.put("vehicles", vehicleStats);
        return performance;
    }
    
    
     // Generate Fleet Report CSV
     
    public byte[] generateFleetReportCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(baos);
            
            writer.println("Vehicle Number,Model,Type,Status,Health Score,Mileage,Battery Level,Fuel Level");
            
            List<Vehicle> vehicles = vehicleRepository.findAll();
            for (Vehicle v : vehicles) {
                writer.printf("%s,%s,%s,%s,%d,%d,%d,%d%n",
                    v.getVehicleNumber(),
                    v.getModel(),
                    v.getType(),
                    v.getStatus(),
                    v.getHealthScore(),
                    v.getMileage(),
                    v.getBatteryLevel(),
                    v.getFuelLevel()
                );
            }
            
            writer.flush();
            writer.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
    
    
     //Generate Bookings Report CSV
     
    public byte[] generateBookingsReportCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(baos);
            
            writer.println("Booking ID,Customer,Vehicle,Driver,Status,Total Price,Created At");
            
            List<Booking> bookings = bookingRepository.findAll();
            for (Booking b : bookings) {
                writer.printf("%d,%s,%s,%s,%s,%.2f,%s%n",
                    b.getId(),
                    b.getCustomer().getFullName(),
                    b.getVehicle().getVehicleNumber(),
                    b.getDriver() != null ? b.getDriver().getFullName() : "N/A",
                    b.getStatus(),
                    b.getTotalPrice(),
                    b.getCreatedAt()
                );
            }
            
            writer.flush();
            writer.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
    
  
     // Generate Revenue Report CSV

    public byte[] generateRevenueReportCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(baos);
            
            writer.println("Date,Total Revenue,Completed Trips,Average Trip Value");
            
            List<Booking> completed = bookingRepository.findByStatus(BookingStatus.COMPLETED);
            double totalRevenue = completed.stream()
                .mapToDouble(Booking::getTotalPrice)
                .sum();
            double avgValue = completed.isEmpty() ? 0 : totalRevenue / completed.size();
            
            writer.printf("%s,%.2f,%d,%.2f%n",
                LocalDateTime.now().toLocalDate(),
                totalRevenue,
                completed.size(),
                avgValue
            );
            
            writer.flush();
            writer.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
    public Map<String, Object> getTripHeatmap() {
        List<Booking> completedTrips = bookingRepository.findByStatus(BookingStatus.COMPLETED);
        
        // Group trips by pickup location coordinates
        Map<String, Integer> locationDensity = new HashMap<>();
        
        for (Booking trip : completedTrips) {
            String key = trip.getPickupLatitude() + "," + trip.getPickupLongitude();
            locationDensity.put(key, locationDensity.getOrDefault(key, 0) + 1);
        }
        
        return Map.of("heatmapData", locationDensity);
    }
    
     //Generate Trips Report CSV
     
    public byte[] generateTripsReportCSV() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintWriter writer = new PrintWriter(baos);
            
            writer.println("Trip ID,Pickup,Dropoff,Distance,Duration,Price,Status");
            
            List<Booking> bookings = bookingRepository.findAll();
            for (Booking b : bookings) {
                writer.printf("%d,%s,%s,N/A,N/A,%.2f,%s%n",
                    b.getId(),
                    b.getPickupLocation(),
                    b.getDropoffLocation(),
                    b.getTotalPrice(),
                    b.getStatus()
                );
            }
            
            writer.flush();
            writer.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV", e);
        }
    }
}