//package com.example.neurofleetbackkendD.service;
//
//import com.example.neurofleetbackkendD.model.*;
//import com.example.neurofleetbackkendD.model.enums.*;
//import com.example.neurofleetbackkendD.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.*;
//
//@Service
//public class PaymentService {
//    
//    @Autowired private PaymentRepository paymentRepository;
//    @Autowired private BookingRepository bookingRepository;
//    @Autowired private UserRepository userRepository;
//    @Autowired private NotificationService notificationService;
//    @Autowired private ReceiptService receiptService;
//    
//    private static final DateTimeFormatter formatter = 
//        DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
//    
//    /**
//     * Process payment after trip completion
//     * Booking must be in COMPLETED status
//     */
//    @Transactional
//    public Payment processPayment(Long bookingId, String paymentMethod, String cardNumber) {
//        Booking booking = bookingRepository.findById(bookingId)
//            .orElseThrow(() -> new RuntimeException("Booking not found"));
//        
//        // Validate booking status
//        if (booking.getStatus() != BookingStatus.COMPLETED) {
//            throw new RuntimeException(
//                "Payment can only be made after trip completion. Current status: " + booking.getStatus()
//            );
//        }
//        
//        // Check if already paid
//        Payment existingPayment = paymentRepository.findByBookingId(bookingId);
//        if (existingPayment != null && existingPayment.getStatus() == PaymentStatus.PAID) {
//            throw new RuntimeException("Payment already completed for this booking");
//        }
//        
//        // Create payment record
//        Payment payment = new Payment();
//        payment.setBooking(booking);
//        payment.setCustomer(booking.getCustomer());
//        payment.setDriver(booking.getDriver());
//        payment.setAmount(booking.getTotalPrice());
//        payment.setPaymentMethod(paymentMethod);
//        payment.setStatus(PaymentStatus.PAID);
//        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
//        payment.setPaidAt(LocalDateTime.now());
//        
//        // Mask card number
//        if (cardNumber != null && !cardNumber.isEmpty()) {
//            payment.setCardLast4(cardNumber.length() > 4 ? 
//                cardNumber.substring(cardNumber.length() - 4) : cardNumber);
//        }
//        
//        payment = paymentRepository.save(payment);
//        
//        // Update booking payment status
//        booking.setPaymentStatus(PaymentStatus.PAID);
//        booking.setPaymentMethod(paymentMethod);
//        booking.setTransactionId(payment.getTransactionId());
//        bookingRepository.save(booking);
//        
//        // Update driver earnings
//        if (booking.getDriver() != null) {
//            User driver = booking.getDriver();
//            double driverShare = booking.getTotalPrice() * 0.7; // 70% to driver
//            driver.setTotalEarnings(driver.getTotalEarnings() + driverShare);
//            userRepository.save(driver);
//        }
//        
//        // Send notifications
//        notificationService.notifyPaymentReceived(booking);
//        
//        System.out.println("✅ Payment processed: " + payment.getTransactionId() + 
//                          " | Amount: ₹" + payment.getAmount());
//        
//        return payment;
//    }
//    
//    /**
//     * Get customer payment history
//     */
//    public List<Payment> getCustomerPayments(Long customerId) {
//        return paymentRepository.findByCustomerId(customerId);
//    }
//    
//    /**
//     * Generate receipt data (JSON)
//     */
//    public Map<String, Object> generateReceipt(Long paymentId) {
//        Payment payment = paymentRepository.findById(paymentId)
//            .orElseThrow(() -> new RuntimeException("Payment not found"));
//        
//        Booking booking = payment.getBooking();
//        
//        Map<String, Object> receipt = new HashMap<>();
//        
//        // Receipt header
//        receipt.put("receiptNumber", "RCPT-" + payment.getId());
//        receipt.put("transactionId", payment.getTransactionId());
//        receipt.put("date", payment.getPaidAt().format(formatter));
//        receipt.put("status", "PAID");
//        
//        // Customer details
//        Map<String, String> customer = new HashMap<>();
//        customer.put("name", booking.getCustomer().getFullName());
//        customer.put("email", booking.getCustomer().getEmail());
//        customer.put("phone", booking.getCustomer().getPhoneNumber());
//        receipt.put("customer", customer);
//        
//        // Booking details
//        Map<String, Object> bookingInfo = new HashMap<>();
//        bookingInfo.put("bookingId", booking.getId());
//        bookingInfo.put("pickupLocation", booking.getPickupLocation());
//        bookingInfo.put("dropoffLocation", booking.getDropoffLocation());
//        bookingInfo.put("startTime", booking.getStartTime().format(formatter));
//        bookingInfo.put("endTime", booking.getEndTime().format(formatter));
//        bookingInfo.put("distanceKm", booking.getDistanceKm());
//        receipt.put("booking", bookingInfo);
//        
//        // Vehicle details
//        Map<String, String> vehicle = new HashMap<>();
//        vehicle.put("number", booking.getVehicle().getVehicleNumber());
//        vehicle.put("model", booking.getVehicle().getModel());
//        vehicle.put("type", booking.getVehicle().getType().name());
//        receipt.put("vehicle", vehicle);
//        
//        // Driver details
//        if (booking.getDriver() != null) {
//            Map<String, String> driver = new HashMap<>();
//            driver.put("name", booking.getDriver().getFullName());
//            driver.put("phone", booking.getDriver().getPhoneNumber());
//            driver.put("license", booking.getDriver().getLicenseNumber());
//            receipt.put("driver", driver);
//        }
//        
//        // Payment breakdown
//        double baseAmount = booking.getTotalPrice();
//        double tax = baseAmount * 0.18; // 18% GST
//        double totalAmount = baseAmount + tax;
//        
//        Map<String, Object> charges = new HashMap<>();
//        charges.put("baseFare", String.format("%.2f", baseAmount));
//        charges.put("gst", String.format("%.2f", tax));
//        charges.put("total", String.format("%.2f", totalAmount));
//        receipt.put("charges", charges);
//        
//        // Payment method
//        receipt.put("paymentMethod", payment.getPaymentMethod());
//        if (payment.getCardLast4() != null) {
//            receipt.put("cardLast4", "****" + payment.getCardLast4());
//        }
//        
//        return receipt;
//    }
//    
//    /**
//     * Generate receipt PDF
//     */
//    public byte[] generateReceiptPDF(Long paymentId) {
//        Payment payment = paymentRepository.findById(paymentId)
//            .orElseThrow(() -> new RuntimeException("Payment not found"));
//        
//        return receiptService.generatePDF(payment);
//    }
//    
//    /**
//     * Request early payout (Driver)
//     */
//    @Transactional
//    public Map<String, Object> requestEarlyPayout(Long driverId) {
//        User driver = userRepository.findById(driverId)
//            .orElseThrow(() -> new RuntimeException("Driver not found"));
//        
//        List<Payment> pendingPayments = paymentRepository
//            .findByDriverIdAndPayoutStatus(driverId, "PENDING");
//        
//        double totalPending = pendingPayments.stream()
//            .mapToDouble(Payment::getAmount)
//            .sum();
//        
//        double driverShare = totalPending * 0.7; // 70% driver share
//        
//        if (driverShare <= 0) {
//            throw new RuntimeException("No pending earnings to payout");
//        }
//        
//        // Mark as payout requested
//        for (Payment payment : pendingPayments) {
//            payment.setPayoutStatus("REQUESTED");
//            payment.setPayoutRequestedAt(LocalDateTime.now());
//            paymentRepository.save(payment);
//        }
//        
//        System.out.println("💰 Payout requested: Driver " + driver.getFullName() + 
//                          " | Amount: ₹" + driverShare);
//        
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "Payout request submitted");
//        result.put("amount", driverShare);
//        result.put("estimatedProcessingTime", "24-48 hours");
//        result.put("status", "PENDING_APPROVAL");
//        
//        return result;
//    }
//    
//    /**
//     * Refund payment (for cancellations)
//     */
//    @Transactional
//    public Payment refundPayment(Long paymentId) {
//        Payment payment = paymentRepository.findById(paymentId)
//            .orElseThrow(() -> new RuntimeException("Payment not found"));
//        
//        if (payment.getStatus() == PaymentStatus.REFUNDED) {
//            throw new RuntimeException("Payment already refunded");
//        }
//        
//        payment.setStatus(PaymentStatus.REFUNDED);
//        payment.setRefundedAt(LocalDateTime.now());
//        payment = paymentRepository.save(payment);
//        
//        // Update booking
//        Booking booking = payment.getBooking();
//        booking.setPaymentStatus(PaymentStatus.REFUNDED);
//        bookingRepository.save(booking);
//        
//        System.out.println("💸 Refund processed for payment #" + paymentId);
//        
//        return payment;
//    }
//}