package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AnalyticsService;
import com.example.neurofleetbackkendD.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private DashboardService dashboardService;
    
    // ========== KPI & Dashboard Endpoints ==========
    
    @GetMapping("/kpi")
    public ResponseEntity<?> getKPIMetrics() {
        try {
            Map<String, Object> kpi = dashboardService.getKPIMetrics();
            return ResponseEntity.ok(kpi);
        } catch (Exception e) {
            System.err.println("❌ Error fetching KPI metrics: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/fleet-distribution")
    public ResponseEntity<?> getFleetDistribution() {
        try {
            Map<String, Object> distribution = dashboardService.getFleetDistribution();
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            System.err.println("❌ Error fetching fleet distribution: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/hourly-activity")
    public ResponseEntity<?> getHourlyActivity() {
        try {
            Map<String, Object> activity = dashboardService.getHourlyActivity();
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            System.err.println("❌ Error fetching hourly activity: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/daily-trends")
    public ResponseEntity<?> getDailyTrends(@RequestParam(defaultValue = "7") int days) {
        try {
            Map<String, Object> trends = dashboardService.getDailyTrends(days);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            System.err.println("❌ Error fetching daily trends: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/vehicle-performance")
    public ResponseEntity<?> getVehiclePerformance() {
        try {
            Map<String, Object> performance = dashboardService.getVehiclePerformance();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            System.err.println("❌ Error fetching vehicle performance: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // ========== Legacy Analytics Endpoints ==========
    
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics(period));
    }
    
    @GetMapping("/vehicles/utilization")
    public ResponseEntity<?> getVehicleUtilization() {
        return ResponseEntity.ok(analyticsService.getVehicleUtilization());
    }
    
    @GetMapping("/drivers/performance")
    public ResponseEntity<?> getDriverPerformance() {
        return ResponseEntity.ok(analyticsService.getDriverPerformance());
    }
    
    @GetMapping("/maintenance")
    public ResponseEntity<?> getMaintenanceAnalytics() {
        return ResponseEntity.ok(analyticsService.getMaintenanceAnalytics());
    }
    
    @GetMapping("/bookings/trends")
    public ResponseEntity<?> getBookingTrends(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getBookingTrends(days));
    }
    
    // ========== Report Download Endpoints ==========
    
    @GetMapping("/reports/fleet/csv")
    public ResponseEntity<byte[]> downloadFleetReport() {
        try {
            Map<String, Object> fleetData = dashboardService.getFleetDistribution();
            String csv = generateFleetCSV(fleetData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", 
                "fleet-report-" + LocalDateTime.now() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes());
                
        } catch (Exception e) {
            System.err.println("❌ Error generating fleet report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/reports/bookings/csv")
    public ResponseEntity<byte[]> downloadBookingsReport() {
        try {
            Map<String, Object> trendsData = dashboardService.getDailyTrends(30);
            String csv = generateBookingsCSV(trendsData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", 
                "bookings-report-" + LocalDateTime.now() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes());
                
        } catch (Exception e) {
            System.err.println("❌ Error generating bookings report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/reports/revenue/csv")
    public ResponseEntity<byte[]> downloadRevenueReport() {
        try {
            Map<String, Object> revenueData = analyticsService.getRevenueAnalytics("month");
            Map<String, Object> trendsData = dashboardService.getDailyTrends(30);
            String csv = generateRevenueCSV(revenueData, trendsData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", 
                "revenue-report-" + LocalDateTime.now() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes());
                
        } catch (Exception e) {
            System.err.println("❌ Error generating revenue report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/reports/trips/csv")
    public ResponseEntity<byte[]> downloadTripsReport() {
        try {
            Map<String, Object> performance = dashboardService.getVehiclePerformance();
            String csv = generateTripsCSV(performance);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", 
                "trips-report-" + LocalDateTime.now() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes());
                
        } catch (Exception e) {
            System.err.println("❌ Error generating trips report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/reports/summary/csv")
    public ResponseEntity<byte[]> downloadSummaryReport() {
        try {
            Map<String, Object> kpi = dashboardService.getKPIMetrics();
            String csv = generateSummaryCSV(kpi);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", 
                "summary-report-" + LocalDateTime.now() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes());
                
        } catch (Exception e) {
            System.err.println("❌ Error generating summary report: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // ========== CSV Generation Helper Methods ==========
    
    private String generateFleetCSV(Map<String, Object> data) {
        StringBuilder csv = new StringBuilder();
        csv.append("Vehicle Type,Count\n");
        
        @SuppressWarnings("unchecked")
        Map<String, Long> typeDistribution = (Map<String, Long>) data.get("typeDistribution");
        
        if (typeDistribution != null) {
            typeDistribution.forEach((type, count) -> 
                csv.append(type).append(",").append(count).append("\n"));
        }
        
        return csv.toString();
    }
    
    private String generateBookingsCSV(Map<String, Object> data) {
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Bookings\n");
        
        @SuppressWarnings("unchecked")
        List<String> dates = (List<String>) data.get("dates");
        @SuppressWarnings("unchecked")
        List<Long> bookings = (List<Long>) data.get("bookings");
        
        if (dates != null && bookings != null) {
            for (int i = 0; i < dates.size(); i++) {
                csv.append(dates.get(i)).append(",").append(bookings.get(i)).append("\n");
            }
        }
        
        return csv.toString();
    }
    
    private String generateRevenueCSV(Map<String, Object> revenueData, 
                                     Map<String, Object> trendsData) {
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Revenue\n");
        
        @SuppressWarnings("unchecked")
        List<String> dates = (List<String>) trendsData.get("dates");
        @SuppressWarnings("unchecked")
        List<Double> revenue = (List<Double>) trendsData.get("revenue");
        
        if (dates != null && revenue != null) {
            for (int i = 0; i < dates.size(); i++) {
                csv.append(dates.get(i)).append(",").append(revenue.get(i)).append("\n");
            }
        }
        
        csv.append("\nTotal Revenue,").append(revenueData.get("totalRevenue")).append("\n");
        
        return csv.toString();
    }
    
    private String generateTripsCSV(Map<String, Object> data) {
        StringBuilder csv = new StringBuilder();
        csv.append("Vehicle Number,Model,Trips,Revenue\n");
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topVehicles = (List<Map<String, Object>>) data.get("topVehicles");
        
        if (topVehicles != null) {
            topVehicles.forEach(vehicle -> 
                csv.append(vehicle.get("vehicleNumber")).append(",")
                   .append(vehicle.get("model")).append(",")
                   .append(vehicle.get("trips")).append(",")
                   .append(vehicle.get("revenue")).append("\n"));
        }
        
        return csv.toString();
    }
    
    private String generateSummaryCSV(Map<String, Object> kpi) {
        StringBuilder csv = new StringBuilder();
        csv.append("Metric,Value\n");
        csv.append("Total Fleet,").append(kpi.get("totalFleet")).append("\n");
        csv.append("Available Vehicles,").append(kpi.get("availableVehicles")).append("\n");
        csv.append("In Use Vehicles,").append(kpi.get("inUseVehicles")).append("\n");
        csv.append("Total Bookings,").append(kpi.get("totalBookings")).append("\n");
        csv.append("Total Revenue,").append(kpi.get("totalRevenue")).append("\n");
        csv.append("Fleet Utilization %,").append(kpi.get("fleetUtilization")).append("\n");
        csv.append("Active Routes,").append(kpi.get("activeRoutes")).append("\n");
        csv.append("Trips Today,").append(kpi.get("tripsToday")).append("\n");
        
        return csv.toString();
    }
}