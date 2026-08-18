package com.yaltes.api_gateway.filter;

import com.yaltes.api_gateway.dto.ApiResponse;
import com.yaltes.api_gateway.security.JwtValidator;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class JwtAuthenticationFilter {

    private final JwtValidator jwtValidator;

    public JwtAuthenticationFilter(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

    public HandlerFilterFunction<ServerResponse, ServerResponse> filter() {
        return (request, next) -> {
            String token = extractTokenFromCookie(request);

            if (token == null) return ServerResponse.status(401).body(ApiResponse.error("Bu işlemi yapabilmek için giriş yapmanız gerekiyor."));

            try {
                Claims claims = jwtValidator.validateAndExtractClaims(token);

                ServerRequest mutatedRequest = ServerRequest.from(request)
                        .header("X-User-Id", String.valueOf(claims.get("userId")))
                        .header("X-User-Role", String.valueOf(claims.get("role")))
                        .build();

                return next.handle(mutatedRequest);
            } catch (ExpiredJwtException e) {
                return ServerResponse.status(401).body(ApiResponse.error("Oturum süreniz dolmuş, lütfen tekrar giriş yapın."));
            } catch (JwtException e) {
                return ServerResponse.status(401).body(ApiResponse.error("Geçersiz oturum bilgisi, lütfen tekrar giriş yapın."));
            }
        };
    }

    private String extractTokenFromCookie(ServerRequest request) {
        HttpServletRequest servletRequest = request.servletRequest();
        Cookie[] cookies = servletRequest.getCookies();

        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if ("access_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
