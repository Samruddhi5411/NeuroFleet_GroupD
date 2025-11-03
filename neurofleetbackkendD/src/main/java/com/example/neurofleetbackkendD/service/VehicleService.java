package com.example.neurofleetbackkendD.service;



import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;



@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public List<Vehicle> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status);
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        vehicle.setVehicleNumber(vehicleDetails.getVehicleNumber());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setManufacturer(vehicleDetails.getManufacturer());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setCapacity(vehicleDetails.getCapacity());
        vehicle.setIsElectric(vehicleDetails.getIsElectric());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setBatteryLevel(vehicleDetails.getBatteryLevel());
        vehicle.setFuelLevel(vehicleDetails.getFuelLevel());
        vehicle.setLatitude(vehicleDetails.getLatitude());
        vehicle.setLongitude(vehicleDetails.getLongitude());
        
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public Vehicle updateTelemetry(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        Random random = new Random();
        
        // Simulate telemetry changes
        if (vehicle.getIsElectric()) {
            vehicle.setBatteryLevel(Math.max(0, vehicle.getBatteryLevel() - random.nextInt(5)));
        } else {
            vehicle.setFuelLevel(Math.max(0, vehicle.getFuelLevel() - random.nextInt(5)));
        }
        
        vehicle.setLatitude(vehicle.getLatitude() + (random.nextDouble() - 0.5) * 0.01);
        vehicle.setLongitude(vehicle.getLongitude() + (random.nextDouble() - 0.5) * 0.01);
        vehicle.setSpeed((double) random.nextInt(100));
        vehicle.setHealthScore(Math.max(60, 100.0 - random.nextInt(40)));
        vehicle.setKmsSinceService(vehicle.getKmsSinceService() + random.nextInt(10));
        
        return vehicleRepository.save(vehicle);
    }
}
