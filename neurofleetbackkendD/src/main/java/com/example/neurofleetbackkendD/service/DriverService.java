package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DriverService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    // Get driver earnings with weekly breakdown
    @Transactional(readOnly = true)
    public Map<String, Object> getDriverEarnings(Long driverId) {
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        List<Booking> completedBookings = bookingRepository.findByDriverIdAndStatus(
            driverId, BookingStatus.COMPLETED
        );
        
        // Calculate total earnings
        double totalEarnings = completedBookings.stream()
            .mapToDouble(b -> b.getTotalPrice() * 0.7) // 70% driver share
            .sum();
        
        // Weekly earnings trend (last 7 days)
        List<Map<String, Object>> weeklyTrend = calculateWeeklyTrend(completedBookings);
        
        // This week's earnings
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        double thisWeekEarnings = completedBookings.stream()
            .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(weekStart))
            .mapToDouble(b -> b.getTotalPrice() * 0.7)
            .sum();
        
        // This month's earnings
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        double thisMonthEarnings = completedBookings.stream()
            .filter(b -> b.getCompletedAt() != null && b.getCompletedAt().isAfter(monthStart))
            .mapToDouble(b -> b.getTotalPrice() * 0.7)
            .sum();
        
        Map<String, Object> earnings = new HashMap<>();
        earnings.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
        earnings.put("thisWeekEarnings", Math.round(thisWeekEarnings * 100.0) / 100.0);
        earnings.put("thisMonthEarnings", Math.round(thisMonthEarnings * 100.0) / 100.0);
        earnings.put("totalTrips", completedBookings.size());
        earnings.put("weeklyTrend", weeklyTrend);
        earnings.put("completedBookings", completedBookings);
        
        return earnings;
    }
    
    // Calculate weekly earning trend for graph
    private List<Map<String, Object>> calculateWeeklyTrend(List<Booking> bookings) {
        List<Map<String, Object>> trend = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime dayEnd = dayStart.plusDays(1);
            
            double dayEarnings = bookings.stream()
                .filter(b -> b.getCompletedAt() != null && 
                           b.getCompletedAt().isAfter(dayStart) && 
                           b.getCompletedAt().isBefore(dayEnd))
                .mapToDouble(b -> b.getTotalPrice() * 0.7)
                .sum();
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", dayStart.getDayOfWeek().toString().substring(0, 3));
            dayData.put("date", dayStart.toLocalDate().toString());
            dayData.put("earnings", Math.round(dayEarnings * 100.0) / 100.0);
            
            trend.add(dayData);
        }
        
        return trend;
    }
    
    // Update driver stats after trip completion
    @Transactional
    public void updateDriverStats(Long driverId, Booking booking) {
        User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        // Update total trips
        driver.setTotalTrips(driver.getTotalTrips() + 1);
        
        // Update total earnings (70% of booking price)
        double driverShare = booking.getTotalPrice() * 0.7;
        driver.setTotalEarnings(driver.getTotalEarnings() + driverShare);
        
        userRepository.save(driver);
        
        System.out.println("✅ Driver stats updated: " + driver.getFullName() + 
                          " | Trips: " + driver.getTotalTrips() + 
                          " | Earnings: $" + driver.getTotalEarnings());
    }
}