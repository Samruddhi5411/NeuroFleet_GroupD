package com.example.neurofleetbackkendD.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private MaintenanceRepository maintenanceRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private Random random = new Random();
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("⚠️ Data already exists, skipping initialization");
            return;
        }
        
        System.out.println("🚀 Initializing NeuroFleetX Database...");
        
        // Create Users: 1 Admin, 1 Manager, 5 Drivers, 5 Customers
        createUsers();
        
        // Create 50 Vehicles across India
        createVehiclesAllIndia();
        
        // Create sample Bookings and Maintenance
        createBookingsAndMaintenance();
        
        System.out.println("✅ Database initialization completed!");
        printSummary();
    }
    
    private void createUsers() {
        System.out.println("👥 Creating users...");
        
        // 1 Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setEmail("admin@neurofleetx.com");
        admin.setPhoneNumber("+91-9876543210");
        admin.setRole(UserRole.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        System.out.println("✅ Admin created: admin / admin123");
        
        // 1 Manager
        User manager = new User();
        manager.setUsername("manager1");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setFullName("Fleet Manager");
        manager.setEmail("manager@neurofleetx.com");
        manager.setPhoneNumber("+91-9876543211");
        manager.setRole(UserRole.MANAGER);
        manager.setActive(true);
        userRepository.save(manager);
        System.out.println("✅ Manager created: manager1 / manager123");
        
        // 5 Drivers
        String[] driverNames = {
            "Rajesh Kumar", "Amit Singh", "Suresh Patel", "Vijay Sharma", "Prakash Reddy"
        };
        
        for (int i = 1; i <= 5; i++) {
            User driver = new User();
            driver.setUsername("driver" + i);
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setFullName(driverNames[i-1]);
            driver.setEmail("driver" + i + "@neurofleetx.com");
            driver.setPhoneNumber("+91-900000000" + i);
            driver.setRole(UserRole.DRIVER);
            driver.setActive(true);
            driver.setLicenseNumber("DL-" + (1000 + i));
            driver.setRating(4.0 + random.nextDouble()); // 4.0-5.0
            driver.setTotalTrips(0);
            driver.setTotalEarnings(0.0);
            userRepository.save(driver);
        }
        System.out.println("✅ Created 5 drivers: driver1-driver5 / driver123");
        
        // 5 Customers
        String[] customerNames = {
            "Priya Sharma", "Anita Desai", "Neha Patel", "Pooja Singh", "Kavita Reddy"
        };
        
        for (int i = 1; i <= 5; i++) {
            User customer = new User();
            customer.setUsername("customer" + i);
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFullName(customerNames[i-1]);
            customer.setEmail("customer" + i + "@neurofleetx.com");
            customer.setPhoneNumber("+91-800000000" + i);
            customer.setRole(UserRole.CUSTOMER);
            customer.setActive(true);
            userRepository.save(customer);
        }
        System.out.println("✅ Created 5 customers: customer1-customer5 / customer123");
    }
    
    private void createVehiclesAllIndia() {
        System.out.println("🚗 Creating 50 vehicles across India...");
        
        // Indian Cities with GPS Coordinates
        Object[][] cities = {
            {"Mumbai", 19.0760, 72.8777, "MH"},
            {"Delhi", 28.7041, 77.1025, "DL"},
            {"Bangalore", 12.9716, 77.5946, "KA"},
            {"Hyderabad", 17.3850, 78.4867, "TS"},
            {"Chennai", 13.0827, 80.2707, "TN"},
            {"Kolkata", 22.5726, 88.3639, "WB"},
            {"Pune", 18.5204, 73.8567, "MH"},
            {"Ahmedabad", 23.0225, 72.5714, "GJ"},
            {"Jaipur", 26.9124, 75.7873, "RJ"},
            {"Lucknow", 26.8467, 80.9462, "UP"}
        };
        
        String[] manufacturers = {"Tata", "Mahindra", "Maruti", "Hyundai", "Honda"};
        String[] sedanModels = {"Dzire", "City", "Verna", "Ciaz", "Rapid"};
        String[] suvModels = {"Creta", "Seltos", "XUV500", "Fortuner", "Scorpio"};
        String[] vanModels = {"Innova", "Ertiga", "Marazzo", "Carnival", "Traveller"};
        
        VehicleType[] types = VehicleType.values();
        VehicleStatus[] statuses = {
            VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE,
            VehicleStatus.IN_USE, VehicleStatus.MAINTENANCE
        };
        
        int vehicleCounter = 1;
        
        for (Object[] city : cities) {
            String cityName = (String) city[0];
            Double baseLat = (Double) city[1];
            Double baseLon = (Double) city[2];
            String stateCode = (String) city[3];
            
            // Create 5 vehicles per city
            for (int i = 0; i < 5 && vehicleCounter <= 50; i++) {
                Vehicle vehicle = new Vehicle();
                
                // Vehicle Number: MH-12-AB-1234
                vehicle.setVehicleNumber(stateCode + "-" + 
                    String.format("%02d", random.nextInt(99) + 1) + "-" +
                    (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + "-" +
                    String.format("%04d", random.nextInt(9999) + 1));
                
                VehicleType type = types[vehicleCounter % types.length];
                vehicle.setType(type);
                
                vehicle.setManufacturer(manufacturers[random.nextInt(manufacturers.length)]);
                
                // Set model based on type
                if (type == VehicleType.SEDAN) {
                    vehicle.setModel(sedanModels[random.nextInt(sedanModels.length)]);
                    vehicle.setCapacity(4);
                } else if (type == VehicleType.SUV) {
                    vehicle.setModel(suvModels[random.nextInt(suvModels.length)]);
                    vehicle.setCapacity(7);
                } else if (type == VehicleType.VAN) {
                    vehicle.setModel(vanModels[random.nextInt(vanModels.length)]);
                    vehicle.setCapacity(8);
                } else if (type == VehicleType.TRUCK) {
                    vehicle.setModel("Truck " + vehicleCounter);
                    vehicle.setCapacity(2);
                } else if (type == VehicleType.BUS) {
                    vehicle.setModel("Bus " + vehicleCounter);
                    vehicle.setCapacity(40);
                } else { // BIKE
                    vehicle.setModel("Bike " + vehicleCounter);
                    vehicle.setCapacity(2);
                }
                
                vehicle.setIsElectric(random.nextDouble() < 0.3); // 30% electric
                vehicle.setStatus(statuses[random.nextInt(statuses.length)]);
                
                // GPS coordinates near city center
                vehicle.setLatitude(baseLat + (random.nextDouble() - 0.5) * 0.1);
                vehicle.setLongitude(baseLon + (random.nextDouble() - 0.5) * 0.1);
                
                vehicle.setBatteryLevel(vehicle.getIsElectric() ? (70 + random.nextInt(31)) : 100);
                vehicle.setFuelLevel(!vehicle.getIsElectric() ? (60 + random.nextInt(41)) : 0);
                
                vehicle.setHealthScore(75 + random.nextInt(26)); // 75-100
                vehicle.setMileage(random.nextInt(100000));
                vehicle.setSpeed(vehicle.getStatus() == VehicleStatus.IN_USE ? 
                    (20.0 + random.nextDouble() * 60) : 0.0);
                
                vehicle.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(365)));
                vehicle.setLastUpdated(LocalDateTime.now());
                
                vehicleRepository.save(vehicle);
                vehicleCounter++;
            }
        }
        
        System.out.println("✅ Created 50 vehicles");
    }
    
    private void createBookingsAndMaintenance() {
        System.out.println("📝 Creating sample bookings and maintenance...");
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<User> customers = userRepository.findByRole(UserRole.CUSTOMER);
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        User manager = userRepository.findByRole(UserRole.MANAGER).get(0);
        
        String[] cities = {"Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"};
        
        // Create 20 bookings
        for (int i = 0; i < 20; i++) {
            Booking booking = new Booking();
            booking.setCustomer(customers.get(random.nextInt(customers.size())));
            booking.setVehicle(vehicles.get(random.nextInt(vehicles.size())));
            booking.setDriver(drivers.get(random.nextInt(drivers.size())));
            booking.setApprovedByManager(manager);
            
            LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(30));
            booking.setCreatedAt(createdAt);
            booking.setStartTime(createdAt.plusHours(random.nextInt(24)));
            booking.setEndTime(booking.getStartTime().plusHours(2 + random.nextInt(6)));
            
            String pickup = cities[random.nextInt(cities.length)];
            String dropoff = cities[random.nextInt(cities.length)];
            booking.setPickupLocation(pickup + " Station");
            booking.setDropoffLocation(dropoff + " Airport");
            
            booking.setTotalPrice(500.0 + random.nextDouble() * 2000.0);
            
            BookingStatus[] statuses = {
                BookingStatus.PENDING, BookingStatus.CONFIRMED, 
                BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED
            };
            booking.setStatus(statuses[random.nextInt(statuses.length)]);
            
            if (booking.getStatus() == BookingStatus.COMPLETED) {
                booking.setPaymentStatus(PaymentStatus.PAID);
            } else {
                booking.setPaymentStatus(PaymentStatus.UNPAID);
            }
            
            bookingRepository.save(booking);
        }
        
        System.out.println("✅ Created 20 bookings");
    }
    
    private void printSummary() {
        System.out.println("\n" + "=".repeat(50));
        System.out.println("📝 TEST CREDENTIALS");
        System.out.println("=".repeat(50));
        System.out.println("🔐 Admin:    admin / admin123");
        System.out.println("👨‍💼 Manager:  manager1 / manager123");
        System.out.println("🚗 Driver:   driver1 / driver123 (driver1-driver5)");
        System.out.println("👤 Customer: customer1 / customer123 (customer1-customer5)");
        System.out.println("=".repeat(50));
        System.out.println("\n📊 DATABASE STATISTICS:");
        System.out.println("   👥 Total Users: " + userRepository.count());
        System.out.println("      - Admins: 1");
        System.out.println("      - Managers: 1");
        System.out.println("      - Drivers: 5");
        System.out.println("      - Customers: 5");
        System.out.println("   🚗 Total Vehicles: " + vehicleRepository.count());
        System.out.println("   📋 Total Bookings: " + bookingRepository.count());
        System.out.println("=".repeat(50) + "\n");
    }
}