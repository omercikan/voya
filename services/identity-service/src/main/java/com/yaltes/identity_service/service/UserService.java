package com.yaltes.identity_service.service;

import com.yaltes.identity_service.dto.CreateUserRequest;
import com.yaltes.identity_service.dto.UpdateUserRequest;
import com.yaltes.identity_service.dto.UserResponse;
import com.yaltes.identity_service.entity.User;
import com.yaltes.identity_service.enums.Role;
import com.yaltes.identity_service.exception.EmailAlreadyExistsException;
import com.yaltes.identity_service.exception.UnauthorizedUserException;
import com.yaltes.identity_service.exception.UserNotFoundException;
import com.yaltes.identity_service.mapper.UserMapper;
import com.yaltes.identity_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserResponse createUser(CreateUserRequest request, Role role) {
        if (!role.equals(Role.ADMIN)) {
            throw new UnauthorizedUserException("Bu işlemi yapacak yetkiniz yok!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email adresi zaten var!");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = userMapper.toEntity(request, hashedPassword);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    public UserResponse updateUser(
            Long targetId,
            UpdateUserRequest request,
            Long callerId,
            Role callerRole) {
        boolean isSelf = callerId.equals(targetId);
        boolean isAdmin = callerRole.equals(Role.ADMIN);

        if (!isSelf && !isAdmin) {
            throw new UnauthorizedUserException("Bu kullanıcıyı güncelleme yetkiniz yok.");
        }

        User user = userRepository.findById(targetId).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException("Bu email adresi zaten kullanılıyor.");
            }

            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (isAdmin) {
                throw new UnauthorizedUserException("Şifre değiştirme yetkiniz yok.");
            }

            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }
}
