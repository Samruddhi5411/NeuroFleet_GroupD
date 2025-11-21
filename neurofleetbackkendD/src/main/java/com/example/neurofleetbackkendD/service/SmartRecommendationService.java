package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.BookingStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartRecommendationService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private CustomerPreferenceRepository preferenceRepository;
    
    @Autowired
    private VehicleAvailabilityRepository availabilityRepository;
    
    @Autowired
    private AIService aiService;
    
    // Get smart vehicle recommendations for customer
    public Map<String, Object> getSmartRecommendations(Long customerId, Map<String, Object> filters) {
        Map<String, Object> result = new HashMap<>();
        
        // Get or create customer preferences
        CustomerPreference preferences = preferenceRepository.findByCustomerId(customerId)
            .orElse(null);
        
        // Get available vehicles
        List<Vehicle> availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        
        // Apply filters
        List<Vehicle> filteredVehicles = applyFilters(availableVehicles, filters);
        
        // Score and rank vehicles
        List<Map<String, Object>> scoredVehicles = scoreVehicles(
            filteredVehicles, preferences, filters);
        
        // Sort by score (highest first)
        scoredVehicles.sort((a, b) -> 
            Double.compare((Double)b.get("recommendationScore"), 
                          (Double)a.get("recommendationScore")));
        
        result.put("totalVehicles", filteredVehicles.size());
        result.put("recommendations", scoredVehicles);
        result.put("topRecommendation", scoredVehicles.isEmpty() ? null : scoredVehicles.get(0));
        result.put("aiPowered", true);
        
        // Add customer insights
        if (preferences != null) {
            Map<String, Object> insights = new HashMap<>();
            insights.put("totalBookings", preferences.getTotalBookings());
            insights.put("preferredType", preferences.getMostBookedVehicleType());
            insights.put("averagePrice", preferences.getAverageBookingPrice());
            result.put("customerInsights", insights);
        }
        
        return result;
    }
    
    private List<Vehicle> applyFilters(List<Vehicle> vehicles, Map<String, Object> filters) {
        return vehicles.stream()
            .filter(v -> {
                // Vehicle Type filter
                if (filters.containsKey("vehicleType") && filters.get("vehicleType") != null) {
                    String type = (String) filters.get("vehicleType");
                    if (!v.getType().name().equals(type)) {
                        return false;
                    }
                }
                
                // Electric filter
                if (filters.containsKey("isElectric") && filters.get("isElectric") != null) {
                    Boolean isElectric = (Boolean) filters.get("isElectric");
                    if (!v.getIsElectric().equals(isElectric)) {
                        return false;
                    }
                }
                
                // Capacity filter
                if (filters.containsKey("minSeats") && filters.get("minSeats") != null) {
                    Integer minSeats = ((Number) filters.get("minSeats")).intValue();
                    if (v.getCapacity() < minSeats) {
                        return false;
                    }
                }
                
                if (filters.containsKey("maxSeats") && filters.get("maxSeats") != null) {
                    Integer maxSeats = ((Number) filters.get("maxSeats")).intValue();
                    if (v.getCapacity() > maxSeats) {
                        return false;
                    }
                }
                
                // Health score filter (minimum 70%)
                if (v.getHealthScore() < 70) {
                    return false;
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> scoreVehicles(
            List<Vehicle> vehicles, 
            CustomerPreference preferences,
            Map<String, Object> filters) {
        
        return vehicles.stream()
            .map(vehicle -> {
                Map<String, Object> scored = new HashMap<>();
                double score = 0.0;
                List<String> reasons = new ArrayList<>();
                
                // Base score from health
                score += vehicle.getHealthScore() * 0.3;
                
                // Preference matching
                if (preferences != null) {
                    if (preferences.getPreferredVehicleType() != null &&
                        vehicle.getType().name().equals(preferences.getPreferredVehicleType())) {
                        score += 20;
                        reasons.add("Matches your preferred vehicle type");
                    }
                    
                    if (preferences.getPreferElectric() != null &&
                        vehicle.getIsElectric().equals(preferences.getPreferElectric())) {
                        score += 15;
                        reasons.add(vehicle.getIsElectric() ? 
                            "Eco-friendly electric vehicle" : "Traditional fuel vehicle");
                    }
                    
                    if (preferences.getMostBookedVehicleType() != null &&
                        vehicle.getType().name().equals(preferences.getMostBookedVehicleType())) {
                        score += 10;
                        reasons.add("Similar to your previous bookings");
                    }
                }
                
                // Battery/Fuel level bonus
                if (vehicle.getIsElectric()) {
                    score += vehicle.getBatteryLevel() * 0.15;
                    if (vehicle.getBatteryLevel() > 80) {
                        reasons.add("Fully charged");
                    }
                } else {
                    score += vehicle.getFuelLevel() * 0.15;
                    if (vehicle.getFuelLevel() > 80) {
                        reasons.add("Full fuel tank");
                    }
                }
                
                // Vehicle age (lower mileage = newer)
                if (vehicle.getMileage() < 20000) {
                    score += 10;
                    reasons.add("Low mileage vehicle");
                }
                
                // AI recommendation badge
                boolean isAIRecommended = score > 80;
                
                scored.put("vehicle", vehicle);
                scored.put("recommendationScore", Math.round(score * 10.0) / 10.0);
                scored.put("reasons", reasons);
                scored.put("isAIRecommended", isAIRecommended);
                scored.put("pricePerDay", calculatePricePerDay(vehicle));
                
                return scored;
            })
            .collect(Collectors.toList());
    }
    
    private double calculatePricePerDay(Vehicle vehicle) {
        double basePrice = 1000.0; // Base price in INR
        
        switch (vehicle.getType()) {
            case SEDAN: basePrice = 1500.0; break;
            case SUV: basePrice = 2500.0; break;
            case VAN: basePrice = 3000.0; break;
            case TRUCK: basePrice = 4000.0; break;
            case BUS: basePrice = 6000.0; break;
            case BIKE: basePrice = 500.0; break;
        }
        
        // Electric premium
        if (vehicle.getIsElectric()) {
            basePrice *= 1.2;
        }
        
        // Health discount
        if (vehicle.getHealthScore() < 80) {
            basePrice *= 0.9;
        }
        
        return Math.round(basePrice * 100.0) / 100.0;
    }
    
    // Update customer preferences based on booking
    @Transactional
    public void updateCustomerPreferences(Long customerId, Booking booking) {
        CustomerPreference prefs = preferenceRepository.findByCustomerId(customerId)
            .orElseGet(() -> {
                CustomerPreference newPrefs = new CustomerPreference();
                newPrefs.setCustomer(booking.getCustomer());
                return newPrefs;
            });
        
        prefs.setTotalBookings(prefs.getTotalBookings() + 1);
        
        // Update most booked type
        List<Booking> customerBookings = bookingRepository.findByCustomerId(customerId);
        Map<String, Long> typeCount = customerBookings.stream()
            .collect(Collectors.groupingBy(
                b -> b.getVehicle().getType().name(),
                Collectors.counting()
            ));
        
        String mostBooked = typeCount.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
        prefs.setMostBookedVehicleType(mostBooked);
        
        // Update average price
        double avgPrice = customerBookings.stream()
            .filter(b -> b.getTotalPrice() != null)
            .mapToDouble(Booking::getTotalPrice)
            .average()
            .orElse(0);
        prefs.setAverageBookingPrice(avgPrice);
        
        prefs.setUpdatedAt(LocalDateTime.now());
        preferenceRepository.save(prefs);
    }
    
    // Get vehicle availability calendar
    public Map<String, Object> getVehicleAvailabilityCalendar(
            Long vehicleId, LocalDateTime startDate, int days) {
        
        Map<String, Object> calendar = new HashMap<>();
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        List<Map<String, Object>> slots = new ArrayList<>();
        
        for (int i = 0; i < days; i++) {
            LocalDateTime date = startDate.plusDays(i);
            
            // Check if vehicle has bookings for this day
            List<Booking> dayBookings = bookingRepository.findByVehicleId(vehicleId).stream()
                .filter(b -> {
                    if (b.getStartTime() == null) return false;
                    return b.getStartTime().toLocalDate().equals(date.toLocalDate()) &&
                           (b.getStatus() == BookingStatus.CONFIRMED || 
                            b.getStatus() == BookingStatus.IN_PROGRESS ||
                            b.getStatus() == BookingStatus.DRIVER_ACCEPTED);
                })
                .collect(Collectors.toList());
            
            boolean isAvailable = dayBookings.isEmpty();
            
            Map<String, Object> slot = new HashMap<>();
            slot.put("date", date.toLocalDate().toString());
            slot.put("isAvailable", isAvailable);
            slot.put("pricePerDay", calculatePricePerDay(vehicle));
            slot.put("bookingsCount", dayBookings.size());
            
            slots.add(slot);
        }
        
        calendar.put("vehicleId", vehicleId);
        calendar.put("vehicleNumber", vehicle.getVehicleNumber());
        calendar.put("totalDays", days);
        calendar.put("slots", slots);
        
        long availableDays = slots.stream()
            .filter(s -> (Boolean) s.get("isAvailable"))
            .count();
        calendar.put("availableDays", availableDays);
        
        return calendar;
    }
    
    // Search vehicles with advanced filters
    public List<Map<String, Object>> searchVehicles(Map<String, Object> searchParams) {
        List<Vehicle> allVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        
        return allVehicles.stream()
            .filter(v -> matchesSearchCriteria(v, searchParams))
            .map(v -> {
                Map<String, Object> result = new HashMap<>();
                result.put("vehicle", v);
                result.put("pricePerDay", calculatePricePerDay(v));
                result.put("isAvailable", true);
                return result;
            })
            .collect(Collectors.toList());
    }
    
    private boolean matchesSearchCriteria(Vehicle vehicle, Map<String, Object> params) {
        if (params.containsKey("keyword")) {
            String keyword = ((String) params.get("keyword")).toLowerCase();
            return vehicle.getManufacturer().toLowerCase().contains(keyword) ||
                   vehicle.getModel().toLowerCase().contains(keyword) ||
                   vehicle.getVehicleNumber().toLowerCase().contains(keyword);
        }
        return true;
    }
}