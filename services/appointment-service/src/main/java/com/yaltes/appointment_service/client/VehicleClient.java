package com.yaltes.appointment_service.client;

import com.yaltes.appointment_service.dto.Vehicle;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Component
public class VehicleClient {

    private final RestClient restClient;
    private final HttpServletRequest request;

    public VehicleClient(
            @Value("${services.vehicle-service.url}") String baseUrl,
            HttpServletRequest request) {
        this.restClient = RestClient.create(baseUrl);
        this.request = request;
    }

    public Vehicle getVehicleById(Long id) {
        try {
            return applyAuthHeaders(restClient.get().uri("/api/vehicles/{id}", id))
                    .retrieve()
                    .body(Vehicle.class);
        } catch (RestClientResponseException e) {
            if (e.getStatusCode().is4xxClientError()) {
                return null;
            }
            throw e;
        }
    }

    public List<Vehicle> getAllVehicles() {
        try {
            List<Vehicle> vehicles = applyAuthHeaders(restClient.get().uri("/api/vehicles"))
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Vehicle>>() {
                    });
            return vehicles != null ? vehicles : List.of();
        } catch (RestClientResponseException e) {
            return List.of();
        }
    }

    private RestClient.RequestHeadersSpec<?> applyAuthHeaders(RestClient.RequestHeadersSpec<?> spec) {
        String userId = request.getHeader("X-User-Id");
        String userRole = request.getHeader("X-User-Role");

        if (userId != null) {
            spec = spec.header("X-User-Id", userId);
        }
        if (userRole != null) {
            spec = spec.header("X-User-Role", userRole);
        }
        return spec;
    }
}