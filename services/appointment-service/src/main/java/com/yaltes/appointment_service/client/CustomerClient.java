package com.yaltes.appointment_service.client;

import com.yaltes.appointment_service.dto.Customer;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class CustomerClient {

    private final RestClient restClient;
    private final HttpServletRequest request;

    public CustomerClient(
            @Value("${services.identity-service.url}") String baseUrl,
            HttpServletRequest request) {

        this.restClient = RestClient.create(baseUrl);
        this.request = request;
    }

    public Customer getCustomerById(Long id) {
        try {
            IdentityApiResponse<Customer> response = restClient.get()
                    .uri("/api/users/{id}", id)
                    .header("X-User-Id", request.getHeader("X-User-Id"))
                    .header("X-User-Role", request.getHeader("X-User-Role"))
                    .retrieve()
                    .body(new ParameterizedTypeReference<IdentityApiResponse<Customer>>() {
                    });

            return response != null ? response.getData() : null;

        } catch (RestClientResponseException e) {
            if (e.getStatusCode().is4xxClientError()) {
                return null;
            }
            throw e;
        }
    }
}