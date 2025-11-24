//package com.example.neurofleetbackkendD.controllers;
//
//import com.example.neurofleetbackkendD.model.User;
//import com.example.neurofleetbackkendD.service.AuthService;
//import com.example.neurofleetbackkendD.service.DashboardService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/dashboard")
//@CrossOrigin(origins = "http://localhost:3000")
//public class DashboardController {
//    
//    @Autowired
//    private DashboardService dashboardService;
//    
//    @Autowired
//    private AuthService authService;
//    
//    @GetMapping("/admin")
//    public ResponseEntity<?> getAdminDashboard() {
//        return ResponseEntity.ok(dashboardService.getAdminDashboard());
//    }
//    
//    @GetMapping("/manager")
//    public ResponseEntity<?> getManagerDashboard() {
//        return ResponseEntity.ok(dashboardService.getManagerDashboard());
//    }
//    
//    @GetMapping("/driver")
//    public ResponseEntity<?> getDriverDashboard(@RequestParam String username) {
//        try {
//            User driver = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Driver not found"));
//            
//            return ResponseEntity.ok(dashboardService.getDriverDashboard(driver.getId()));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    @GetMapping("/customer")
//    public ResponseEntity<?> getCustomerDashboard(@RequestParam String username) {
//        try {
//            User customer = authService.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//            
//            return ResponseEntity.ok(dashboardService.getCustomerDashboard(customer.getId()));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//}
