package com.example.neurofleetbackkendD.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
        if (userRepository.count() > 0 && vehicleRepository.count() > 0) {
            System.out.println("⚠️ Data already exists, skipping initialization");
            
            // But check if bookings/maintenance exist
            if (bookingRepository.count() == 0) {
                System.out.println("📝 Creating bookings and maintenance records...");
                createBookingsAndMaintenance();
            }
            return;
        }
        
        System.out.println("🚀 Initializing NeuroFleetX Database...");
        
        // Create Users
        createUsers();
        
        // Create Vehicles from All Over India (50 vehicles)
        createVehiclesAllIndia();
        
        // Create Bookings and Maintenance Records
        createBookingsAndMaintenance();
        
        System.out.println("✅ Database initialization completed!");
        printSummary();
    }
    
    private void createUsers() {
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
    }
    
    private void createVehiclesAllIndia() {
        // Indian Cities with GPS Coordinates
        Object[][] cities = {
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
            {"Dzire", "City", "Verna", "Ciaz", "Rapid"},
            {"Creta", "Seltos", "XUV500", "Fortuner", "Scorpio"},
            {"Innova", "Ertiga", "Marazzo", "Carnival", "Traveller"},
            {"407", "407 Plus", "Eicher Pro", "Tata Ultra", "Ashok Leyland"},
            {"Starbus", "Citybus", "Tourist Bus", "School Bus", "Express"},
            {"Royal Enfield", "Pulsar", "Apache", "FZ", "Duke"}
        };
        
        VehicleType[] types = VehicleType.values();
        
        int vehicleCounter = 1;
        
        for (Object[] city : cities) {
            String cityName = (String) city[0];
            Double baseLat = (Double) city[1];
            Double baseLon = (Double) city[2];
            
            int vehiclesInCity = 2 + random.nextInt(2);
            
            for (int i = 0; i < vehiclesInCity && vehicleCounter <= 50; i++) {
                Vehicle vehicle = new Vehicle();
                
                String stateCode = getStateCode(cityName);
                vehicle.setVehicleNumber(stateCode + "-" + 
                    String.format("%02d", random.nextInt(99) + 1) + "-" +
                    (char)('A' + random.nextInt(26)) + (char)('A' + random.nextInt(26)) + "-" +
                    String.format("%04d", random.nextInt(9999) + 1));
                
                VehicleType type = types[random.nextInt(types.length)];
                vehicle.setType(type);
                
                vehicle.setManufacturer(manufacturers[random.nextInt(manufacturers.length)]);
                vehicle.setModel(modelsPerType[type.ordinal()][random.nextInt(5)]);
                
                switch (type) {
                    case SEDAN: vehicle.setCapacity(4 + random.nextInt(2)); break;
                    case SUV: vehicle.setCapacity(5 + random.nextInt(3)); break;
                    case VAN: vehicle.setCapacity(7 + random.nextInt(5)); break;
                    case TRUCK: vehicle.setCapacity(2); break;
                    case BUS: vehicle.setCapacity(30 + random.nextInt(20)); break;
                    case BIKE: vehicle.setCapacity(2); break;
                }
                
                vehicle.setIsElectric(random.nextDouble() < 0.3);
                
                VehicleStatus[] statuses = VehicleStatus.values();
                vehicle.setStatus(statuses[random.nextInt(statuses.length)]);
                
                vehicle.setLatitude(baseLat + (random.nextDouble() - 0.5) * 0.1);
                vehicle.setLongitude(baseLon + (random.nextDouble() - 0.5) * 0.1);
                
                vehicle.setBatteryLevel(vehicle.getIsElectric() ? 
                    (70 + random.nextInt(31)) : 100);
                vehicle.setFuelLevel(!vehicle.getIsElectric() ? 
                    (60 + random.nextInt(41)) : 0);
                
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
    
    private void createBookingsAndMaintenance() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<User> customers = userRepository.findByRole(UserRole.CUSTOMER);
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        List<User> managers = userRepository.findByRole(UserRole.MANAGER);
        
        if (vehicles.isEmpty() || customers.isEmpty() || drivers.isEmpty()) {
            System.out.println("⚠️ Cannot create bookings - missing vehicles, customers, or drivers");
            return;
        }
        
        User manager = managers.isEmpty() ? null : managers.get(0);
        
        // Create 100 Bookings
        String[] indianCities = {
            "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
            "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
        };
        
        BookingStatus[] statuses = {
            BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS, 
            BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED
        };
        
        for (int i = 0; i < 100; i++) {
            Booking booking = new Booking();
            
            booking.setCustomer(customers.get(random.nextInt(customers.size())));
            booking.setVehicle(vehicles.get(random.nextInt(vehicles.size())));
            
            if (random.nextBoolean()) {
                booking.setDriver(drivers.get(random.nextInt(drivers.size())));
            }
            
            booking.setApprovedByManager(manager);
            
            LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(60));
            booking.setCreatedAt(createdAt);
            booking.setStartTime(createdAt.plusHours(random.nextInt(48)));
            booking.setEndTime(booking.getStartTime().plusHours(2 + random.nextInt(6)));
            
            String pickupCity = indianCities[random.nextInt(indianCities.length)];
            String dropoffCity = indianCities[random.nextInt(indianCities.length)];
            
            booking.setPickupLocation(pickupCity + " Station");
            booking.setDropoffLocation(dropoffCity + " Airport");
            booking.setPickupLatitude(18.0 + random.nextDouble() * 15);
            booking.setPickupLongitude(72.0 + random.nextDouble() * 16);
            booking.setDropoffLatitude(18.0 + random.nextDouble() * 15);
            booking.setDropoffLongitude(72.0 + random.nextDouble() * 16);
            
            booking.setTotalPrice(500.0 + random.nextDouble() * 4500.0);
            
            BookingStatus status = statuses[random.nextInt(statuses.length)];
            booking.setStatus(status);
            
            if (status == BookingStatus.COMPLETED) {
                booking.setPaymentStatus(PaymentStatus.PAID);
                booking.setCompletedAt(booking.getEndTime().plusMinutes(15));
                booking.setApprovedAt(createdAt.plusHours(1));
                booking.setDriverAcceptedAt(createdAt.plusHours(2));
            } else if (status == BookingStatus.IN_PROGRESS) {
                booking.setPaymentStatus(PaymentStatus.PAID);
                booking.setApprovedAt(createdAt.plusHours(1));
                booking.setDriverAcceptedAt(createdAt.plusHours(2));
            } else if (status == BookingStatus.CONFIRMED) {
                booking.setPaymentStatus(PaymentStatus.PAID);
                booking.setApprovedAt(createdAt.plusHours(1));
            } else if (status == BookingStatus.CANCELLED) {
                booking.setPaymentStatus(PaymentStatus.REFUNDED);
                booking.setCancellationReason("Customer requested cancellation");
                booking.setCancelledAt(createdAt.plusHours(3));
            } else {
                booking.setPaymentStatus(PaymentStatus.UNPAID);
            }
            
            booking.setPaymentMethod(random.nextBoolean() ? "UPI" : "Credit Card");
            
            bookingRepository.save(booking);
        }
        
        System.out.println("✅ Created " + bookingRepository.count() + " bookings");
        
        // Create Maintenance Records
        String[] issueTypes = {
            "Engine Oil Change", "Tire Replacement", "Brake Pad Service", 
            "Battery Check", "AC Repair", "Transmission Service",
            "Suspension Check", "Wheel Alignment", "Engine Diagnostic"
        };
        
        MaintenancePriority[] priorities = {
            MaintenancePriority.LOW, MaintenancePriority.MEDIUM, 
            MaintenancePriority.HIGH, MaintenancePriority.CRITICAL
        };
        
        MaintenanceStatus[] maintenanceStatuses = {
            MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.COMPLETED
        };
        
        for (int i = 0; i < 30; i++) {
            MaintenanceRecord record = new MaintenanceRecord();
            record.setVehicle(vehicles.get(random.nextInt(vehicles.size())));
            record.setIssueType(issueTypes[random.nextInt(issueTypes.length)]);
            record.setDescription("Scheduled maintenance check for vehicle");
            record.setPriority(priorities[random.nextInt(priorities.length)]);
            record.setStatus(maintenanceStatuses[random.nextInt(maintenanceStatuses.length)]);
            record.setEstimatedCost(1000.0 + random.nextDouble() * 9000.0);
            record.setMechanicAssigned("Mechanic " + (random.nextInt(10) + 1));
            record.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
            record.setScheduledDate(LocalDateTime.now().plusDays(random.nextInt(15)));
            
            // 40% are predictive AI alerts
            if (random.nextDouble() < 0.4) {
                record.setIsPredictive(true);
                record.setRiskScore(40 + random.nextInt(60));
                record.setPredictedDaysToFailure(5 + random.nextInt(25));
            } else {
                record.setIsPredictive(false);
            }
            
            if (record.getStatus() == MaintenanceStatus.COMPLETED) {
                record.setCompletedDate(LocalDateTime.now().minusDays(random.nextInt(30)));
            }
            
            maintenanceRepository.save(record);
        }
        
        System.out.println("✅ Created " + maintenanceRepository.count() + " maintenance records");
    }
    
    private String getStateCode(String city) {
        switch (city) {
            case "Mumbai": case "Pune": case "Nagpur": return "MH";
            case "Delhi": return "DL";
            case "Bangalore": return "KA";
            case "Hyderabad": return "TS";
            case "Chennai": case "Coimbatore": return "TN";
            case "Kolkata": return "WB";
            case "Ahmedabad": case "Surat": case "Vadodara": return "GJ";
            case "Jaipur": return "RJ";
            case "Lucknow": return "UP";
            case "Chandigarh": return "CH";
            case "Kochi": case "Thiruvananthapuram": return "KL";
            case "Indore": case "Bhopal": return "MP";
            case "Visakhapatnam": return "AP";
            default: return "XX";
        }
    }
    
    private void printSummary() {
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
        System.out.println("   Total Bookings: " + bookingRepository.count());
        System.out.println("   Total Maintenance: " + maintenanceRepository.count());
        System.out.println("   Drivers: 20");
        System.out.println("   Customers: 15");
        System.out.println("   Managers: 3");
    }
}