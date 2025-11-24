package com.example.neurofleetbackkendD.dto;

import java.util.List;
import java.util.Map;

public class DashboardDTO {
    private int totalFleet;
    private int vehiclesAvailable;
    private int vehiclesInUse;
    private int vehiclesMaintenance;
    private int activeTrips;
    private int totalBookings;
    private int pendingBookings;
    private int completedToday;
    private int totalDrivers;
    private int totalManagers;
    private int totalCustomers;
    private List<MaintenanceDTO> maintenanceSchedule;
    private Map<String, Object> hourlyActivity;

    // Getters and Setters
    public int getTotalFleet() { return totalFleet; }
    public void setTotalFleet(int totalFleet) { this.totalFleet = totalFleet; }

    public int getVehiclesAvailable() { return vehiclesAvailable; }
    public void setVehiclesAvailable(int vehiclesAvailable) { this.vehiclesAvailable = vehiclesAvailable; }

    public int getVehiclesInUse() { return vehiclesInUse; }
    public void setVehiclesInUse(int vehiclesInUse) { this.vehiclesInUse = vehiclesInUse; }

    public int getVehiclesMaintenance() { return vehiclesMaintenance; }
    public void setVehiclesMaintenance(int vehiclesMaintenance) { this.vehiclesMaintenance = vehiclesMaintenance; }

    public int getActiveTrips() { return activeTrips; }
    public void setActiveTrips(int activeTrips) { this.activeTrips = activeTrips; }

    public int getTotalBookings() { return totalBookings; }
    public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

    public int getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(int pendingBookings) { this.pendingBookings = pendingBookings; }

    public int getCompletedToday() { return completedToday; }
    public void setCompletedToday(int completedToday) { this.completedToday = completedToday; }

    public int getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(int totalDrivers) { this.totalDrivers = totalDrivers; }

    public int getTotalManagers() { return totalManagers; }
    public void setTotalManagers(int totalManagers) { this.totalManagers = totalManagers; }

    public int getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(int totalCustomers) { this.totalCustomers = totalCustomers; }

    public List<MaintenanceDTO> getMaintenanceSchedule() { return maintenanceSchedule; }
    public void setMaintenanceSchedule(List<MaintenanceDTO> maintenanceSchedule) { this.maintenanceSchedule = maintenanceSchedule; }

    public Map<String, Object> getHourlyActivity() { return hourlyActivity; }
    public void setHourlyActivity(Map<String, Object> hourlyActivity) { this.hourlyActivity = hourlyActivity; }
}
