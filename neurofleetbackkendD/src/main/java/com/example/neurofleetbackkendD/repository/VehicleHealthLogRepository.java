//package com.example.neurofleetbackkendD.repository;
//
//import com.example.neurofleetbackkendD.model.VehicleHealthLog;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface VehicleHealthLogRepository extends JpaRepository<VehicleHealthLog, Long> {
//    List<VehicleHealthLog> findByVehicleId(Long vehicleId);
//    List<VehicleHealthLog> findByVehicleIdOrderByTimestampDesc(Long vehicleId);
//    VehicleHealthLog findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);
//    List<VehicleHealthLog> findByHealthStatus(String status);
//    List<VehicleHealthLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
//    
//    @Query("SELECT v FROM VehicleHealthLog v WHERE v.overallHealthScore < ?1")
//    List<VehicleHealthLog> findByHealthScoreLessThan(Integer score);
//}
