package com.yaltes.vehicle_service.controller;

import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.dto.VehicleResponse;
import com.yaltes.vehicle_service.enums.AvailabilityStatus;
import com.yaltes.vehicle_service.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // POST /api/vehicles
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> createVehicle(@RequestBody VehicleRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED); // HTTP 201
    }

    // GET /api/vehicles
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles()); // HTTP 200
    }

    // GET /api/vehicles/{id}
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    // PATCH /api/vehicles/{id}
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable Long id, @RequestBody VehicleRequest request) {
        return vehicleService.updateVehicle(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/vehicles/{id}/status
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> updateVehicleStatus(
            @PathVariable Long id,
            @RequestParam AvailabilityStatus status) {

        VehicleResponse updatedVehicle = vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok(updatedVehicle);
    }

    // PATCH /api/vehicles/{id}/km-location
    @PatchMapping("/{id}/km-location")
    public ResponseEntity<VehicleResponse> updateKmAndLocation(@PathVariable Long id, @RequestBody VehicleRequest patchData) {
        return vehicleService.updateKmAndLocation(id, patchData)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/vehicles/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        boolean deleted = vehicleService.deleteVehicle(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // HTTP 204
        }
        return ResponseEntity.notFound().build(); // HTTP 404
    }
}