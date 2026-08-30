package com.yova.identity_service.mapper;

import com.yova.identity_service.dto.CreateUserRequest;
import com.yova.identity_service.dto.UserResponse;
import com.yova.identity_service.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(CreateUserRequest request, String hashedPassword) {
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());

        return user;
    }

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setDepartment(user.getDepartment());
        response.setStatus(user.getStatus());

        return response;
    }
}
