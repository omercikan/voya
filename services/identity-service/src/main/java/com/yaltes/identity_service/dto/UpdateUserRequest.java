package com.yaltes.identity_service.dto;

import com.yaltes.identity_service.enums.Role;

public class UpdateUserRequest {

    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private String department;
}
