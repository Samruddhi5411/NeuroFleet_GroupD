package com.example.neurofleetbackkendD.model.enums;

public enum PaymentStatus {
    PENDING_APPROVAL,  // Waiting for manager approval
    APPROVED,          // Manager approved, waiting for payment
    PAYMENT_PENDING,   // Same as APPROVED
    CONFIRMED,         // Payment completed
    IN_PROGRESS,       // Trip started
    COMPLETED,         // Trip finished
    CANCELLED,         // Booking cancelled
    REJECTED          // Manager rejected
, PENDING
}