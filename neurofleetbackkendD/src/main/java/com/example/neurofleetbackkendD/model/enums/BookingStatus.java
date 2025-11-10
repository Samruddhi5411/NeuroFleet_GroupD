package com.example.neurofleetbackkendD.model.enums;

public enum BookingStatus {
    PENDING_APPROVAL,  // Customer booked, waiting for manager approval
    APPROVED,          // Manager approved, waiting for payment
    PAYMENT_PENDING,   // Same as APPROVED
    CONFIRMED,         // Payment completed, ready to start
    IN_PROGRESS,       // Trip started
    COMPLETED,         // Trip finished
    CANCELLED,         // Booking cancelled by customer/manager
    REJECTED          // Manager rejected the booking
}