package com.example.neurofleetbackkendD.repository;

import com.example.neurofleetbackkendD.model.TripDensity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripDensityRepository extends JpaRepository<TripDensity, Long> {
    List<TripDensity> findByPeriodType(String periodType);
    List<TripDensity> findByPeriodStartBetween(LocalDateTime start, LocalDateTime end);
}