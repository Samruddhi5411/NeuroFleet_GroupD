

package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Find user by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Find user by ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get users by role
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }
    
    // Get active drivers only
    public List<User> getActiveDrivers() {
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        return drivers.stream()
            .filter(User::getActive)
            .toList();
    }
    
    // Get all managers
    public List<User> getAllManagers() {
        return userRepository.findByRole(UserRole.MANAGER);
    }
    
    // Get all customers
    public List<User> getAllCustomers() {
        return userRepository.findByRole(UserRole.CUSTOMER);
    }
    
    public List<User> getAvailableDrivers() {
        return userRepository.findByRoleAndActive(UserRole.DRIVER, true);
    }
    
    // Create new user with automatic city assignment for drivers
    public User register(User user) {
        userRepository.findByUsername(user.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already exists");
        });

        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);

        // ✅ AUTO-ASSIGN CITY FOR DRIVERS
        if (user.getRole() == UserRole.DRIVER) {
            String[] cities = {
                "Mumbai", "Delhi", "Bangalore", "Hyderabad",
                "Chennai", "Pune", "Noida", "Gurgaon"
            };
            
            // Count existing drivers to determine next city
            long driverCount = userRepository.findByRole(UserRole.DRIVER).size();
            int cityIndex = (int) (driverCount % cities.length);
            String assignedCity = cities[cityIndex];
            
            user.setAssignedCity(assignedCity);
            System.out.println("🌆 NEW DRIVER: " + user.getFullName() + " assigned to " + assignedCity);
        }

        return userRepository.save(user);
    }

    // Update user
    public User updateUser(Long id, User updates) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.getFullName() != null) {
            user.setFullName(updates.getFullName());
        }
        if (updates.getEmail() != null) {
            user.setEmail(updates.getEmail());
        }
        if (updates.getPhoneNumber() != null) {
            user.setPhoneNumber(updates.getPhoneNumber());
        }
        if (updates.getAddress() != null) {
            user.setAddress(updates.getAddress());
        }
        if (updates.getLicenseNumber() != null) {
            user.setLicenseNumber(updates.getLicenseNumber());
        }
        if (updates.getActive() != null) {
            user.setActive(updates.getActive());
        }
        
        return userRepository.save(user);
    }
    
    // Toggle user active status
    public User toggleUserActive(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(!user.getActive());
        return userRepository.save(user);
    }
    
    // Authenticate user
    public Optional<User> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
    
    // Count users by role
    public long countByRole(UserRole role) {
        return userRepository.findByRole(role).size();
    }
}