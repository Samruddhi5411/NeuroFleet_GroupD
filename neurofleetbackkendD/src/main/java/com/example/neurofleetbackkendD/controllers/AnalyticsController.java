package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    // Get KPI metrics
    @GetMapping("/kpi")
    public ResponseEntity<?> getKPIMetrics() {
        try {
            Map<String, Object> kpi = analyticsService.getKPIMetrics();
            return ResponseEntity.ok(kpi);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get fleet distribution
    @GetMapping("/fleet-distribution")
    public ResponseEntity<?> getFleetDistribution() {
        try {
            Map<String, Object> distribution = analyticsService.getFleetDistribution();
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    

    
    @GetMapping("/hourly-activity")
    public ResponseEntity<?> getHourlyActivity() {
        try {
            Map<String, Object> activity = analyticsService.getHourlyActivity();
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/trip-density")
    public ResponseEntity<?> getTripDensityByCity() {
        try {
            List<Map<String, Object>> density = analyticsService.getTripDensityByCity();
            return ResponseEntity.ok(density);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get daily trends
    @GetMapping("/daily-trends")
    public ResponseEntity<?> getDailyTrends(@RequestParam(defaultValue = "7") int days) {
        try {
            Map<String, Object> trends = analyticsService.getDailyTrends(days);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get vehicle performance
    @GetMapping("/vehicle-performance")
    public ResponseEntity<?> getVehiclePerformance() {
        try {
            Map<String, Object> performance = analyticsService.getVehiclePerformance();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Download fleet report CSV
    @GetMapping("/reports/fleet/csv")
    public ResponseEntity<ByteArrayResource> downloadFleetReport() {
        try {
            byte[] csvData = analyticsService.generateFleetReportCSV();
            ByteArrayResource resource = new ByteArrayResource(csvData);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fleet-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(csvData.length)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Download bookings report CSV
    @GetMapping("/reports/bookings/csv")
    public ResponseEntity<ByteArrayResource> downloadBookingsReport() {
        try {
            byte[] csvData = analyticsService.generateBookingsReportCSV();
            ByteArrayResource resource = new ByteArrayResource(csvData);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(csvData.length)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Download revenue report CSV
    @GetMapping("/reports/revenue/csv")
    public ResponseEntity<ByteArrayResource> downloadRevenueReport() {
        try {
            byte[] csvData = analyticsService.generateRevenueReportCSV();
            ByteArrayResource resource = new ByteArrayResource(csvData);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(csvData.length)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Download trips report CSV
    @GetMapping("/reports/trips/csv")
    public ResponseEntity<ByteArrayResource> downloadTripsReport() {
        try {
            byte[] csvData = analyticsService.generateTripsReportCSV();
            ByteArrayResource resource = new ByteArrayResource(csvData);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trips-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(csvData.length)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}