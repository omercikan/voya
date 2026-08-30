package com.yova.identity_service.dto;

import com.yova.identity_service.enums.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String department;
    private String password;
}
