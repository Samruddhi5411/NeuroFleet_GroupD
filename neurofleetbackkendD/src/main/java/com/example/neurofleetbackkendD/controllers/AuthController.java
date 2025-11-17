//package com.example.neurofleetbackkendD.controllers;
//
//
//
//import com.example.neurofleetbackkendD.model.User;
//import com.example.neurofleetbackkendD.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
//public class AuthController {
//    
//    @Autowired
//    private AuthService authService;
//    
//    @PostMapping("/signup")
//    public ResponseEntity<?> register(@RequestBody User user) {
//        try {
//            User registeredUser = authService.register(user);
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "User registered successfully");
//            response.put("userId", registeredUser.getId());
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
//        String username = credentials.get("username");
//        String password = credentials.get("password");
//        
//        Optional<User> userOpt = authService.authenticate(username, password);
//        
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            Map<String, Object> response = new HashMap<>();
//            response.put("token", "dummy-jwt-token-" + user.getId());
//            response.put("role", user.getRole().toString());
//            response.put("username", user.getUsername());
//            response.put("fullName", user.getFullName());
//            return ResponseEntity.ok(response);
//        }
//        
//        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
//    }
//}

package com.example.neurofleetbackkendD.controllers;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.security.JwtUtil;
import com.example.neurofleetbackkendD.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins for testing
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("userId", registeredUser.getId());
            response.put("username", registeredUser.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            System.out.println("Login attempt for user: " + username);
            
            Optional<User> userOpt = authService.authenticate(username, password);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Generate JWT token
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", token);
                response.put("role", user.getRole().toString());
                response.put("username", user.getUsername());
                response.put("fullName", user.getFullName());
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                
                System.out.println("Login successful for: " + username);
                return ResponseEntity.ok(response);
            }
            
            System.out.println("Login failed - Invalid credentials for: " + username);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                
                response.put("success", true);
                response.put("valid", true);
                response.put("username", username);
                return ResponseEntity.ok(response);
            }
            
            response.put("success", false);
            response.put("valid", false);
            response.put("error", "Invalid or missing token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("valid", false);
            response.put("error", "Token validation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "working");
        response.put("message", "Auth endpoint is accessible");
        return ResponseEntity.ok(response);
    }
}
