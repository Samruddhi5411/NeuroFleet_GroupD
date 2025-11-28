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
    public Map<String, Object> getHourlyActivity() {
        List<Booking> bookings = bookingRepository.findAll();
        Map<Integer, Long> hourlyMap = new HashMap<>();
        
        // Initialize all 24 hours with 0
        for (int i = 0; i < 24; i++) {
            hourlyMap.put(i, 0L);
        }
        
        // Count bookings per hour
        for (Booking booking : bookings) {
            if (booking.getStartTime() != null) {
                int hour = booking.getStartTime().getHour();
                hourlyMap.put(hour, hourlyMap.get(hour) + 1);
            }
        }
        
        // Convert to lists for frontend
        List<String> labels = new ArrayList<>();
        List<Long> values = new ArrayList<>();
        
        for (int i = 0; i < 24; i++) {
            labels.add(String.format("%02d:00", i));
            values.add(hourlyMap.get(i));
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("values", values);
        return result;
    }

    public List<Map<String, Object>> getTripDensityByCity() {
        List<Booking> completedBookings = bookingRepository.findAll();
        Map<String, Integer> cityTripCount = new HashMap<>();
        
        // City coordinates
        Map<String, double[]> cityCoordinates = new HashMap<>();
        cityCoordinates.put("Mumbai", new double[]{19.0760, 72.8777});
        cityCoordinates.put("Delhi", new double[]{28.7041, 77.1025});
        cityCoordinates.put("Bangalore", new double[]{12.9716, 77.5946});
        cityCoordinates.put("Hyderabad", new double[]{17.3850, 78.4867});
        cityCoordinates.put("Chennai", new double[]{13.0827, 80.2707});
        cityCoordinates.put("Pune", new double[]{18.5204, 73.8567});
        cityCoordinates.put("Noida", new double[]{28.5355, 77.3910});
        cityCoordinates.put("Gurgaon", new double[]{28.4595, 77.0266});
        
        // Count trips per city
        for (Booking booking : completedBookings) {
            String pickup = booking.getPickupLocation();
            if (pickup != null) {
                for (String city : cityCoordinates.keySet()) {
                    if (pickup.toUpperCase().contains(city.toUpperCase())) {
                        cityTripCount.put(city, cityTripCount.getOrDefault(city, 0) + 1);
                        break;
                    }
                }
            }
        }
        
        // Build result list
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, double[]> entry : cityCoordinates.entrySet()) {
            String cityName = entry.getKey();
            double[] coords = entry.getValue();
            
            Map<String, Object> cityData = new HashMap<>();
            cityData.put("name", cityName);
            cityData.put("lat", coords[0]);
            cityData.put("lng", coords[1]);
            cityData.put("trips", cityTripCount.getOrDefault(cityName, 0));
            
            result.add(cityData);
        }
        
        return result;
    }
}