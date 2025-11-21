package com.example.neurofleetbackkendD.model;




import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.neurofleetbackkendD.model.enums.UserRole;


import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
//    private String phone;
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "license_number")
    private String licenseNumber;

    @Column(name = "license_expiry")
    private LocalDateTime licenseExpiry;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "total_trips")
    private Integer totalTrips = 0;

    @Column(name = "total_earnings")
    private Double totalEarnings = 0.0;

    @Column(name = "rating")
    private Double rating = 5.0;
 
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    private Boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Add getters and setters
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(LocalDateTime licenseExpiry) { this.licenseExpiry = licenseExpiry; }

    public Integer getTotalTrips() { return totalTrips; }
    public void setTotalTrips(Integer totalTrips) { this.totalTrips = totalTrips; }

    public Double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
//    public String getPhone() { return phone; }
//    public void setPhone(String phone) { this.phone = phone; }
//    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}