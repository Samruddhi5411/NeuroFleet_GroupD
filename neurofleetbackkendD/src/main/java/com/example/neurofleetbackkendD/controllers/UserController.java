package com.example.neurofleetbackkendD.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.repository.UserRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        return ResponseEntity.ok(userRepository.findByRole(role));
    }
    
 // Get driver profile
    @GetMapping("/driver/profile")
    public ResponseEntity<?> getDriverProfile(@RequestParam String username) {
        try {
            User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update driver profile
    @PutMapping("/driver/profile")
    public ResponseEntity<?> updateDriverProfile(@RequestParam String username, @RequestBody User updatedProfile) {
        try {
            User driver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
            
            // Update allowed fields
            if (updatedProfile.getFullName() != null) driver.setFullName(updatedProfile.getFullName());
            if (updatedProfile.getEmail() != null) driver.setEmail(updatedProfile.getEmail());
            if (updatedProfile.getPhoneNumber() != null) driver.setPhoneNumber(updatedProfile.getPhoneNumber());
            if (updatedProfile.getAddress() != null) driver.setAddress(updatedProfile.getAddress());
            if (updatedProfile.getLicenseNumber() != null) driver.setLicenseNumber(updatedProfile.getLicenseNumber());
            if (updatedProfile.getProfilePicture() != null) driver.setProfilePicture(updatedProfile.getProfilePicture());
            
            User saved = userRepository.save(driver);
            return ResponseEntity.ok(saved);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/drivers/available")
    public ResponseEntity<List<User>> getAvailableDrivers() {
        return ResponseEntity.ok(userRepository.findByRoleAndActive(UserRole.DRIVER, true));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleUserActive(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setActive(!user.getActive());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
