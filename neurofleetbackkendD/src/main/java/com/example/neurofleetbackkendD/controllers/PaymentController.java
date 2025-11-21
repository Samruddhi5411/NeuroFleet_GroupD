//package com.example.neurofleetbackkendD.controllers;
//
//import com.example.neurofleetbackkendD.model.Booking;
//import com.example.neurofleetbackkendD.model.Payment;
//import com.example.neurofleetbackkendD.service.PaymentService;
//import com.example.neurofleetbackkendD.service.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/payments")
//@CrossOrigin(origins = "http://localhost:3000")
//public class PaymentController {
//    
//    @Autowired
//    private PaymentService paymentService;
//    
//    @Autowired
//    private NotificationService notificationService;
//    
//    // Customer makes payment after manager approval
//    @PostMapping("/booking/{bookingId}/pay")
//    public ResponseEntity<?> processPayment(
//            @PathVariable Long bookingId,
//            @RequestBody Map<String, Object> paymentData) {
//        try {
//            String paymentMethod = (String) paymentData.get("paymentMethod");
//            String cardNumber = (String) paymentData.getOrDefault("cardNumber", "");
//            
//            System.out.println("💳 Processing payment for booking: " + bookingId);
//            
//            Payment payment = paymentService.processPayment(bookingId, paymentMethod, cardNumber);
//            
//            System.out.println("✅ Payment successful! Transaction ID: " + payment.getTransactionId());
//            
//            return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "Payment successful",
//                "payment", payment,
//                "transactionId", payment.getTransactionId()
//            ));
//        } catch (Exception e) {
//            System.err.println("❌ Payment failed: " + e.getMessage());
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body(Map.of(
//                "success", false,
//                "error", e.getMessage()
//            ));
//        }
//    }
//    
//    // Driver requests early payout
//    @PostMapping("/driver/{driverId}/request-payout")
//    public ResponseEntity<?> requestEarlyPayout(@PathVariable Long driverId) {
//        try {
//            System.out.println("💰 Driver " + driverId + " requesting early payout...");
//            
//            Map<String, Object> result = paymentService.requestEarlyPayout(driverId);
//            
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            System.err.println("❌ Payout request failed: " + e.getMessage());
//            return ResponseEntity.badRequest().body(Map.of(
//                "success", false,
//                "error", e.getMessage()
//            ));
//        }
//    }
//    
//    // Get payment history for customer
//    @GetMapping("/customer/{customerId}/history")
//    public ResponseEntity<?> getCustomerPaymentHistory(@PathVariable Long customerId) {
//        try {
//            List<Payment> payments = paymentService.getCustomerPayments(customerId);
//            return ResponseEntity.ok(payments);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    // Get payment receipt
//    @GetMapping("/{paymentId}/receipt")
//    public ResponseEntity<?> getReceipt(@PathVariable Long paymentId) {
//        try {
//            Map<String, Object> receipt = paymentService.generateReceipt(paymentId);
//            return ResponseEntity.ok(receipt);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
//        }
//    }
//    
//    // Download receipt as PDF
//    @GetMapping("/{paymentId}/receipt/download")
//    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long paymentId) {
//        try {
//            byte[] pdf = paymentService.generateReceiptPDF(paymentId);
//            
//            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
//            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
//            headers.setContentDispositionFormData("attachment", "receipt-" + paymentId + ".pdf");
//            
//            return ResponseEntity.ok()
//                .headers(headers)
//                .body(pdf);
//        } catch (Exception e) {
//            System.err.println("❌ Error generating PDF: " + e.getMessage());
//            return ResponseEntity.badRequest().build();
//        }
//    }
//    
//    // Refund payment (for cancellations)
//    @PostMapping("/{paymentId}/refund")
//    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId) {
//        try {
//            Payment refund = paymentService.refundPayment(paymentId);
//            return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "Refund processed successfully",
//                "payment", refund
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of(
//                "success", false,
//                "error", e.getMessage()
//            ));
//        }
//    }
//}