package com.example.neurofleetbackkendD.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.neurofleetbackkendD.repository.*;
import com.example.neurofleetbackkendD.model.enums.*;
import java.util.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @GetMapping("/data-status")
    public ResponseEntity<?> getDataStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("users", userRepository.count());
        status.put("vehicles", vehicleRepository.count());
        status.put("bookings", bookingRepository.count());
        
        status.put("admins", userRepository.findByRole(UserRole.ADMIN).size());
        status.put("managers", userRepository.findByRole(UserRole.MANAGER).size());
        status.put("drivers", userRepository.findByRole(UserRole.DRIVER).size());
        status.put("customers", userRepository.findByRole(UserRole.CUSTOMER).size());
        
        status.put("availableVehicles", vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size());
        status.put("inUseVehicles", vehicleRepository.findByStatus(VehicleStatus.IN_USE).size());
        
        status.put("pendingBookings", bookingRepository.findByStatus(BookingStatus.PENDING).size());
        status.put("completedBookings", bookingRepository.findByStatus(BookingStatus.COMPLETED).size());
        
        return ResponseEntity.ok(status);
    }
}
