package com.example.neurofleetbackkendD.service;


import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }
    
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }
    
    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setCreatedAt(LocalDateTime.now());
        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }
    
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setManufacturer(vehicleDetails.getManufacturer());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setCapacity(vehicleDetails.getCapacity());
        vehicle.setIsElectric(vehicleDetails.getIsElectric());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setLatitude(vehicleDetails.getLatitude());
        vehicle.setLongitude(vehicleDetails.getLongitude());
        vehicle.setBatteryLevel(vehicleDetails.getBatteryLevel());
        vehicle.setFuelLevel(vehicleDetails.getFuelLevel());
        vehicle.setHealthScore(vehicleDetails.getHealthScore());
        vehicle.setMileage(vehicleDetails.getMileage());
        vehicle.setLastUpdated(LocalDateTime.now());
        
        return vehicleRepository.save(vehicle);
    }
    
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
