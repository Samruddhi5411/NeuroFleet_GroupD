package com.example.neurofleetbackkendD.model.enums;


public enum BookingStatus {
    PENDING,           // Customer created, waiting for manager approval
    APPROVED,          //  Manager approved, waiting for driver assignment
    DRIVER_ASSIGNED,   // Manager assigned driver
    DRIVER_ACCEPTED,   // Driver accepted the booking
    CONFIRMED,         // Payment completed
    IN_PROGRESS,       // Trip started
    COMPLETED,         // Trip finished
    CANCELLED          // Booking cancelled
, DRIVER_REJECTED
}