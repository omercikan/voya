package com.yova.identity_service.dto;

import com.yova.identity_service.enums.Role;
import com.yova.identity_service.enums.Status;
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
