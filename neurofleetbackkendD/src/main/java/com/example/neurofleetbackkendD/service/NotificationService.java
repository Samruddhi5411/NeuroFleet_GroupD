package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
public class NotificationService {
    
    private static final DateTimeFormatter formatter = 
        DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
    
    // Booking notifications
    public void notifyBookingCreated(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Booking #%d created successfully. Status: PENDING. " +
            "Waiting for manager approval.",
            booking.getId()
        );
        System.out.println(message);
        // In production: send actual email/SMS
    }
    
    public void notifyBookingApproved(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Your booking #%d has been approved! " +
            "Driver %s has been assigned. Vehicle: %s",
            booking.getId(),
            booking.getDriver().getFullName(),
            booking.getVehicle().getVehicleNumber()
        );
        System.out.println(message);
        
        String driverMessage = String.format(
            "📧 [DRIVER] New booking assigned! Booking #%d. " +
            "Pickup: %s. Please accept or reject.",
            booking.getId(),
            booking.getPickupLocation()
        );
        System.out.println(driverMessage);
    }
    
    public void notifyDriverAccepted(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Driver %s has accepted your booking! " +
            "Please proceed with payment. Amount: ₹%.2f",
            booking.getDriver().getFullName(),
            booking.getTotalPrice()
        );
        System.out.println(message);
    }
    
    public void notifyPaymentReceived(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Payment received! Transaction ID: %s. " +
            "Your booking is confirmed. Driver will start trip soon.",
            booking.getTransactionId()
        );
        System.out.println(message);
        
        String driverMessage = String.format(
            "📧 [DRIVER] Payment confirmed for Booking #%d. " +
            "You can now start the trip.",
            booking.getId()
        );
        System.out.println(driverMessage);
    }
    
    public void notifyTripStarted(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Your trip has started! " +
            "Driver: %s. Estimated arrival: %s",
            booking.getDriver().getFullName(),
            booking.getEndTime() != null ? booking.getEndTime().format(formatter) : "TBD"
        );
        System.out.println(message);
    }
    
    public void notifyTripCompleted(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Trip completed! Thank you for using NeuroFleetX. " +
            "Total: ₹%.2f. Please rate your experience.",
            booking.getTotalPrice()
        );
        System.out.println(message);
    }
    
    public void notifyBookingCancelled(Booking booking) {
        String message = String.format(
            "📧 [CUSTOMER] Booking #%d has been cancelled. " +
            "Refund will be processed within 5-7 business days.",
            booking.getId()
        );
        System.out.println(message);
        
        if (booking.getDriver() != null) {
            String driverMessage = String.format(
                "📧 [DRIVER] Booking #%d has been cancelled by customer.",
                booking.getId()
            );
            System.out.println(driverMessage);
        }
    }
    
    // Maintenance notifications
    public void notifyMaintenanceAlert(MaintenanceRecord record) {
        String message = String.format(
            "🔧 [MAINTENANCE] ALERT! Vehicle %s requires maintenance. " +
            "Priority: %s. Risk Score: %d",
            record.getVehicle().getVehicleNumber(),
            record.getPriority(),
            record.getRiskScore()
        );
        System.out.println(message);
    }
}