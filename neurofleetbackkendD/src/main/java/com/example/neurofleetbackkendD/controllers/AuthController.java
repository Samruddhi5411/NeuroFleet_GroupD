package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.dto.LoginRequest;
import com.example.neurofleetbackkendD.dto.LoginResponse;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.security.JwtUtil;
import com.example.neurofleetbackkendD.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("🔐 Login attempt for: " + request.getUsername());
            
            // Authenticate user - handle Optional<User>
            Optional<User> userOptional = authService.authenticate(request.getUsername(), request.getPassword());
            
            if (!userOptional.isPresent()) {
                System.err.println("❌ Authentication failed - user not found or invalid password");
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            User user = userOptional.get();
            
            System.out.println("✅ User authenticated: " + user.getUsername());
            System.out.println("✅ User role: " + user.getRole());
            System.out.println("✅ User ID: " + user.getId());
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());
            
            System.out.println("🔑 Token generated successfully");
            System.out.println("🔑 Token preview: " + token.substring(0, Math.min(30, token.length())) + "...");
            System.out.println("🔑 Token length: " + token.length());
            
            // Create response with BOTH formats for compatibility
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setRole(user.getRole().name());
            response.setUsername(user.getUsername());
            response.setFullName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            response.setId(user.getId());
            
            // Also include user object
            response.setUser(user);
            
            System.out.println("✅ Login successful - Response prepared");
            System.out.println("📦 Response: token=" + (token != null ? "present" : "NULL") + 
                             ", role=" + response.getRole() + 
                             ", username=" + response.getUsername());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Login failed with exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            System.out.println("📝 Signup attempt for: " + user.getUsername());
            User created = authService.register(user);
            System.out.println("✅ User registered successfully");
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("❌ Signup failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}