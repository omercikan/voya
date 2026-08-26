package com.yaltes.appointment_service.client;

import com.yaltes.appointment_service.dto.Vehicle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Component
public class VehicleClient {

    private final RestClient restClient;

    public VehicleClient(@Value("${services.vehicle-service.url}") String baseUrl) {
        this.restClient = RestClient.create(baseUrl);
    }

    public Vehicle getVehicleById(Long id) {
        try {
            return restClient.get()
                    .uri("/api/vehicles/{id}", id)
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
        return restClient.get()
                .uri("/api/vehicles")
                .retrieve()
                .body(new ParameterizedTypeReference<List<Vehicle>>() {
                });
    }
}