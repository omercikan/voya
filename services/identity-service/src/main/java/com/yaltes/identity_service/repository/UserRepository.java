package com.yaltes.identity_service.repository;

import com.yaltes.identity_service.entity.User;
import com.yaltes.identity_service.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByRoleOrderByIdAsc(Role role);

    boolean existsByEmail(String email);
}
