package com.yaltes.identity_service.service;

import com.yaltes.identity_service.dto.CreateUserRequest;
import com.yaltes.identity_service.dto.UpdateUserRequest;
import com.yaltes.identity_service.dto.UserResponse;
import com.yaltes.identity_service.entity.User;
import com.yaltes.identity_service.enums.Role;
import com.yaltes.identity_service.enums.Status;
import com.yaltes.identity_service.exception.EmailAlreadyExistsException;
import com.yaltes.identity_service.exception.UnauthorizedUserException;
import com.yaltes.identity_service.exception.UserNotFoundException;
import com.yaltes.identity_service.mapper.UserMapper;
import com.yaltes.identity_service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı!"));
        return userMapper.toResponse(user);
    }

    public List<UserResponse> getUsers(Role callerRole) {
        if (callerRole != Role.ADMIN) {
            throw new UnauthorizedUserException(
                    "Bu işlemi yapabilecek yetkiye sahip değilsiniz!"
            );
        }

        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
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

    public void deleteUser(Long targetId, Role callerRole, Long callerId) {
        if (!callerRole.equals(Role.ADMIN)) {
            throw new UnauthorizedUserException("Bu kullanıcıyı silme yetkiniz yok!");
        }

        if (callerId.equals(targetId)) {
            throw new UnauthorizedUserException("Kendi hesabınızı silemezsiniz.");
        }

        User user = userRepository.findById(targetId).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));

        userRepository.delete(user);
    }

    public void updateStatus(Long id, Role callerRole, Status status) {
        if (!callerRole.equals(Role.ADMIN)) {
            throw new UnauthorizedUserException("Bu işlemi yapabilecek yetkiye sahip değilsiniz!");
        }

        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı."));
        user.setStatus(status);

        userRepository.save(user);
    }
}
