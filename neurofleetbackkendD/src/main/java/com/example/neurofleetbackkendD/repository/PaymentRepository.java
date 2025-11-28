

package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.Payment;
import com.example.neurofleetbackkendD.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByBookingId(Long bookingId);
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByDriverIdAndPayoutStatus(Long driverId, String payoutStatus);
    List<Payment> findByStatus(PaymentStatus status);
}