package com.example.neurofleetbackkendD.config;





import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.repository.UserRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("✅ Database already initialized. Skipping data seeding.");
            return;
        }

        System.out.println("🌱 Initializing database with sample data...");

        // Create Users
        createUsers();

        // Create Vehicles
        createVehicles();

        // Create Sample Maintenance Records
        createMaintenanceRecords();

        System.out.println("✅ Database initialization completed successfully!");
    }

    private void createUsers() {
        List<User> users = Arrays.asList(
            // Admin
            createUser("admin", "admin123", "Administrator", "admin@neurofleetx.in", "9876543210", "ADMIN"),
            
            // Managers
            createUser("manager1", "manager123", "Rajesh Kumar", "rajesh.kumar@neurofleetx.in", "9823456789", "MANAGER"),
            createUser("manager2", "manager123", "Priya Sharma", "priya.sharma@neurofleetx.in", "9823456790", "MANAGER"),
            
            // Drivers
            createUser("driver1", "driver123", "Amit Patil", "amit.patil@neurofleetx.in", "9922100321", "DRIVER"),
            createUser("driver2", "driver123", "Suresh Deshmukh", "suresh.deshmukh@neurofleetx.in", "9922100654", "DRIVER"),
            createUser("driver3", "driver123", "Vijay Jadhav", "vijay.jadhav@neurofleetx.in", "9922100876", "DRIVER"),
            createUser("driver4", "driver123", "Ramesh Shinde", "ramesh.shinde@neurofleetx.in", "9922100987", "DRIVER"),
            
            // Customers
            createUser("customer1", "customer123", "Anil Mehta", "anil.mehta@neurofleetx.in", "9823500111", "CUSTOMER"),
            createUser("customer2", "customer123", "Sneha Kulkarni", "sneha.kulkarni@neurofleetx.in", "9823500222", "CUSTOMER"),
            createUser("customer3", "customer123", "Rahul Joshi", "rahul.joshi@neurofleetx.in", "9823500333", "CUSTOMER"),
            createUser("customer4", "customer123", "Pooja Desai", "pooja.desai@neurofleetx.in", "9823500444", "CUSTOMER")
        );

        userRepository.saveAll(users);
        System.out.println("👥 Created " + users.size() + " users");
    }

    private User createUser(String username, String password, String fullName, String email, String phone, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        user.setActive(true);
        return user;
    }

    private void createVehicles() {
        List<Vehicle> vehicles = Arrays.asList(
            // Electric Vehicles
            createVehicle("MH-12-AA-1010", "Tata Nexon EV", "Tata Motors", "SUV", 5, true, "AVAILABLE", 95, 0, 18.5209, 73.8567),
            createVehicle("MH-12-BB-2020", "MG ZS EV", "MG Motor", "SUV", 5, true, "AVAILABLE", 88, 0, 18.5314, 73.8446),
            createVehicle("MH-01-CC-3030", "Hyundai Kona Electric", "Hyundai", "SUV", 5, true, "IN_USE", 72, 0, 19.0760, 72.8777),
            
            // Sedans
            createVehicle("MH-14-DD-4040", "Honda City", "Honda", "SEDAN", 5, false, "AVAILABLE", 0, 85, 18.5196, 73.8553),
            createVehicle("MH-14-EE-5050", "Hyundai Verna", "Hyundai", "SEDAN", 5, false, "AVAILABLE", 0, 92, 18.5204, 73.8567),
            createVehicle("MH-02-FF-6060", "Maruti Ciaz", "Maruti Suzuki", "SEDAN", 5, false, "IN_USE", 0, 78, 19.0728, 72.8826),
            
            // SUVs
            createVehicle("MH-31-GG-7070", "Mahindra Scorpio", "Mahindra", "SUV", 7, false, "AVAILABLE", 0, 88, 19.8762, 75.3433),
            createVehicle("MH-31-HH-8080", "Toyota Fortuner", "Toyota", "SUV", 7, false, "MAINTENANCE", 0, 45, 19.8734, 75.3473),
            createVehicle("MH-05-II-9090", "Ford Endeavour", "Ford", "SUV", 7, false, "AVAILABLE", 0, 90, 18.5074, 73.8077),
            
            // Vans
            createVehicle("MH-12-JJ-1111", "Toyota Innova Crysta", "Toyota", "VAN", 8, false, "AVAILABLE", 0, 82, 18.5196, 73.8553),
            createVehicle("MH-14-KK-2222", "Maruti Ertiga", "Maruti Suzuki", "VAN", 7, false, "AVAILABLE", 0, 88, 18.5314, 73.8446),
            
            // Bikes
            createVehicle("MH-12-LL-3333", "Royal Enfield Classic 350", "Royal Enfield", "BIKE", 2, false, "AVAILABLE", 0, 95, 18.5209, 73.8567),
            createVehicle("MH-14-MM-4444", "Honda Activa 6G", "Honda", "BIKE", 2, false, "AVAILABLE", 0, 88, 18.5314, 73.8446),
            createVehicle("MH-01-NN-5555", "Bajaj Pulsar 150", "Bajaj", "BIKE", 2, false, "IN_USE", 0, 72, 19.0760, 72.8777)
        );

        vehicleRepository.saveAll(vehicles);
        System.out.println("🚗 Created " + vehicles.size() + " vehicles");
    }

    private Vehicle createVehicle(String number, String model, String manufacturer, String type, 
                                   int capacity, boolean isElectric, String status, 
                                   int battery, int fuel, double lat, double lon) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(number);
        vehicle.setModel(model);
        vehicle.setManufacturer(manufacturer);
        vehicle.setType(type);
        vehicle.setCapacity(capacity);
        vehicle.setIsElectric(isElectric);
        vehicle.setStatus(status);
        vehicle.setBatteryLevel(battery);
        vehicle.setFuelLevel(fuel);
        vehicle.setLatitude(lat);
        vehicle.setLongitude(lon);
        vehicle.setHealthScore(status.equals("MAINTENANCE") ? 55 : 90 + (int)(Math.random() * 10));
        vehicle.setMileage((int)(Math.random() * 10000));
        vehicle.setLastMaintenanceDate(LocalDateTime.now().minusDays(30));
        vehicle.setNextMaintenanceDate(LocalDateTime.now().plusDays(30));
        return vehicle;
    }

    private void createMaintenanceRecords() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        
        if (vehicles.isEmpty()) {
            return;
        }

        List<Maintenance> maintenanceRecords = Arrays.asList(
            createMaintenance(vehicles.get(0), "Oil Change", "Regular oil and filter change", 
                            "COMPLETED", "LOW", false, 1500.0, 1450.0),
            createMaintenance(vehicles.get(2), "Battery Check", "Electric battery health inspection", 
                            "IN_PROGRESS", "MEDIUM", false, 3000.0, null),
            createMaintenance(vehicles.get(7), "Engine Overhaul", "Complete engine service required", 
                            "PENDING", "CRITICAL", true, 8000.0, null),
            createMaintenance(vehicles.get(3), "Brake Service", "Brake pad replacement needed", 
                            "PENDING", "HIGH", true, 4500.0, null)
        );

        maintenanceRepository.saveAll(maintenanceRecords);
        System.out.println("🔧 Created " + maintenanceRecords.size() + " maintenance records");
    }

    private Maintenance createMaintenance(Vehicle vehicle, String issueType, String description, 
                                          String status, String priority, boolean isPredictive,
                                          Double estimatedCost, Double actualCost) {
        Maintenance maintenance = new Maintenance();
        maintenance.setVehicle(vehicle);
        maintenance.setIssueType(issueType);
        maintenance.setDescription(description);
        maintenance.setStatus(status);
        maintenance.setPriority(priority);
        maintenance.setIsPredictive(isPredictive);
        maintenance.setEstimatedCost(estimatedCost);
        maintenance.setActualCost(actualCost);
        
        if (isPredictive) {
            maintenance.setPredictedDate(LocalDateTime.now().plusDays(7));
            maintenance.setScheduledDate(LocalDateTime.now().plusDays(7));
        } else {
            maintenance.setScheduledDate(LocalDateTime.now().minusDays(3));
        }
        
        if ("COMPLETED".equals(status)) {
            maintenance.setCompletedDate(LocalDateTime.now().minusDays(1));
        }
        
        return maintenance;
    }
}
