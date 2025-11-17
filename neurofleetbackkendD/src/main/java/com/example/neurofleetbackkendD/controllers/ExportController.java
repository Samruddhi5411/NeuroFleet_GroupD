package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.service.ExportService;
import com.example.neurofleetbackkendD.service.UrbanMobilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:3000")
public class ExportController {
    
    @Autowired
    private ExportService exportService;
    
    @Autowired
    private UrbanMobilityService urbanMobilityService;
    
    @PostMapping("/csv")
    public ResponseEntity<String> exportCSV(@RequestBody Map<String, Object> params) {
        try {
            String reportType = (String) params.getOrDefault("reportType", "bookings");
            
            LocalDateTime startDate = params.containsKey("startDate") ?
                LocalDateTime.parse((String) params.get("startDate")) :
                LocalDateTime.now().minusMonths(1);
            
            LocalDateTime endDate = params.containsKey("endDate") ?
                LocalDateTime.parse((String) params.get("endDate")) :
                LocalDateTime.now();
            
            Map<String, Object> report = urbanMobilityService.generateReport(
                reportType, startDate, endDate);
            
            Object data = report.get("data");
            String csv = "";
            
            if (data instanceof List) {
                csv = exportService.generateCSV((List<Map<String, Object>>) data);
            }
            
            String filename = reportType + "_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + 
                ".csv";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", filename);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating CSV: " + e.getMessage());
        }
    }
    
    @PostMapping("/html")
    public ResponseEntity<String> exportHTML(@RequestBody Map<String, Object> params) {
        try {
            String reportType = (String) params.getOrDefault("reportType", "comprehensive");
            
            LocalDateTime startDate = params.containsKey("startDate") ?
                LocalDateTime.parse((String) params.get("startDate")) :
                LocalDateTime.now().minusMonths(1);
            
            LocalDateTime endDate = params.containsKey("endDate") ?
                LocalDateTime.parse((String) params.get("endDate")) :
                LocalDateTime.now();
            
            Map<String, Object> report = urbanMobilityService.generateReport(
                reportType, startDate, endDate);
            
            String html = exportService.generateHTMLReport(report);
            
            String filename = reportType + "_report_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + 
                ".html";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            headers.setContentDispositionFormData("attachment", filename);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(html);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating HTML: " + e.getMessage());
        }
    }
}
