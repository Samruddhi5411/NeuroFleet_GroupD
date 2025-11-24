//package com.example.neurofleetbackkendD.dto;
//
//import com.example.neurofleetbackkendD.model.enums.TripStatus;
//import java.time.LocalDateTime;
//
//public class TripDTO {
//    private Long id;
//    private Long bookingId;
//    private Long driverId;
//    private String driverName;
//    private Long customerId;
//    private String customerName;
//    private Long vehicleId;
//    private String vehicleModel;
//    private String vehicleNumber;
//    
//    private TripStatus status;
//    
//    private String pickupLocation;
//    private String dropoffLocation;
//    private Double currentLatitude;
//    private Double currentLongitude;
//    private Double currentSpeed;
//    
//    private Double distanceTraveled;
//    private Integer estimatedDuration;
//    private Integer actualDuration;
//    
//    private LocalDateTime scheduledStartTime;
//    private LocalDateTime actualStartTime;
//    private LocalDateTime actualEndTime;
//    
//    private Double tripFare;
//    private Double driverEarnings;
//    
//    private Integer customerRating;
//    private String customerFeedback;
//    
//    // Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//    
//    public Long getBookingId() { return bookingId; }
//    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
//    
//    public Long getDriverId() { return driverId; }
//    public void setDriverId(Long driverId) { this.driverId = driverId; }
//    
//    public String getDriverName() { return driverName; }
//    public void setDriverName(String driverName) { this.driverName = driverName; }
//    
//    public Long getCustomerId() { return customerId; }
//    public void setCustomerId(Long customerId) { this.customerId = customerId; }
//    
//    public String getCustomerName() { return customerName; }
//    public void setCustomerName(String customerName) { this.customerName = customerName; }
//    
//    public Long getVehicleId() { return vehicleId; }
//    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
//    
//    public String getVehicleModel() { return vehicleModel; }
//    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
//    
//    public String getVehicleNumber() { return vehicleNumber; }
//    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
//    
//    public TripStatus getStatus() { return status; }
//    public void setStatus(TripStatus status) { this.status = status; }
//    
//    public String getPickupLocation() { return pickupLocation; }
//    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
//    
//    public String getDropoffLocation() { return dropoffLocation; }
//    public void setDropoffLocation(String dropoffLocation) { this.dropoffLocation = dropoffLocation; }
//    
//    public Double getCurrentLatitude() { return currentLatitude; }
//    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }
//    
//    public Double getCurrentLongitude() { return currentLongitude; }
//    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }
//    
//    public Double getCurrentSpeed() { return currentSpeed; }
//    public void setCurrentSpeed(Double currentSpeed) { this.currentSpeed = currentSpeed; }
//    
//    public Double getDistanceTraveled() { return distanceTraveled; }
//    public void setDistanceTraveled(Double distanceTraveled) { this.distanceTraveled = distanceTraveled; }
//    
//    public Integer getEstimatedDuration() { return estimatedDuration; }
//    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
//    
//    public Integer getActualDuration() { return actualDuration; }
//    public void setActualDuration(Integer actualDuration) { this.actualDuration = actualDuration; }
//    
//    public LocalDateTime getScheduledStartTime() { return scheduledStartTime; }
//    public void setScheduledStartTime(LocalDateTime scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }
//    
//    public LocalDateTime getActualStartTime() { return actualStartTime; }
//    public void setActualStartTime(LocalDateTime actualStartTime) { this.actualStartTime = actualStartTime; }
//    
//    public LocalDateTime getActualEndTime() { return actualEndTime; }
//    public void setActualEndTime(LocalDateTime actualEndTime) { this.actualEndTime = actualEndTime; }
//    
//    public Double getTripFare() { return tripFare; }
//    public void setTripFare(Double tripFare) { this.tripFare = tripFare; }
//    
//    public Double getDriverEarnings() { return driverEarnings; }
//    public void setDriverEarnings(Double driverEarnings) { this.driverEarnings = driverEarnings; }
//    
//    public Integer getCustomerRating() { return customerRating; }
//    public void setCustomerRating(Integer customerRating) { this.customerRating = customerRating; }
//    
//    public String getCustomerFeedback() { return customerFeedback; }
//    public void setCustomerFeedback(String customerFeedback) { this.customerFeedback = customerFeedback; }
//}