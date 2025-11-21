package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.Vehicle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    // Send vehicle telemetry updates to all connected clients
    public void broadcastVehicleTelemetry(List<Vehicle> vehicles) {
        messagingTemplate.convertAndSend("/topic/telemetry", vehicles);
        System.out.println("📡 Broadcast telemetry for " + vehicles.size() + " vehicles");
    }
    
    // Send specific vehicle update to customer
    public void sendVehicleLocationToCustomer(Long customerId, Vehicle vehicle) {
        messagingTemplate.convertAndSend(
            "/queue/customer-" + customerId + "/vehicle-location", 
            vehicle
        );
        System.out.println("📍 Sent vehicle location to customer: " + customerId);
    }
    
    // Notify customer when trip starts
    public void notifyTripStarted(Long customerId, Map<String, Object> tripData) {
        messagingTemplate.convertAndSend(
            "/queue/customer-" + customerId + "/trip-started", 
            tripData
        );
        System.out.println("🚀 Notified customer " + customerId + " - Trip started");
    }
    
    // Notify driver of new booking
    public void notifyDriverNewBooking(Long driverId, Map<String, Object> bookingData) {
        messagingTemplate.convertAndSend(
            "/queue/driver-" + driverId + "/new-booking", 
            bookingData
        );
        System.out.println("📧 Notified driver " + driverId + " - New booking");
    }
    
    // Notify customer of payment confirmation
    public void notifyPaymentConfirmed(Long customerId, Map<String, Object> paymentData) {
        messagingTemplate.convertAndSend(
            "/queue/customer-" + customerId + "/payment-confirmed", 
            paymentData
        );
        System.out.println("💳 Notified customer " + customerId + " - Payment confirmed");
    }
}