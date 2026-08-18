package com.yaltes.identity_service.dto;

import com.yaltes.identity_service.enums.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String department;
}
