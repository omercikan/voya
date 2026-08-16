package com.yaltes.identity_service.service;

import com.yaltes.identity_service.dto.LoginUserRequest;
import com.yaltes.identity_service.entity.User;
import com.yaltes.identity_service.exception.UserNotFoundException;
import com.yaltes.identity_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String login(LoginUserRequest request) {
        // 1.) Search the database for the entered email address.
        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isEmpty()) throw new UserNotFoundException("Kullanıcı adı veya şifre hatalı!");

        // 2.) Compare the entered password with the password in the database.
        String inputPassword = request.getPassword();
        String savedPassword = user.get().getPassword();

        boolean isMatchesPassword = passwordEncoder.matches(inputPassword, savedPassword);

        if (!isMatchesPassword) throw new UserNotFoundException("Kullanıcı adı veya şifre hatalı!");

        // 3.) Generate a JWT token.
        return jwtService.generateToken(
                user.get().getEmail(),
                user.get().getId(),
                user.get().getRole().name()
        );
    }
}
