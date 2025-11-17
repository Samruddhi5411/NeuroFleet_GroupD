package com.example.neurofleetbackkendD.repository;





import com.example.neurofleetbackkendD.model.User;
import com.example.neurofleetbackkendD.model.enums.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByRoleAndActive(UserRole role, Boolean active);
}