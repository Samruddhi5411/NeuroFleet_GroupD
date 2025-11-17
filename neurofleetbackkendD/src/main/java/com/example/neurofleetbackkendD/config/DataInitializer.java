package com.example.neurofleetbackkendD.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;

import java.time.LocalDateTime;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("⚠️ Data already exists, skipping initialization");
            return;
        }
        
        System.out.println("🚀 Initializing NeuroFleetX Database...");
        
        // Create Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setEmail("admin@neurofleetx.com");
        admin.setPhone("+91-9876543210");
        admin.setRole(UserRole.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        
        // Create Managers
        for (int i = 1; i <= 3; i++) {
            User manager = new User();
            manager.setUsername("manager" + i);
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFullName("Fleet Manager " + i);
            manager.setEmail("manager" + i + "@neurofleetx.com");
            manager.setPhone("+91-98765432" + (10 + i));
            manager.setRole(UserRole.MANAGER);
            manager.setActive(true);
            userRepository.save(manager);
        }
        
        // Create Drivers (20 drivers)
        String[] driverNames = {
            "Rajesh Kumar", "Amit Singh", "Suresh Patel", "Vijay Sharma", 
            "Prakash Reddy", "Ramesh Yadav", "Ashok Verma", "Manoj Gupta",
            "Santosh Kumar", "Dinesh Singh", "Rakesh Joshi", "Anil Mehta",
            "Sanjay Desai", "Ravi Kapoor", "Mukesh Agarwal", "Deepak Nair",
            "Kiran Kumar", "Ganesh Rao", "Mahesh Iyer", "Sunil Menon"
        };
        
        for (int i = 1; i <= 20; i++) {
            User driver = new User();
            driver.setUsername("driver" + i);
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setFullName(driverNames[i-1]);
            driver.setEmail("driver" + i + "@neurofleetx.com");
            driver.setPhone("+91-" + (9000000000L + i));
            driver.setRole(UserRole.DRIVER);
            driver.setActive(true);
            userRepository.save(driver);
        }
        
        // Create Customers (15 customers)
        String[] customerNames = {
            "Priya Sharma", "Anita Desai", "Neha Patel", "Pooja Singh", "Kavita Reddy",
            "Sneha Gupta", "Divya Kumar", "Anjali Verma", "Ritu Agarwal", "Swati Joshi",
            "Meera Nair", "Lakshmi Iyer", "Geeta Menon", "Sunita Rao", "Rekha Kapoor"
        };
        
        for (int i = 1; i <= 15; i++) {
            User customer = new User();
            customer.setUsername("customer" + i);
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFullName(customerNames[i-1]);
            customer.setEmail("customer" + i + "@neurofleetx.com");
            customer.setPhone("+91-" + (8000000000L + i));
            customer.setRole(UserRole.CUSTOMER);
            customer.setActive(true);
            userRepository.save(customer);
        }
        
        // Create Vehicles from All Over India (50 vehicles)
        createVehiclesAllIndia();
        
        System.out.println("✅ Database initialization completed!");
        System.out.println("\n📝 Test Credentials:");
        System.out.println("================================");
        System.out.println("🔐 Admin:    admin / admin123");
        System.out.println("👨‍💼 Manager:  manager1 / manager123");
        System.out.println("🚗 Driver:   driver1 / driver123");
        System.out.println("👤 Customer: customer1 / customer123");
        System.out.println("================================\n");
        System.out.println("📊 Statistics:");
        System.out.println("   Total Users: " + userRepository.count());
        System.out.println("   Total Vehicles: " + vehicleRepository.count());
        System.out.println("   Drivers: 20");
        System.out.println("   Customers: 15");
        System.out.println("   Managers: 3");
    }
    
    private void createVehiclesAllIndia() {
        Random random = new Random();
        
        // Indian Cities with GPS Coordinates
        Object[][] cities = {
            // City, Latitude, Longitude
            {"Mumbai", 19.0760, 72.8777},
            {"Delhi", 28.7041, 77.1025},
            {"Bangalore", 12.9716, 77.5946},
            {"Hyderabad", 17.3850, 78.4867},
            {"Chennai", 13.0827, 80.2707},
            {"Kolkata", 22.5726, 88.3639},
            {"Pune", 18.5204, 73.8567},
            {"Ahmedabad", 23.0225, 72.5714},
            {"Jaipur", 26.9124, 75.7873},
            {"Lucknow", 26.8467, 80.9462},
            {"Chandigarh", 30.7333, 76.7794},
            {"Kochi", 9.9312, 76.2673},
            {"Indore", 22.7196, 75.8577},
            {"Nagpur", 21.1458, 79.0882},
            {"Surat", 21.1702, 72.8311},
            {"Bhopal", 23.2599, 77.4126},
            {"Coimbatore", 11.0168, 76.9558},
            {"Vadodara", 22.3072, 73.1812},
            {"Visakhapatnam", 17.6868, 83.2185},
            {"Thiruvananthapuram", 8.5241, 76.9366}
        };
        
        String[] manufacturers = {
            "Tata", "Mahindra", "Maruti Suzuki", "Hyundai", "Honda", 
            "Toyota", "Ford", "Volkswagen", "Renault", "Nissan"
        };
        
        String[][] modelsPerType = {
            // SEDAN models
            {"Dzire", "City", "Verna", "Ciaz", "Rapid"},
            // SUV models
            {"Creta", "Seltos", "XUV500", "Fortuner", "Scorpio"},
            // VAN models
            {"Innova", "Ertiga", "Marazzo", "Carnival", "Traveller"},
            // TRUCK models
            {"407", "407 Plus", "Eicher Pro", "Tata Ultra", "Ashok Leyland"},
            // BUS models
            {"Starbus", "Citybus", "Tourist Bus", "School Bus", "Express"},
            // BIKE models
            {"Royal Enfield", "Pulsar", "Apache", "FZ", "Duke"}
        };
        
        VehicleType[] types = VehicleType.values();
        
        int vehicleCounter = 1;
        
        for (Object[] city : cities) {
            String cityName = (String) city[0];
            Double baseLat = (Double) city[1];
            Double baseLon = (Double) city[2];
            
            // Create 2-3 vehicles per city
            int vehiclesInCity = 2 + random.nextInt(2);
            
            for (int i = 0; i < vehiclesInCity && vehicleCounter <= 50; i++) {
                Vehicle vehicle = new Vehicle();
                
                // Generate vehicle number in Indian format
                String stateCode = getStateCode(cityName);
                vehicle.setVehicleNumber(stateCode + "-" + 
                    String.format("%02d", random.nextInt(99) + 1) + "-" +
                    (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + "-" +
                    String.format("%04d", random.nextInt(9999) + 1));
                
                // Random type
                VehicleType type = types[random.nextInt(types.length)];
                vehicle.setType(type);
                
                // Manufacturer and Model
                vehicle.setManufacturer(manufacturers[random.nextInt(manufacturers.length)]);
                vehicle.setModel(modelsPerType[type.ordinal()][random.nextInt(5)]);
                
                // Capacity based on type
                switch (type) {
                    case SEDAN: vehicle.setCapacity(4 + random.nextInt(2)); break;
                    case SUV: vehicle.setCapacity(5 + random.nextInt(3)); break;
                    case VAN: vehicle.setCapacity(7 + random.nextInt(5)); break;
                    case TRUCK: vehicle.setCapacity(2); break;
                    case BUS: vehicle.setCapacity(30 + random.nextInt(20)); break;
                    case BIKE: vehicle.setCapacity(2); break;
                }
                
                // Electric vehicles (30% chance)
                vehicle.setIsElectric(random.nextDouble() < 0.3);
                
                // Status
                VehicleStatus[] statuses = VehicleStatus.values();
                vehicle.setStatus(statuses[random.nextInt(statuses.length)]);
                
                // GPS coordinates (slight variation from city center)
                vehicle.setLatitude(baseLat + (random.nextDouble() - 0.5) * 0.1);
                vehicle.setLongitude(baseLon + (random.nextDouble() - 0.5) * 0.1);
                
                // Battery and Fuel
                vehicle.setBatteryLevel(vehicle.getIsElectric() ? 
                    (70 + random.nextInt(31)) : 100);
                vehicle.setFuelLevel(!vehicle.getIsElectric() ? 
                    (60 + random.nextInt(41)) : 0);
                
                // Health and Mileage
                vehicle.setHealthScore(75 + random.nextInt(26));
                vehicle.setMileage(random.nextInt(100000));
                vehicle.setSpeed(vehicle.getStatus() == VehicleStatus.IN_USE ? 
                    (20.0 + random.nextDouble() * 60) : 0.0);
                
                vehicle.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(365)));
                vehicle.setLastUpdated(LocalDateTime.now());
                
                vehicleRepository.save(vehicle);
                vehicleCounter++;
            }
        }
    }
    
    private String getStateCode(String city) {
        switch (city) {
            case "Mumbai": case "Pune": return "MH"; // Maharashtra
            case "Delhi": return "DL"; // Delhi
            case "Bangalore": return "KA"; // Karnataka
            case "Hyderabad": return "TS"; // Telangana
            case "Chennai": case "Coimbatore": return "TN"; // Tamil Nadu
            case "Kolkata": return "WB"; // West Bengal
            case "Ahmedabad": case "Surat": case "Vadodara": return "GJ"; // Gujarat
            case "Jaipur": return "RJ"; // Rajasthan
            case "Lucknow": return "UP"; // Uttar Pradesh
            case "Chandigarh": return "CH"; // Chandigarh
            case "Kochi": case "Thiruvananthapuram": return "KL"; // Kerala
            case "Indore": case "Bhopal": return "MP"; // Madhya Pradesh
            case "Nagpur": return "MH"; // Maharashtra
            case "Visakhapatnam": return "AP"; // Andhra Pradesh
            default: return "XX";
        }
    }
}