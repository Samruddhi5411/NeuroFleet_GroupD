package com.example.neurofleetbackkendD.dto;

import com.example.neurofleetbackkendD.model.User;

public class LoginResponse {
    private String token;
    private String role;
    private String username;
    private String fullName;
    private Long id;
    private User user; 
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
        this.role = user.getRole().name();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.id = user.getId();
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}