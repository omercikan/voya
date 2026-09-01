package com.voya.identity_service.service;

import com.voya.identity_service.dto.CreateUserRequest;
import com.voya.identity_service.dto.UserResponse;
import com.voya.identity_service.entity.User;
import com.voya.identity_service.enums.Role;
import com.voya.identity_service.enums.Status;
import com.voya.identity_service.exception.EmailAlreadyExistsException;
import com.voya.identity_service.exception.UnauthorizedUserException;
import com.voya.identity_service.mapper.UserMapper;
import com.voya.identity_service.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    private static final String RAW_PASSWORD = "Xq7!mP92#vL4";
    private static final String ENCODED_PASSWORD =
            "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    UserMapper userMapper;

    @InjectMocks
    UserService userService;

    @Test
    @DisplayName("Should create user successfully when role is ADMIN")
    void shouldCreateUserWhenRoleIsAdmin() {
        // GIVEN
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("random.user8472@example.com");
        request.setFullName("Ömer Çıkan");
        request.setPassword(RAW_PASSWORD);

        User mappedUser = new User();
        mappedUser.setEmail(request.getEmail());
        mappedUser.setPassword(ENCODED_PASSWORD);
        mappedUser.setStatus(Status.ACTIVE);

        User savedUser = new User();
        savedUser.setId(8472L);
        savedUser.setEmail(request.getEmail());
        savedUser.setPassword(ENCODED_PASSWORD);

        UserResponse expectedResponse = new UserResponse();
        expectedResponse.setId(8472L);
        expectedResponse.setEmail(request.getEmail());

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn(ENCODED_PASSWORD);
        when(userMapper.toEntity(request, ENCODED_PASSWORD))
                .thenReturn(mappedUser);
        when(userRepository.save(mappedUser))
                .thenReturn(savedUser);
        when(userMapper.toResponse(savedUser))
                .thenReturn(expectedResponse);

        // WHEN
        UserResponse result = userService.createUser(request, Role.ADMIN);

        // THEN
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(request.getEmail());
        verify(userRepository).save(mappedUser);
    }

    @Test
    @DisplayName("Should throw UnauthorizedUserException when role is not ADMIN")
    void shouldNotCreateUserWhenRoleIsNotAdmin() {
        // GIVEN
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("another.random5291@example.com");
        request.setPassword(RAW_PASSWORD);
        request.setFullName("Ömer Çıkan");

        // WHEN & THEN
        assertThatThrownBy(() -> userService.createUser(request, Role.EMPLOYEE))
                .isInstanceOf(UnauthorizedUserException.class)
                .hasMessage("Bu işlemi yapacak yetkiniz yok!");
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException when email already exists")
    void shouldNotCreateUserWhenRoleIsAdminAndEmailAlreadyExists() {
        // GIVEN
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("random.user8472@example.com");
        request.setFullName("Ömer Çıkan");
        request.setPassword(RAW_PASSWORD);

        // WHEN & THEN
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(request, Role.ADMIN))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessage("Email adresi zaten var!");

        verify(userRepository).existsByEmail(request.getEmail());
        verifyNoInteractions(passwordEncoder, userMapper);
    }
}