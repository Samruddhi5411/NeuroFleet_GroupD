package com.example.neurofleetbackkendD.config;





import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.Vehicle;
import com.example.neurofleetbackkendD.model.enums.MaintenanceStatus;
import com.example.neurofleetbackkendD.model.enums.MaintenanceType;
import com.example.neurofleetbackkendD.model.enums.Priority;
import com.example.neurofleetbackkendD.model.enums.UserRole;
import com.example.neurofleetbackkendD.model.enums.VehicleStatus;
import com.example.neurofleetbackkendD.model.enums.VehicleType;
import com.example.neurofleetbackkendD.model.Maintenance;
import com.example.neurofleetbackkendD.repository.UserRepository;
import com.example.neurofleetbackkendD.repository.VehicleRepository;
import com.example.neurofleetbackkendD.repository.BookingRepository;
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
        // Skip if data already exists
        if (userRepository.count() > 0) {
            System.out.println("✅ Data already exists. Skipping initialization.");
            return;
        }

        System.out.println("🚀 Creating sample data...");
        
        createUsers();
        createVehicles();
        createMaintenance();
        
        System.out.println("✅ Sample data created successfully!");
    }

    private void createUsers() {
        // Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("Administrator");
        admin.setEmail("admin@neurofleet.com");
        admin.setPhone("+91-9876543210");
        admin.setRole(UserRole.ADMIN);
        userRepository.save(admin);
        
        // Manager
        User manager = new User();
        manager.setUsername("manager");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setFullName("Rajesh Kumar");
        manager.setEmail("manager@neurofleet.com");
        manager.setPhone("+91-9876543211");
        manager.setRole(UserRole.MANAGER);
        userRepository.save(manager);
        
        // Drivers (Indian names)
        String[] driverNames = {"Amit Sharma", "Vikram Singh", "Rohan Patel", "Arjun Verma", "Sunil Yadav"};
        for (int i = 0; i < driverNames.length; i++) {
            User driver = new User();
            driver.setUsername("driver" + (i + 1));
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setFullName(driverNames[i]);
            driver.setEmail("driver" + (i + 1) + "@neurofleet.com");
            driver.setPhone("+91-987654321" + i);
            driver.setRole(UserRole.DRIVER);
            driver.setLicenseNumber("MH-12-2020-" + (100000 + i));
            driver.setLicenseExpiry(LocalDateTime.now().plusYears(5));
            driver.setIsAvailable(true);
            userRepository.save(driver);
        }
        
        // Customers (Indian names)
        String[] customerNames = {"Priya Desai", "Sneha Mehta", "Anjali Joshi", "Kavita Reddy", "Deepak Shah"};
        for (int i = 0; i < customerNames.length; i++) {
            User customer = new User();
            customer.setUsername("customer" + (i + 1));
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFullName(customerNames[i]);
            customer.setEmail("customer" + (i + 1) + "@example.com");
            customer.setPhone("+91-987654322" + i);
            customer.setRole(UserRole.CUSTOMER);
            userRepository.save(customer);
        }
        
        System.out.println("✅ Created " + userRepository.count() + " users");
    }

    private void createVehicles() {
        // Vehicle 1 - Mumbai
        Vehicle v1 = new Vehicle();
        v1.setVehicleNumber("MH-01-AB-1000");
        v1.setModel("Maruti Swift");
        v1.setManufacturer("Maruti Suzuki");
        v1.setType(VehicleType.SEDAN);
        v1.setCapacity(5);
        v1.setIsElectric(false);
        v1.setStatus(VehicleStatus.AVAILABLE);
        v1.setFuelLevel(75.0);
        v1.setLatitude(19.0760); // Mumbai
        v1.setLongitude(72.8777);
        v1.setSpeed(0.0);
        v1.setMileage(25000);
        v1.setHealthScore(92.0);
        v1.setKmsSinceService(2000);
        vehicleRepository.save(v1);
        
        // Vehicle 2 - Delhi
        Vehicle v2 = new Vehicle();
        v2.setVehicleNumber("DL-02-CD-2000");
        v2.setModel("Hyundai Creta");
        v2.setManufacturer("Hyundai");
        v2.setType(VehicleType.SUV);
        v2.setCapacity(7);
        v2.setIsElectric(false);
        v2.setStatus(VehicleStatus.AVAILABLE);
        v2.setFuelLevel(80.0);
        v2.setLatitude(28.7041); // Delhi
        v2.setLongitude(77.1025);
        v2.setSpeed(0.0);
        v2.setMileage(30000);
        v2.setHealthScore(88.0);
        v2.setKmsSinceService(3000);
        vehicleRepository.save(v2);
        
        // Vehicle 3 - Bangalore (Electric)
        Vehicle v3 = new Vehicle();
        v3.setVehicleNumber("KA-12-EF-3000");
        v3.setModel("Tata Nexon EV");
        v3.setManufacturer("Tata Motors");
        v3.setType(VehicleType.SUV);
        v3.setCapacity(5);
        v3.setIsElectric(true);
        v3.setStatus(VehicleStatus.AVAILABLE);
        v3.setBatteryLevel(95.0);
        v3.setLatitude(12.9716); // Bangalore
        v3.setLongitude(77.5946);
        v3.setSpeed(0.0);
        v3.setMileage(15000);
        v3.setHealthScore(98.0);
        v3.setKmsSinceService(1000);
        vehicleRepository.save(v3);
        
        // Vehicle 4 - Pune
        Vehicle v4 = new Vehicle();
        v4.setVehicleNumber("MH-14-GH-4000");
        v4.setModel("Toyota Fortuner");
        v4.setManufacturer("Toyota");
        v4.setType(VehicleType.SUV);
        v4.setCapacity(7);
        v4.setIsElectric(false);
        v4.setStatus(VehicleStatus.IN_USE);
        v4.setFuelLevel(60.0);
        v4.setLatitude(18.5204); // Pune
        v4.setLongitude(73.8567);
        v4.setSpeed(45.0);
        v4.setMileage(50000);
        v4.setHealthScore(85.0);
        v4.setKmsSinceService(4500);
        vehicleRepository.save(v4);
        
        // Vehicle 5 - Chennai
        Vehicle v5 = new Vehicle();
        v5.setVehicleNumber("TN-43-KL-5000");
        v5.setModel("Honda City");
        v5.setManufacturer("Honda");
        v5.setType(VehicleType.SEDAN);
        v5.setCapacity(5);
        v5.setIsElectric(false);
        v5.setStatus(VehicleStatus.MAINTENANCE);
        v5.setFuelLevel(30.0);
        v5.setLatitude(13.0827); // Chennai
        v5.setLongitude(80.2707);
        v5.setSpeed(0.0);
        v5.setMileage(60000);
        v5.setHealthScore(65.0);
        v5.setKmsSinceService(6000);
        vehicleRepository.save(v5);
        
        System.out.println("✅ Created " + vehicleRepository.count() + " vehicles");
    }
    private void createMaintenance() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        if (vehicles.isEmpty()) return;
        
        // Maintenance 1
        Maintenance m1 = new Maintenance();
        m1.setVehicle(vehicles.get(0));
        m1.setIssueType(MaintenanceType.OIL_CHANGE);
        m1.setDescription("Routine oil change required");
        m1.setStatus(MaintenanceStatus.PENDING);
        m1.setPriority(Priority.MEDIUM);
        m1.setIsPredictive(true);
        m1.setPredictedDaysToFailure(15);
        m1.setScheduledDate(LocalDateTime.now().plusDays(10));
        m1.setEstimatedCost(2000.0);
        maintenanceRepository.save(m1);
        
        // Maintenance 2
        Maintenance m2 = new Maintenance();
        m2.setVehicle(vehicles.get(4));
        m2.setIssueType(MaintenanceType.ENGINE);
        m2.setDescription("Engine diagnostic required");
        m2.setStatus(MaintenanceStatus.IN_PROGRESS);
        m2.setPriority(Priority.HIGH);
        m2.setIsPredictive(true);
        m2.setPredictedDaysToFailure(5);
        m2.setScheduledDate(LocalDateTime.now().plusDays(2));
        m2.setEstimatedCost(8000.0);
        maintenanceRepository.save(m2);
        
        System.out.println("✅ Created " + maintenanceRepository.count() + " maintenance records");
    }
}