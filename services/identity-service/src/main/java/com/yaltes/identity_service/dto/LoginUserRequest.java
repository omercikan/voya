package com.yaltes.identity_service.dto;

import lombok.Data;

@Data
public class LoginUserRequest {
    private String email;
    private String password;
}
