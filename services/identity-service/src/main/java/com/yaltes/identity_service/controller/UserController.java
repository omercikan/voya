package com.yaltes.identity_service.controller;

import com.yaltes.identity_service.dto.ApiResponse;
import com.yaltes.identity_service.dto.CreateUserRequest;
import com.yaltes.identity_service.dto.UpdateUserRequest;
import com.yaltes.identity_service.dto.UserResponse;
import com.yaltes.identity_service.enums.Role;
import com.yaltes.identity_service.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@RequestBody CreateUserRequest request, @RequestHeader(value = "X-User-Role", required = false) Role userRole) {
        UserResponse user = userService.createUser(request, userRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @RequestHeader(value = "X-User-Id") long callerId,
            @RequestHeader(value = "X-User-Role") Role callerRole) {
        UserResponse updatedUser = userService.updateUser(id, request, callerId, callerRole);
        return ResponseEntity.ok().body(ApiResponse.success(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role") Role userRole,
            @RequestHeader(value = "X-User-Id") Long callerId
    ) {
        userService.deleteUser(id, userRole, callerId);
        return ResponseEntity.noContent().build();
    }
}
