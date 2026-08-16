package com.yaltes.identity_service.controller;

import com.yaltes.identity_service.dto.ApiResponse;
import com.yaltes.identity_service.dto.LoginUserRequest;
import com.yaltes.identity_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @Value("${jwt.expiration}")
    private long expiration;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginUserRequest request) {
        String token = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(expiration / 1000)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success(null));
    }
}
