package com.voya.identity_service.repository;

import com.voya.identity_service.entity.User;
import com.voya.identity_service.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByRoleOrderByIdAsc(Role role);

    boolean existsByEmail(String email);
}
