//package com.example.neurofleetbackkendD.service;
//
//import com.example.neurofleetbackkendD.model.*;
//import org.springframework.stereotype.Service;
//import java.io.ByteArrayOutputStream;
//import java.time.format.DateTimeFormatter;
//import java.util.*;
//
//@Service
//public class ReceiptService {
//    
//    private static final DateTimeFormatter formatter = 
//        DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
//    
//    /**
//     * Generate receipt data as Map
//     */
//    public Map<String, Object> generateReceiptData(Payment payment) {
//        Booking booking = payment.getBooking();
//        
//        Map<String, Object> receipt = new HashMap<>();
//        
//        // Receipt info
//        receipt.put("receiptNumber", "RCPT-" + payment.getId());
//        receipt.put("transactionId", payment.getTransactionId());
//        receipt.put("date", payment.getPaidAt().format(formatter));
//        receipt.put("status", "PAID");
//        
//        // Company info
//        receipt.put("companyName", "NeuroFleetX");
//        receipt.put("companyAddress", "Smart City, India");
//        receipt.put("companyGST", "27AABCU9603R1ZM");
//        
//        // Customer
//        Map<String, String> customer = new HashMap<>();
//        customer.put("name", booking.getCustomer().getFullName());
//        customer.put("email", booking.getCustomer().getEmail());
//        customer.put("phone", booking.getCustomer().getPhoneNumber());
//        receipt.put("customer", customer);
//        
//        // Booking
//        Map<String, Object> bookingInfo = new HashMap<>();
//        bookingInfo.put("id", booking.getId());
//        bookingInfo.put("pickupLocation", booking.getPickupLocation());
//        bookingInfo.put("dropoffLocation", booking.getDropoffLocation());
//        bookingInfo.put("startTime", booking.getStartTime().format(formatter));
//        bookingInfo.put("endTime", booking.getEndTime().format(formatter));
//        bookingInfo.put("distanceKm", booking.getDistanceKm());
//        receipt.put("booking", bookingInfo);
//        
//        // Vehicle
//        Map<String, String> vehicle = new HashMap<>();
//        vehicle.put("number", booking.getVehicle().getVehicleNumber());
//        vehicle.put("model", booking.getVehicle().getModel());
//        vehicle.put("type", booking.getVehicle().getType().name());
//        receipt.put("vehicle", vehicle);
//        
//        // Driver
//        if (booking.getDriver() != null) {
//            Map<String, String> driver = new HashMap<>();
//            driver.put("name", booking.getDriver().getFullName());
//            driver.put("phone", booking.getDriver().getPhoneNumber());
//            receipt.put("driver", driver);
//        }
//        
//        // Charges
//        double baseFare = payment.getAmount();
//        double gst = baseFare * 0.18;
//        double total = baseFare + gst;
//        
//        Map<String, Double> charges = new HashMap<>();
//        charges.put("baseFare", baseFare);
//        charges.put("gst", gst);
//        charges.put("total", total);
//        receipt.put("charges", charges);
//        
//        receipt.put("paymentMethod", payment.getPaymentMethod());
//        
//        return receipt;
//    }
//    
//    /**
//     * Generate PDF receipt
//     * For now, returns a simple text-based PDF
//     * In production, use libraries like iText or Apache PDFBox
//     */
//    public byte[] generatePDF(Payment payment) {
//        try {
//            // Simple text-based receipt
//            StringBuilder pdf = new StringBuilder();
//            
//            pdf.append("========================================\n");
//            pdf.append("         NEUROFLEETX RECEIPT           \n");
//            pdf.append("========================================\n\n");
//            
//            pdf.append("Receipt #: RCPT-").append(payment.getId()).append("\n");
//            pdf.append("Transaction ID: ").append(payment.getTransactionId()).append("\n");
//            pdf.append("Date: ").append(payment.getPaidAt().format(formatter)).append("\n");
//            pdf.append("Status: PAID\n\n");
//            
//            pdf.append("----------------------------------------\n");
//            pdf.append("CUSTOMER DETAILS\n");
//            pdf.append("----------------------------------------\n");
//            User customer = payment.getBooking().getCustomer();
//            pdf.append("Name: ").append(customer.getFullName()).append("\n");
//            pdf.append("Email: ").append(customer.getEmail()).append("\n");
//            pdf.append("Phone: ").append(customer.getPhoneNumber()).append("\n\n");
//            
//            pdf.append("----------------------------------------\n");
//            pdf.append("TRIP DETAILS\n");
//            pdf.append("----------------------------------------\n");
//            Booking booking = payment.getBooking();
//            pdf.append("Booking ID: ").append(booking.getId()).append("\n");
//            pdf.append("From: ").append(booking.getPickupLocation()).append("\n");
//            pdf.append("To: ").append(booking.getDropoffLocation()).append("\n");
//            pdf.append("Start: ").append(booking.getStartTime().format(formatter)).append("\n");
//            pdf.append("End: ").append(booking.getEndTime().format(formatter)).append("\n");
//            pdf.append("Distance: ").append(booking.getDistanceKm()).append(" km\n\n");
//            
//            pdf.append("----------------------------------------\n");
//            pdf.append("VEHICLE & DRIVER\n");
//            pdf.append("----------------------------------------\n");
//            Vehicle vehicle = booking.getVehicle();
//            pdf.append("Vehicle: ").append(vehicle.getModel()).append("\n");
//            pdf.append("Number: ").append(vehicle.getVehicleNumber()).append("\n");
//            if (booking.getDriver() != null) {
//                pdf.append("Driver: ").append(booking.getDriver().getFullName()).append("\n");
//            }
//            pdf.append("\n");
//            
//            pdf.append("----------------------------------------\n");
//            pdf.append("CHARGES\n");
//            pdf.append("----------------------------------------\n");
//            double baseFare = payment.getAmount();
//            double gst = baseFare * 0.18;
//            double total = baseFare + gst;
//            
//            pdf.append(String.format("Base Fare:        ₹%.2f\n", baseFare));
//            pdf.append(String.format("GST (18%%):        ₹%.2f\n", gst));
//            pdf.append("----------------------------------------\n");
//            pdf.append(String.format("TOTAL:            ₹%.2f\n", total));
//            pdf.append("----------------------------------------\n\n");
//            
//            pdf.append("Payment Method: ").append(payment.getPaymentMethod()).append("\n");
//            if (payment.getCardLast4() != null) {
//                pdf.append("Card: ****").append(payment.getCardLast4()).append("\n");
//            }
//            
//            pdf.append("\n========================================\n");
//            pdf.append("    Thank you for using NeuroFleetX    \n");
//            pdf.append("========================================\n");
//            
//            return pdf.toString().getBytes("UTF-8");
//            
//        } catch (Exception e) {
//            System.err.println("❌ Error generating PDF: " + e.getMessage());
//            throw new RuntimeException("Failed to generate PDF receipt");
//        }
//    }
//}