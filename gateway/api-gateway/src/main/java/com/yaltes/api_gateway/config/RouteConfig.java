package com.yaltes.api_gateway.config;

import com.yaltes.api_gateway.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;

@Configuration
public class RouteConfig {
    @Value("${identity.service.url}")
    private String identityServiceUrl;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public RouterFunction<ServerResponse> authLoginRoute() {
        return route("auth-login")
                .route(path("/api/auth/login"), http())
                .before(uri(identityServiceUrl))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> identityServiceRoute() {
        return route("identity-service")
                .route(path("/api/users/**"), http())
                .before(uri(identityServiceUrl))
                .filter(jwtAuthenticationFilter.filter())
                .build();
    }
}