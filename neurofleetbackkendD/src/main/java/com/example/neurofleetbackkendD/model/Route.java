package com.example.neurofleetbackkendD.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.neurofleetbackkendD.model.enums.RouteStatus;
import com.example.neurofleetbackkendD.model.enums.TrafficLevel;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    private String routeId;
    private String startLocation;
    private String endLocation;
    
    private Double startLatitude;
    private Double startLongitude;
    private Double endLatitude;
    private Double endLongitude;
    
    private Double distanceKm;
    private Integer etaMinutes;
    
    @Enumerated(EnumType.STRING)
    private TrafficLevel trafficLevel = TrafficLevel.MEDIUM;
    
    private String optimizationType;
    
    private Double energyCost;
    
    @Column(length = 5000)
    private String optimizedPath;
    
    @Enumerated(EnumType.STRING)
    private RouteStatus status = RouteStatus.PLANNED;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    // All Getters and Setters with proper types
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    
    public String getRouteId() { return routeId; }
    public void setRouteId(String routeId) { this.routeId = routeId; }
    
    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
    
    public String getEndLocation() { return endLocation; }
    public void setEndLocation(String endLocation) { this.endLocation = endLocation; }
    
    public Double getStartLatitude() { return startLatitude; }
    public void setStartLatitude(Double startLatitude) { this.startLatitude = startLatitude; }
    
    public Double getStartLongitude() { return startLongitude; }
    public void setStartLongitude(Double startLongitude) { this.startLongitude = startLongitude; }
    
    public Double getEndLatitude() { return endLatitude; }
    public void setEndLatitude(Double endLatitude) { this.endLatitude = endLatitude; }
    
    public Double getEndLongitude() { return endLongitude; }
    public void setEndLongitude(Double endLongitude) { this.endLongitude = endLongitude; }
    
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    
    public Integer getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(Integer etaMinutes) { this.etaMinutes = etaMinutes; }
    
    public TrafficLevel getTrafficLevel() { return trafficLevel; }
    public void setTrafficLevel(TrafficLevel trafficLevel) { this.trafficLevel = trafficLevel; }
    
    public String getOptimizationType() { return optimizationType; }
    public void setOptimizationType(String optimizationType) { this.optimizationType = optimizationType; }
    
    public Double getEnergyCost() { return energyCost; }
    public void setEnergyCost(Double energyCost) { this.energyCost = energyCost; }
    
    public String getOptimizedPath() { return optimizedPath; }
    public void setOptimizedPath(String optimizedPath) { this.optimizedPath = optimizedPath; }
    
    public RouteStatus getStatus() { return status; }
    public void setStatus(RouteStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
