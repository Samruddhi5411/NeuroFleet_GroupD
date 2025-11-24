package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Create a new trip when driver starts journey
     */
    @Transactional
    public Trip createTrip(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Vehicle vehicle = booking.getVehicle();
        
        Trip trip = new Trip();
        trip.setBooking(booking);
        trip.setVehicle(vehicle);
        trip.setDriver(booking.getDriver());
        trip.setCustomer(booking.getCustomer());
        
        trip.setStartTime(LocalDateTime.now());
        trip.setStartLatitude(booking.getPickupLatitude());
        trip.setStartLongitude(booking.getPickupLongitude());
        
        trip.setStartFuelLevel(vehicle.getFuelLevel());
        trip.setStartBatteryLevel(vehicle.getBatteryLevel());
        
        trip.setStatus("IN_PROGRESS");
        trip.setCreatedAt(LocalDateTime.now());
        
        System.out.println("✅ Trip created for booking: " + bookingId);
        return tripRepository.save(trip);
    }
    
    /**
     * Complete a trip and calculate metrics
     */
    @Transactional
    public Trip completeTrip(Long tripId, Map<String, Object> tripData) {
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        if (!"IN_PROGRESS".equals(trip.getStatus())) {
            throw new RuntimeException("Trip is not in progress");
        }
        
        Vehicle vehicle = trip.getVehicle();
        
        // Set end time and location
        trip.setEndTime(LocalDateTime.now());
        trip.setEndLatitude(trip.getBooking().getDropoffLatitude());
        trip.setEndLongitude(trip.getBooking().getDropoffLongitude());
        
        // Calculate duration
        long durationMinutes = ChronoUnit.MINUTES.between(trip.getStartTime(), trip.getEndTime());
        trip.setDurationMinutes(durationMinutes);
        
        // Set final fuel/battery levels
        trip.setEndFuelLevel(vehicle.getFuelLevel());
        trip.setEndBatteryLevel(vehicle.getBatteryLevel());
        
        // Calculate consumption
        if (trip.getStartFuelLevel() != null && trip.getEndFuelLevel() != null) {
            trip.setFuelConsumed(trip.getStartFuelLevel() - trip.getEndFuelLevel());
        }
        if (trip.getStartBatteryLevel() != null && trip.getEndBatteryLevel() != null) {
            trip.setBatteryConsumed(trip.getStartBatteryLevel() - trip.getEndBatteryLevel());
        }
        
        // Calculate distance (from booking or actual travel)
        Double distance = calculateDistance(
            trip.getStartLatitude(), trip.getStartLongitude(),
            trip.getEndLatitude(), trip.getEndLongitude()
        );
        trip.setDistanceTraveled(distance);
        
        // Calculate average speed
        if (durationMinutes > 0) {
            double avgSpeed = (distance / durationMinutes) * 60; // km/h
            trip.setAverageSpeed(avgSpeed);
        }
        
        // Set max speed from telemetry (would come from real-time tracking)
        trip.setMaxSpeed((Double) tripData.getOrDefault("maxSpeed", vehicle.getSpeed()));
        
        // Set costs
        trip.setTripCost(trip.getBooking().getTotalPrice());
        trip.setDriverEarnings(trip.getBooking().getTotalPrice() * 0.7); // 70% to driver
        
        // Complete trip
        trip.setStatus("COMPLETED");
        trip.setCompletedAt(LocalDateTime.now());
        
        System.out.println("✅ Trip completed: " + tripId);
        return tripRepository.save(trip);
    }
    
    /**
     * Get all trips
     */
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }
    
    /**
     * Get trips by driver
     */
    public List<Trip> getTripsByDriver(Long driverId) {
        return tripRepository.findByDriverId(driverId);
    }
    
    /**
     * Get trips by customer
     */
    public List<Trip> getTripsByCustomer(Long customerId) {
        return tripRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get trips by vehicle
     */
    public List<Trip> getTripsByVehicle(Long vehicleId) {
        return tripRepository.findByVehicleId(vehicleId);
    }
    
    /**
     * Get active trips
     */
    public List<Trip> getActiveTrips() {
        return tripRepository.findByStatusIn(Arrays.asList("STARTED", "IN_PROGRESS"));
    }
    
    /**
     * Get trip statistics for a driver
     */
    public Map<String, Object> getDriverTripStats(Long driverId) {
        List<Trip> trips = tripRepository.findByDriverId(driverId);
        List<Trip> completedTrips = trips.stream()
            .filter(t -> "COMPLETED".equals(t.getStatus()))
            .toList();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrips", trips.size());
        stats.put("completedTrips", completedTrips.size());
        
        double totalDistance = completedTrips.stream()
            .mapToDouble(t -> t.getDistanceTraveled() != null ? t.getDistanceTraveled() : 0)
            .sum();
        stats.put("totalDistanceTraveled", Math.round(totalDistance * 100.0) / 100.0);
        
        double totalEarnings = completedTrips.stream()
            .mapToDouble(t -> t.getDriverEarnings() != null ? t.getDriverEarnings() : 0)
            .sum();
        stats.put("totalEarnings", Math.round(totalEarnings * 100.0) / 100.0);
        
        double avgSpeed = completedTrips.stream()
            .filter(t -> t.getAverageSpeed() != null)
            .mapToDouble(Trip::getAverageSpeed)
            .average()
            .orElse(0);
        stats.put("averageSpeed", Math.round(avgSpeed * 100.0) / 100.0);
        
        return stats;
    }
    
    /**
     * Get trip statistics for a vehicle
     */
    public Map<String, Object> getVehicleTripStats(Long vehicleId) {
        List<Trip> trips = tripRepository.findByVehicleId(vehicleId);
        List<Trip> completedTrips = trips.stream()
            .filter(t -> "COMPLETED".equals(t.getStatus()))
            .toList();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrips", trips.size());
        stats.put("completedTrips", completedTrips.size());
        
        double totalDistance = completedTrips.stream()
            .mapToDouble(t -> t.getDistanceTraveled() != null ? t.getDistanceTraveled() : 0)
            .sum();
        stats.put("totalDistanceTraveled", Math.round(totalDistance * 100.0) / 100.0);
        
        int totalFuelConsumed = completedTrips.stream()
            .filter(t -> t.getFuelConsumed() != null)
            .mapToInt(Trip::getFuelConsumed)
            .sum();
        stats.put("totalFuelConsumed", totalFuelConsumed);
        
        int totalBatteryConsumed = completedTrips.stream()
            .filter(t -> t.getBatteryConsumed() != null)
            .mapToInt(Trip::getBatteryConsumed)
            .sum();
        stats.put("totalBatteryConsumed", totalBatteryConsumed);
        
        return stats;
    }
    
    /**
     * Calculate distance using Haversine formula
     */
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 0.0;
        }
        
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
}