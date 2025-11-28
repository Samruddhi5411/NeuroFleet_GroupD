package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Booking;
import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.model.enums.PaymentStatus;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.repository.BookingRepository;
import com.example.neurofleetbackkendD.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    
      //Get drivers with REAL trip statistics calculated from bookings
     
    public List<Map<String, Object>> getDriversWithRealStats() {
        List<User> drivers = userRepository.findByRoleAndActive(UserRole.DRIVER, true);
        List<Map<String, Object>> driverStats = new ArrayList<>();
        
        for (User driver : drivers) {
            // COUNT REAL COMPLETED TRIPS
            Long completedTrips = bookingRepository.countByDriverIdAndStatus(
                driver.getId(), 
                BookingStatus.COMPLETED
            );
            
            //  CALCULATE REAL EARNINGS FROM PAID COMPLETED TRIPS
            List<Booking> completedBookings = bookingRepository.findByDriverIdAndStatus(
                driver.getId(), 
                BookingStatus.COMPLETED
            );
            
            Double totalEarnings = completedBookings.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PAID)
                .mapToDouble(b -> b.getTotalPrice() != null ? b.getTotalPrice() * 0.7 : 0.0)
                .sum();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("id", driver.getId());
            stats.put("username", driver.getUsername());
            stats.put("fullName", driver.getFullName());
            stats.put("email", driver.getEmail());
            stats.put("phoneNumber", driver.getPhoneNumber());
            stats.put("licenseNumber", driver.getLicenseNumber());
            stats.put("rating", driver.getRating());
            stats.put("totalTrips", completedTrips);  //  REAL COUNT
            stats.put("totalEarnings", totalEarnings);  //  REAL EARNINGS
            stats.put("active", driver.getActive());
            stats.put("role", driver.getRole());
            
            driverStats.add(stats);
        }
        
        System.out.println("✅ Loaded " + driverStats.size() + " drivers with REAL statistics");
        return driverStats;
    }
}