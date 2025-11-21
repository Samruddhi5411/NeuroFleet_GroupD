package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<User, Long> {
    
    // Find all active drivers
    List<User> findByRoleAndActive(UserRole role, Boolean active);
    
    // Find driver by username
    Optional<User> findByUsername(String username);
    
    // Find drivers with high ratings
    List<User> findByRoleAndRatingGreaterThanEqual(UserRole role, Double rating);
    
    // Count active drivers
    long countByRoleAndActive(UserRole role, Boolean active);
}