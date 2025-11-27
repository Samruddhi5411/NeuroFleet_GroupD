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
        if (userRepository.count() > 0) {
            System.out.println("⚠️ Data already exists, skipping initialization");
            return;
        }
        
        System.out.println("🚀 Initializing NeuroFleetX Database with REAL DATA...");
        
        createUsers();
        createVehiclesAcrossIndia();
        createRealBookings();
        createMaintenanceRecords();
        
        System.out.println("✅ Database initialization completed!");
        printSummary();
    }
    
    private void createUsers() {
        System.out.println("👥 Creating users...");
        
        //  Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Administrator");
        admin.setEmail("admin@neurofleetx.com");
        admin.setPhoneNumber("+91-9876543210");
        admin.setRole(UserRole.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);
        
        //  Managers
        String[][] managers = {
            {"manager1", "Fleet Manager 1", "manager1@neurofleetx.com", "+91-9876543211"},
            {"manager2", "Fleet Manager 2", "manager2@neurofleetx.com", "+91-9876543212"}
        };
        
        for (String[] m : managers) {
            User manager = new User();
            manager.setUsername(m[0]);
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFullName(m[1]);
            manager.setEmail(m[2]);
            manager.setPhoneNumber(m[3]);
            manager.setRole(UserRole.MANAGER);
            manager.setActive(true);
            userRepository.save(manager);
        }
        
        //  Drivers with realistic data
        String[][] drivers = {
            {"driver1", "Rajesh Kumar", "rajesh.kumar@neurofleetx.com", "+91-9001234567", "DL-1420110012345"},
            {"driver2", "Amit Singh", "amit.singh@neurofleetx.com", "+91-9001234568", "DL-1420110012346"},
            {"driver3", "Suresh Patel", "suresh.patel@neurofleetx.com", "+91-9001234569", "DL-1420110012347"},
            {"driver4", "Vijay Sharma", "vijay.sharma@neurofleetx.com", "+91-9001234570", "DL-1420110012348"},
            {"driver5", "Prakash Reddy", "prakash.reddy@neurofleetx.com", "+91-9001234571", "DL-1420110012349"}
        };
        
        for (int i = 0; i < drivers.length; i++) {
            User driver = new User();
            driver.setUsername(drivers[i][0]);
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setFullName(drivers[i][1]);
            driver.setEmail(drivers[i][2]);
            driver.setPhoneNumber(drivers[i][3]);
            driver.setLicenseNumber(drivers[i][4]);
            driver.setRole(UserRole.DRIVER);
            driver.setActive(true);
            driver.setRating(4.0 + random.nextDouble());
            driver.setTotalTrips(random.nextInt(100) + 50);
            driver.setTotalEarnings(random.nextDouble() * 50000 + 10000);
            userRepository.save(driver);
        }
        
        //  Customers
        String[][] customers = {
            {"customer1", "Priya Sharma", "priya.sharma@gmail.com", "+91-9201234567"},
            {"customer2", "Anita Desai", "anita.desai@gmail.com", "+91-9201234568"},
            {"customer3", "Neha Patel", "neha.patel@gmail.com", "+91-9201234569"},
            {"customer4", "Pooja Singh", "pooja.singh@gmail.com", "+91-9201234570"},
            {"customer5", "Kavita Reddy", "kavita.reddy@gmail.com", "+91-9201234571"}
        };
        
        for (String[] c : customers) {
            User customer = new User();
            customer.setUsername(c[0]);
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setFullName(c[1]);
            customer.setEmail(c[2]);
            customer.setPhoneNumber(c[3]);
            customer.setRole(UserRole.CUSTOMER);
            customer.setActive(true);
            userRepository.save(customer);
        }
        
        System.out.println("✅ Created: 1 Admin, 2 Managers, 5 Drivers, 5 Customers");
    }
    
    private void createVehiclesAcrossIndia() {
        System.out.println("🚗 Creating 50 vehicles across major Indian cities...");
        
        // Indian Cities with GPS Coordinates
        Object[][] cities = {
            {"Mumbai", 19.0760, 72.8777, "MH", 10},
            {"Delhi", 28.7041, 77.1025, "DL", 10},
            {"Bangalore", 12.9716, 77.5946, "KA", 10},
            {"Hyderabad", 17.3850, 78.4867, "TS", 8},
            {"Chennai", 13.0827, 80.2707, "TN", 7},
            {"Pune", 18.5204, 73.8567, "MH", 5}
        };
        
        String[][] vehicleData = {
            {"Tata", "Nexon", "SEDAN"}, {"Maruti", "Dzire", "SEDAN"},
            {"Hyundai", "Creta", "SUV"}, {"Mahindra", "XUV500", "SUV"},
            {"Toyota", "Innova", "VAN"}, {"Mahindra", "Bolero", "SUV"},
            {"Honda", "City", "SEDAN"}, {"Tata", "Safari", "SUV"},
            {"Maruti", "Ertiga", "VAN"}, {"Hyundai", "Verna", "SEDAN"}
        };
        
        VehicleStatus[] statuses = {
            VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE,
            VehicleStatus.IN_USE, VehicleStatus.MAINTENANCE
        };
        
        int vehicleIndex = 0;
        
        for (Object[] city : cities) {
            String cityName = (String) city[0];
            Double baseLat = (Double) city[1];
            Double baseLon = (Double) city[2];
            String stateCode = (String) city[3];
            Integer count = (Integer) city[4];
            
            for (int i = 0; i < count && vehicleIndex < 50; i++) {
                Vehicle vehicle = new Vehicle();
                
                // Generate realistic vehicle number: MH-02-AB-1234
                vehicle.setVehicleNumber(stateCode + "-" + 
                    String.format("%02d", random.nextInt(99) + 1) + "-" +
                    (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + "-" +
                    String.format("%04d", random.nextInt(9999) + 1000));
                
                String[] vData = vehicleData[vehicleIndex % vehicleData.length];
                vehicle.setManufacturer(vData[0]);
                vehicle.setModel(vData[1]);
                vehicle.setType(VehicleType.valueOf(vData[2]));
                vehicle.setCapacity(vehicle.getType() == VehicleType.VAN ? 8 : 
                                   vehicle.getType() == VehicleType.SUV ? 7 : 4);
                
                vehicle.setIsElectric(random.nextDouble() < 0.2); // 20% electric
                vehicle.setStatus(statuses[random.nextInt(statuses.length)]);
                
                // GPS coordinates near city center with realistic spread
                vehicle.setLatitude(baseLat + (random.nextDouble() - 0.5) * 0.2);
                vehicle.setLongitude(baseLon + (random.nextDouble() - 0.5) * 0.2);
                
                vehicle.setBatteryLevel(vehicle.getIsElectric() ? (60 + random.nextInt(41)) : 100);
                vehicle.setFuelLevel(!vehicle.getIsElectric() ? (50 + random.nextInt(51)) : 0);
                vehicle.setHealthScore(75 + random.nextInt(26));
                vehicle.setMileage(random.nextInt(150000) + 10000);
                vehicle.setSpeed(vehicle.getStatus() == VehicleStatus.IN_USE ? 
                    (15.0 + random.nextDouble() * 65) : 0.0);
                
                vehicle.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(730))); // Up to 2 years old
                vehicle.setLastUpdated(LocalDateTime.now().minusMinutes(random.nextInt(60)));
                
                vehicleRepository.save(vehicle);
                vehicleIndex++;
            }
        }
        
        System.out.println("✅ Created 50 vehicles across India");
    }
    

    private void createRealBookings() {
        System.out.println("📝 Creating realistic bookings...");
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<User> customers = userRepository.findByRole(UserRole.CUSTOMER);
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        List<User> managers = userRepository.findByRole(UserRole.MANAGER);
        
        //  Define routes array properly
        String[][] routes = {
            {"Delhi Connaught Place", "Gurgaon Cyber City", "28.6304", "77.2177", "28.4595", "77.0266"},
            {"Bangalore Koramangala", "Electronic City", "12.9352", "77.6245", "12.8456", "77.6603"},
            {"Mumbai Bandra", "Mumbai Airport", "19.0596", "72.8295", "19.0886", "72.8678"},
            {"Hyderabad Hi-Tech City", "Secunderabad", "17.4435", "78.3772", "17.4399", "78.4983"},
            {"Chennai T Nagar", "Chennai Airport", "13.0418", "80.2341", "12.9941", "80.1709"}
        };

        BookingStatus[] statuses = {
            BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.DRIVER_ASSIGNED,
            BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED
        };
        
        for (int i = 0; i < 25; i++) {
            Booking booking = new Booking();
            booking.setCustomer(customers.get(random.nextInt(customers.size())));
            booking.setVehicle(vehicles.get(random.nextInt(Math.min(30, vehicles.size()))));
            booking.setDriver(drivers.get(random.nextInt(drivers.size())));
            booking.setApprovedByManager(managers.get(random.nextInt(managers.size())));
            
            String[] route = routes[random.nextInt(routes.length)];
            booking.setPickupLocation(route[0]);
            booking.setDropoffLocation(route[1]);
            booking.setPickupLatitude(Double.parseDouble(route[2]));
            booking.setPickupLongitude(Double.parseDouble(route[3]));
            booking.setDropoffLatitude(Double.parseDouble(route[4]));
            booking.setDropoffLongitude(Double.parseDouble(route[5]));
            
            LocalDateTime created = LocalDateTime.now().minusDays(random.nextInt(15));
            booking.setCreatedAt(created);
            booking.setStartTime(created.plusHours(random.nextInt(48)));
            booking.setEndTime(booking.getStartTime().plusHours(random.nextInt(5) + 1));
            
            double distance = calculateDistance(
                booking.getPickupLatitude(), booking.getPickupLongitude(),
                booking.getDropoffLatitude(), booking.getDropoffLongitude()
            );
            booking.setTotalPrice(distance * 15.0 + 100);
            
            BookingStatus status = statuses[random.nextInt(statuses.length)];
            booking.setStatus(status);
            booking.setPaymentStatus(status == BookingStatus.COMPLETED ? 
                PaymentStatus.PAID : PaymentStatus.UNPAID);
            
            if (status == BookingStatus.COMPLETED) {
                booking.setCompletedAt(booking.getEndTime());
            }
            
            bookingRepository.save(booking);
        }
        
        System.out.println("✅ Created 25 bookings");
    }
  
    private void createMaintenanceRecords() {
        System.out.println("🔧 Creating maintenance records...");
        
        List<Vehicle> vehicles = vehicleRepository.findAll();
        String[] issueTypes = {
            "Oil Change", "Brake Inspection", "Tire Replacement", 
            "Battery Check", "Engine Maintenance", "AC Service"
        };
        
        MaintenancePriority[] priorities = {
            MaintenancePriority.LOW, MaintenancePriority.MEDIUM, MaintenancePriority.HIGH
        };
        
        for (int i = 0; i < 10; i++) {
            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(vehicles.get(random.nextInt(vehicles.size())));
            record.setIssueType(issueTypes[random.nextInt(issueTypes.length)]);
            record.setPriority(priorities[random.nextInt(priorities.length)]);
            record.setStatus(MaintenanceStatus.PENDING);
            //  Cast int to Double
            record.setRiskScore((double) random.nextInt(100));
            record.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            maintenanceRepository.save(record);
        }
        
        System.out.println("✅ Created 10 maintenance records");
    }
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    private void printSummary() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🎉 NEUROFLEETX DATABASE INITIALIZED SUCCESSFULLY!");
        System.out.println("=".repeat(60));
        System.out.println("\n📝 TEST CREDENTIALS:");
        System.out.println("   🔐 Admin:    admin / admin123");
        System.out.println("   👨‍💼 Manager:  manager1 / manager123");
        System.out.println("   🚗 Driver:   driver1 / driver123 (driver1-driver5)");
        System.out.println("   👤 Customer: customer1 / customer123 (customer1-customer5)");
        System.out.println("\n📊 DATABASE STATISTICS:");
        System.out.println("   👥 Users: " + userRepository.count() + " (1 Admin, 2 Managers, 5 Drivers, 5 Customers)");
        System.out.println("   🚗 Vehicles: " + vehicleRepository.count() + " (Across Mumbai, Delhi, Bangalore, etc.)");
        System.out.println("   📋 Bookings: " + bookingRepository.count());
        System.out.println("   🔧 Maintenance: " + maintenanceRepository.count());
        System.out.println("=".repeat(60) + "\n");
    }
}