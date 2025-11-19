//package com.example.neurofleetbackkendD.service;
//
//import com.example.neurofleetbackkendD.model.*;
//import com.example.neurofleetbackkendD.model.enums.BookingStatus;
//import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
//import com.example.neurofleetbackkendD.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//@Service
//public class UrbanMobilityService {
//    
//    @Autowired
//    private VehicleRepository vehicleRepository;
//    
//    @Autowired
//    private BookingRepository bookingRepository;
//    
//    @Autowired
//    private UserRepository userRepository;
//    
//    @Autowired
//    private RouteRepository routeRepository;
//    
//    @Autowired
//    private TripDensityRepository tripDensityRepository;
//    
//    // Get comprehensive admin dashboard
//    public Map<String, Object> getAdminDashboardInsights() {
//        Map<String, Object> dashboard = new HashMap<>();
//        
//        // KPI Cards
//        Map<String, Object> kpis = new HashMap<>();
//        kpis.put("totalFleet", vehicleRepository.count());
//        kpis.put("activeVehicles", vehicleRepository.findByStatus(VehicleStatus.IN_USE).size());
//        kpis.put("availableVehicles", vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size());
//        
//        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
//        long tripsToday = bookingRepository.findAll().stream()
//            .filter(b -> b.getCreatedAt().isAfter(today))
//            .count();
//        kpis.put("tripsToday", tripsToday);
//        
//        long activeRoutes = routeRepository.findByStatus("ACTIVE").size();
//        kpis.put("activeRoutes", activeRoutes);
//        
//        // Revenue today
//        double revenueToday = bookingRepository.findByStatus(BookingStatus.COMPLETED).stream()
//            .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(today))
//            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
//            .sum();
//        kpis.put("revenueToday", Math.round(revenueToday * 100.0) / 100.0);
//        
//        dashboard.put("kpis", kpis);
//        
//        // Fleet distribution by city
//        dashboard.put("fleetDistribution", getFleetDistribution());
//        
//        // Hourly rental activity
//        dashboard.put("hourlyActivity", getHourlyRentalActivity());
//        
//        // Trip density heatmap data
//        dashboard.put("tripDensityHeatmap", getTripDensityData());
//        
//        // Vehicle utilization by type
//        dashboard.put("utilizationByType", getUtilizationByType());
//        
//        // Popular routes
//        dashboard.put("popularRoutes", getPopularRoutes());
//        
//        // Peak hours
//        dashboard.put("peakHours", getPeakHours());
//        
//        return dashboard;
//    }
//    
//    // Fleet distribution across cities
//    private List<Map<String, Object>> getFleetDistribution() {
//        List<Vehicle> vehicles = vehicleRepository.findAll();
//        
//        // Group by approximate location (simplified city grouping)
//        Map<String, List<Vehicle>> cityGroups = new HashMap<>();
//        
//        for (Vehicle v : vehicles) {
//            String city = getCityFromCoordinates(v.getLatitude(), v.getLongitude());
//            cityGroups.computeIfAbsent(city, k -> new ArrayList<>()).add(v);
//        }
//        
//        return cityGroups.entrySet().stream()
//            .map(entry -> {
//                Map<String, Object> cityData = new HashMap<>();
//                cityData.put("city", entry.getKey());
//                cityData.put("vehicleCount", entry.getValue().size());
//                
//                // Get center coordinates
//                double avgLat = entry.getValue().stream()
//                    .mapToDouble(Vehicle::getLatitude)
//                    .average().orElse(0);
//                double avgLon = entry.getValue().stream()
//                    .mapToDouble(Vehicle::getLongitude)
//                    .average().orElse(0);
//                
//                cityData.put("latitude", avgLat);
//                cityData.put("longitude", avgLon);
//                
//                // Status breakdown
//                long available = entry.getValue().stream()
//                    .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
//                    .count();
//                long inUse = entry.getValue().stream()
//                    .filter(v -> v.getStatus() == VehicleStatus.IN_USE)
//                    .count();
//                
//                cityData.put("available", available);
//                cityData.put("inUse", inUse);
//                
//                return cityData;
//            })
//            .sorted((a, b) -> Integer.compare(
//                (Integer)b.get("vehicleCount"), 
//                (Integer)a.get("vehicleCount")))
//            .collect(Collectors.toList());
//    }
//    
//    private String getCityFromCoordinates(Double lat, Double lon) {
//        // Simplified city detection based on coordinates
//        if (lat >= 19.0 && lat <= 19.3 && lon >= 72.7 && lon <= 73.0) return "Mumbai";
//        if (lat >= 28.4 && lat <= 28.9 && lon >= 76.8 && lon <= 77.3) return "Delhi";
//        if (lat >= 12.8 && lat <= 13.1 && lon >= 77.4 && lon <= 77.8) return "Bangalore";
//        if (lat >= 17.2 && lat <= 17.6 && lon >= 78.3 && lon <= 78.7) return "Hyderabad";
//        if (lat >= 12.9 && lat <= 13.2 && lon >= 80.1 && lon <= 80.4) return "Chennai";
//        if (lat >= 22.4 && lat <= 22.7 && lon >= 88.2 && lon <= 88.5) return "Kolkata";
//        if (lat >= 18.4 && lat <= 18.6 && lon >= 73.7 && lon <= 74.0) return "Pune";
//        if (lat >= 22.9 && lat <= 23.1 && lon >= 72.4 && lon <= 72.7) return "Ahmedabad";
//        return "Other";
//    }
//    
//    // Hourly rental activity
//    private List<Map<String, Object>> getHourlyRentalActivity() {
//        List<Booking> allBookings = bookingRepository.findAll();
//        
//        // Group by hour of day
//        Map<Integer, Long> hourlyCount = new HashMap<>();
//        for (int i = 0; i < 24; i++) {
//            hourlyCount.put(i, 0L);
//        }
//        
//        for (Booking booking : allBookings) {
//            if (booking.getStartTime() != null) {
//                int hour = booking.getStartTime().getHour();
//                hourlyCount.put(hour, hourlyCount.get(hour) + 1);
//            }
//        }
//        
//        return hourlyCount.entrySet().stream()
//            .sorted(Map.Entry.comparingByKey())
//            .map(entry -> {
//                Map<String, Object> data = new HashMap<>();
//                data.put("hour", entry.getKey());
//                data.put("bookings", entry.getValue());
//                data.put("label", String.format("%02d:00", entry.getKey()));
//                return data;
//            })
//            .collect(Collectors.toList());
//    }
//    
//    // Trip density for heatmap
//    private List<Map<String, Object>> getTripDensityData() {
//        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
//        
//        // Create density map based on pickup locations
//        Map<String, List<Booking>> locationGroups = new HashMap<>();
//        
//        for (Booking booking : completedBookings) {
//            if (booking.getPickupLatitude() != null && booking.getPickupLongitude() != null) {
//                // Round to 2 decimal places for grouping
//                String key = String.format("%.2f,%.2f", 
//                    booking.getPickupLatitude(), 
//                    booking.getPickupLongitude());
//                locationGroups.computeIfAbsent(key, k -> new ArrayList<>()).add(booking);
//            }
//        }
//        
//        return locationGroups.entrySet().stream()
//            .map(entry -> {
//                String[] coords = entry.getKey().split(",");
//                Map<String, Object> density = new HashMap<>();
//                density.put("latitude", Double.parseDouble(coords[0]));
//                density.put("longitude", Double.parseDouble(coords[1]));
//                density.put("intensity", entry.getValue().size());
//                density.put("trips", entry.getValue().size());
//                return density;
//            })
//            .sorted((a, b) -> Integer.compare(
//                (Integer)b.get("intensity"), 
//                (Integer)a.get("intensity")))
//            .limit(50) // Top 50 hotspots
//            .collect(Collectors.toList());
//    }
//    
//    // Utilization by vehicle type
//    private List<Map<String, Object>> getUtilizationByType() {
//        List<Vehicle> allVehicles = vehicleRepository.findAll();
//        
//        Map<String, List<Vehicle>> typeGroups = allVehicles.stream()
//            .collect(Collectors.groupingBy(v -> v.getType().name()));
//        
//        return typeGroups.entrySet().stream()
//            .map(entry -> {
//                Map<String, Object> typeData = new HashMap<>();
//                typeData.put("vehicleType", entry.getKey());
//                typeData.put("total", entry.getValue().size());
//                
//                long inUse = entry.getValue().stream()
//                    .filter(v -> v.getStatus() == VehicleStatus.IN_USE)
//                    .count();
//                
//                double utilizationRate = entry.getValue().size() > 0 ?
//                    (inUse * 100.0 / entry.getValue().size()) : 0;
//                
//                typeData.put("inUse", inUse);
//                typeData.put("utilizationRate", Math.round(utilizationRate * 100.0) / 100.0);
//                
//                return typeData;
//            })
//            .sorted((a, b) -> Double.compare(
//                (Double)b.get("utilizationRate"), 
//                (Double)a.get("utilizationRate")))
//            .collect(Collectors.toList());
//    }
//    
//    // Popular routes
//    private List<Map<String, Object>> getPopularRoutes() {
//        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
//        
//        // Group by route (pickup -> dropoff)
//        Map<String, Long> routeCount = completedBookings.stream()
//            .filter(b -> b.getPickupLocation() != null && b.getDropoffLocation() != null)
//            .collect(Collectors.groupingBy(
//                b -> b.getPickupLocation() + " → " + b.getDropoffLocation(),
//                Collectors.counting()
//            ));
//        
//        return routeCount.entrySet().stream()
//            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
//            .limit(10)
//            .map(entry -> {
//                Map<String, Object> route = new HashMap<>();
//                route.put("route", entry.getKey());
//                route.put("tripCount", entry.getValue());
//                return route;
//            })
//            .collect(Collectors.toList());
//    }
//    
//    // Peak hours analysis
//    private Map<String, Object> getPeakHours() {
//        List<Booking> allBookings = bookingRepository.findAll();
//        
//        Map<Integer, Long> hourlyBookings = allBookings.stream()
//            .filter(b -> b.getStartTime() != null)
//            .collect(Collectors.groupingBy(
//                b -> b.getStartTime().getHour(),
//                Collectors.counting()
//            ));
//        
//        int peakHour = hourlyBookings.entrySet().stream()
//            .max(Map.Entry.comparingByValue())
//            .map(Map.Entry::getKey)
//            .orElse(12);
//        
//        long peakBookings = hourlyBookings.getOrDefault(peakHour, 0L);
//        
//        Map<String, Object> peakData = new HashMap<>();
//        peakData.put("peakHour", peakHour);
//        peakData.put("peakHourLabel", String.format("%02d:00 - %02d:00", peakHour, peakHour + 1));
//        peakData.put("bookingsInPeakHour", peakBookings);
//        
//        // Calculate morning, afternoon, evening distribution
//        long morning = hourlyBookings.entrySet().stream()
//            .filter(e -> e.getKey() >= 6 && e.getKey() < 12)
//            .mapToLong(Map.Entry::getValue)
//            .sum();
//        
//        long afternoon = hourlyBookings.entrySet().stream()
//            .filter(e -> e.getKey() >= 12 && e.getKey() < 18)
//            .mapToLong(Map.Entry::getValue)
//            .sum();
//        
//        long evening = hourlyBookings.entrySet().stream()
//            .filter(e -> e.getKey() >= 18 && e.getKey() < 24)
//            .mapToLong(Map.Entry::getValue)
//            .sum();
//        
//        long night = hourlyBookings.entrySet().stream()
//            .filter(e -> e.getKey() >= 0 && e.getKey() < 6)
//            .mapToLong(Map.Entry::getValue)
//            .sum();
//        
//        Map<String, Long> timeDistribution = new HashMap<>();
//        timeDistribution.put("morning", morning);
//        timeDistribution.put("afternoon", afternoon);
//        timeDistribution.put("evening", evening);
//        timeDistribution.put("night", night);
//        
//        peakData.put("timeDistribution", timeDistribution);
//        
//        return peakData;
//    }
//    
//    // Generate downloadable report data
//    public Map<String, Object> generateReport(String reportType, LocalDateTime startDate, LocalDateTime endDate) {
//        Map<String, Object> report = new HashMap<>();
//        
//        report.put("reportType", reportType);
//        report.put("generatedAt", LocalDateTime.now());
//        report.put("periodStart", startDate);
//        report.put("periodEnd", endDate);
//        
//        switch (reportType.toLowerCase()) {
//            case "bookings":
//                report.put("data", generateBookingsReport(startDate, endDate));
//                break;
//            case "revenue":
//                report.put("data", generateRevenueReport(startDate, endDate));
//                break;
//            case "fleet":
//                report.put("data", generateFleetReport());
//                break;
//            case "drivers":
//                report.put("data", generateDriversReport(startDate, endDate));
//                break;
//            default:
//                report.put("data", generateComprehensiveReport(startDate, endDate));
//        }
//        
//        return report;
//    }
//    
//    private List<Map<String, Object>> generateBookingsReport(LocalDateTime start, LocalDateTime end) {
//        return bookingRepository.findAll().stream()
//            .filter(b -> b.getCreatedAt().isAfter(start) && b.getCreatedAt().isBefore(end))
//            .map(b -> {
//                Map<String, Object> row = new HashMap<>();
//                row.put("bookingId", b.getId());
//                row.put("customer", b.getCustomer().getFullName());
//                row.put("vehicle", b.getVehicle().getVehicleNumber());
//                row.put("driver", b.getDriver() != null ? b.getDriver().getFullName() : "N/A");
//                row.put("pickup", b.getPickupLocation());
//                row.put("dropoff", b.getDropoffLocation());
//                row.put("status", b.getStatus());
//                row.put("price", b.getTotalPrice());
//                row.put("createdAt", b.getCreatedAt());
//                return row;
//            })
//            .collect(Collectors.toList());
//    }
//    
//    private Map<String, Object> generateRevenueReport(LocalDateTime start, LocalDateTime end) {
//        List<Booking> bookings = bookingRepository.findAll().stream()
//            .filter(b -> b.getCompletedAt() != null && 
//                        b.getCompletedAt().isAfter(start) && 
//                        b.getCompletedAt().isBefore(end))
//            .collect(Collectors.toList());
//        
//        double totalRevenue = bookings.stream()
//            .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
//            .sum();
//        
//        Map<String, Object> revenue = new HashMap<>();
//        revenue.put("totalBookings", bookings.size());
//        revenue.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
//        revenue.put("averageBookingValue", bookings.size() > 0 ? 
//            Math.round((totalRevenue / bookings.size()) * 100.0) / 100.0 : 0);
//        
//        // Daily breakdown
//        Map<String, Double> dailyRevenue = bookings.stream()
//            .collect(Collectors.groupingBy(
//                b -> b.getCompletedAt().toLocalDate().toString(),
//                Collectors.summingDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() : 0)
//            ));
//        revenue.put("dailyBreakdown", dailyRevenue);
//        
//        return revenue;
//    }
//    
//    private List<Map<String, Object>> generateFleetReport() {
//        return vehicleRepository.findAll().stream()
//            .map(v -> {
//                Map<String, Object> row = new HashMap<>();
//                row.put("vehicleId", v.getId());
//                row.put("vehicleNumber", v.getVehicleNumber());
//                row.put("manufacturer", v.getManufacturer());
//                row.put("model", v.getModel());
//                row.put("type", v.getType());
//                row.put("status", v.getStatus());
//                row.put("healthScore", v.getHealthScore());
//                row.put("mileage", v.getMileage());
//                row.put("batteryLevel", v.getBatteryLevel());
//                row.put("fuelLevel", v.getFuelLevel());
//                return row;
//            })
//            .collect(Collectors.toList());
//    }
//    
//    private List<Map<String, Object>> generateDriversReport(LocalDateTime start, LocalDateTime end) {
//        List<User> drivers = userRepository.findByRole(com.example.neurofleetbackkendD.model.enums.UserRole.DRIVER);
//        
//        return drivers.stream()
//            .map(driver -> {
//                List<Booking> driverBookings = bookingRepository.findByDriverId(driver.getId()).stream()
//                    .filter(b -> b.getCompletedAt() != null &&
//                                b.getCompletedAt().isAfter(start) &&
//                                b.getCompletedAt().isBefore(end))
//                    .collect(Collectors.toList());
//                
//                double earnings = driverBookings.stream()
//                    .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0)
//                    .sum();
//                
//                Map<String, Object> row = new HashMap<>();
//                row.put("driverId", driver.getId());
//                row.put("driverName", driver.getFullName());
//                row.put("tripsCompleted", driverBookings.size());
//                row.put("earnings", Math.round(earnings * 100.0) / 100.0);
//                row.put("status", driver.getActive() ? "Active" : "Inactive");
//                
//                return row;
//            })
//            .sorted((a, b) -> Integer.compare(
//                (Integer)b.get("tripsCompleted"), 
//                (Integer)a.get("tripsCompleted")))
//            .collect(Collectors.toList());
//    }
//    
//    private Map<String, Object> generateComprehensiveReport(LocalDateTime start, LocalDateTime end) {
//        Map<String, Object> comprehensive = new HashMap<>();
//        
//        comprehensive.put("bookingsSummary", generateBookingsReport(start, end));
//        comprehensive.put("revenueSummary", generateRevenueReport(start, end));
//        comprehensive.put("fleetStatus", generateFleetReport());
//        comprehensive.put("driverPerformance", generateDriversReport(start, end));
//        
//        return comprehensive;
//    }
//    
//    // Real-time fleet map data
//    public Map<String, Object> getRealTimeFleetMap() {
//        List<Vehicle> allVehicles = vehicleRepository.findAll();
//        
//        List<Map<String, Object>> vehicleMarkers = allVehicles.stream()
//            .map(v -> {
//                Map<String, Object> marker = new HashMap<>();
//                marker.put("id", v.getId());
//                marker.put("vehicleNumber", v.getVehicleNumber());
//                marker.put("latitude", v.getLatitude());
//                marker.put("longitude", v.getLongitude());
//                marker.put("status", v.getStatus().name());
//                marker.put("type", v.getType().name());
//                marker.put("healthScore", v.getHealthScore());
//                marker.put("speed", v.getSpeed());
//                marker.put("batteryLevel", v.getBatteryLevel());
//                marker.put("isElectric", v.getIsElectric());
//                
//                // Add driver info if in use
//                if (v.getCurrentDriver() != null) {
//                    marker.put("driver", v.getCurrentDriver().getFullName());
//                }
//                
//                return marker;
//            })
//            .collect(Collectors.toList());
//        
//        Map<String, Object> mapData = new HashMap<>();
//        mapData.put("vehicles", vehicleMarkers);
//        mapData.put("totalVehicles", vehicleMarkers.size());
//        mapData.put("lastUpdated", LocalDateTime.now());
//        
//        return mapData;
//    }
//}
