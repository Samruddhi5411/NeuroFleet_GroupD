package com.example.neurofleetbackkendD.service;

import com.example.neurofleetbackkendD.model.*;
import com.example.neurofleetbackkendD.model.enums.*;
import com.example.neurofleetbackkendD.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public Map<String, Object> generateFleetReport() {
        Map<String, Object> report = new HashMap<>();
        
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        List<Vehicle> availableVehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
        List<Vehicle> inUseVehicles = vehicleRepository.findByStatus(VehicleStatus.IN_USE);
        List<Vehicle> maintenanceVehicles = vehicleRepository.findByStatus(VehicleStatus.MAINTENANCE);
        
        report.put("totalVehicles", allVehicles.size());
        report.put("availableVehicles", availableVehicles.size());
        report.put("inUseVehicles", inUseVehicles.size());
        report.put("maintenanceVehicles", maintenanceVehicles.size());
        report.put("generatedAt", LocalDateTime.now().toString());
        report.put("vehicles", allVehicles);
        
        // Calculate utilization rate
        double utilizationRate = allVehicles.isEmpty() ? 0 : 
            (inUseVehicles.size() * 100.0) / allVehicles.size();
        report.put("utilizationRate", String.format("%.2f%%", utilizationRate));
        
        System.out.println("📊 Fleet report generated: " + allVehicles.size() + " vehicles");
        return report;
    }
    
    public Map<String, Object> generateFinancialReport() {
        Map<String, Object> report = new HashMap<>();
        
        List<Payment> allPayments = paymentRepository.findAll();
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
        
        double totalRevenue = allPayments.stream()
            .filter(p -> p.getStatus() == PaymentStatus.PAID)
            .mapToDouble(Payment::getAmount)
            .sum();
        
        double pendingRevenue = bookingRepository.findByStatus(BookingStatus.PENDING)
            .stream()
            .mapToDouble(Booking::getTotalPrice)
            .sum();
        
        report.put("totalRevenue", totalRevenue);
        report.put("pendingRevenue", pendingRevenue);
        report.put("completedBookings", completedBookings.size());
        report.put("totalTransactions", allPayments.size());
        report.put("generatedAt", LocalDateTime.now().toString());
        report.put("payments", allPayments);
        
        System.out.println("💰 Financial report generated: ₹" + totalRevenue);
        return report;
    }
    
    public Map<String, Object> generatePerformanceReport() {
        Map<String, Object> report = new HashMap<>();
        
        List<User> drivers = userRepository.findByRole(UserRole.DRIVER);
        List<Booking> completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED);
        
        // Calculate average ratings, trips, etc.
        double totalTrips = drivers.stream().mapToInt(User::getTotalTrips).sum();
        double totalEarnings = drivers.stream().mapToDouble(User::getTotalEarnings).sum();
        
        report.put("totalDrivers", drivers.size());
        report.put("totalTrips", (int) totalTrips);
        report.put("totalEarnings", totalEarnings);
        report.put("completedBookings", completedBookings.size());
        report.put("generatedAt", LocalDateTime.now().toString());
        report.put("drivers", drivers);
        
        System.out.println("📈 Performance report generated: " + drivers.size() + " drivers");
        return report;
    }
    
    public byte[] generateFleetReportPDF() {
        Map<String, Object> data = generateFleetReport();
        
        StringBuilder pdf = new StringBuilder();
        pdf.append("FLEET REPORT\n");
        pdf.append("===================\n\n");
        pdf.append("Generated: ").append(data.get("generatedAt")).append("\n\n");
        pdf.append("Total Vehicles: ").append(data.get("totalVehicles")).append("\n");
        pdf.append("Available: ").append(data.get("availableVehicles")).append("\n");
        pdf.append("In Use: ").append(data.get("inUseVehicles")).append("\n");
        pdf.append("Maintenance: ").append(data.get("maintenanceVehicles")).append("\n");
        pdf.append("Utilization Rate: ").append(data.get("utilizationRate")).append("\n");
        pdf.append("\n===================\n");
        
        return pdf.toString().getBytes();
    }
    
    public byte[] generateFinancialReportPDF() {
        Map<String, Object> data = generateFinancialReport();
        
        StringBuilder pdf = new StringBuilder();
        pdf.append("FINANCIAL REPORT\n");
        pdf.append("===================\n\n");
        pdf.append("Generated: ").append(data.get("generatedAt")).append("\n\n");
        pdf.append("Total Revenue: ₹").append(data.get("totalRevenue")).append("\n");
        pdf.append("Pending Revenue: ₹").append(data.get("pendingRevenue")).append("\n");
        pdf.append("Completed Bookings: ").append(data.get("completedBookings")).append("\n");
        pdf.append("Total Transactions: ").append(data.get("totalTransactions")).append("\n");
        pdf.append("\n===================\n");
        
        return pdf.toString().getBytes();
    }
    
    public byte[] generatePerformanceReportPDF() {
        Map<String, Object> data = generatePerformanceReport();
        
        StringBuilder pdf = new StringBuilder();
        pdf.append("PERFORMANCE REPORT\n");
        pdf.append("===================\n\n");
        pdf.append("Generated: ").append(data.get("generatedAt")).append("\n\n");
        pdf.append("Total Drivers: ").append(data.get("totalDrivers")).append("\n");
        pdf.append("Total Trips: ").append(data.get("totalTrips")).append("\n");
        pdf.append("Total Earnings: ₹").append(data.get("totalEarnings")).append("\n");
        pdf.append("Completed Bookings: ").append(data.get("completedBookings")).append("\n");
        pdf.append("\n===================\n");
        
        return pdf.toString().getBytes();
    }
}