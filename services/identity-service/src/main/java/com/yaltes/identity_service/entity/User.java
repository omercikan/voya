package com.yaltes.identity_service.entity;

import com.yaltes.identity_service.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Setter
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Setter
    @Column(unique = true, nullable = false)
    private String email;

    @Setter
    @Column(nullable = false)
    private String password;

    @Setter
    private String phoneNumber;

    @Setter
    @Enumerated(EnumType.STRING)
    private Role role;

    @Setter
    private String department;

    public User() {
    }

}
