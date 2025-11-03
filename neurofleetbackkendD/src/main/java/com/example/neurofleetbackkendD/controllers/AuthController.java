package com.example.neurofleetbackkendD.controllers;




import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.repository.UserRepository;
import com.example.neurofleetbackkendD.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getRole().toString());
                
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole().toString());
                response.put("username", user.getUsername());
                response.put("fullName", user.getFullName());
                
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Check if username exists
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        
        // Check if email exists
        if (user.getEmail() != null) {
            Optional<User> existingEmail = userRepository.findByEmail(user.getEmail());
            if (existingEmail.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
            }
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
        }

        User savedUser = userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully",
            "username", savedUser.getUsername(),
            "role", savedUser.getRole().toString()
        ));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        return register(user);  // Alias for register
    }
}