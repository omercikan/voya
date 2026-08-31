package com.voya.identity_service.dto;

import com.voya.identity_service.enums.Role;
import com.voya.identity_service.enums.Status;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String department;
    private Status status;
}
