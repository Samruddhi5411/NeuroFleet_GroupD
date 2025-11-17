package com.example.neurofleetbackkendD.model.enums;


public enum BookingStatus {
    PENDING,           // Customer created
    MANAGER_APPROVED,  // Manager approved
    DRIVER_ASSIGNED,   // Driver assigned by manager
    DRIVER_ACCEPTED,   // Driver accepted
    PAYMENT_PENDING,   // Waiting for payment
    CONFIRMED,         // Payment done
    IN_PROGRESS,       // Trip started
    COMPLETED,         // Trip finished
    CANCELLED
}