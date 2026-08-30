package com.yova.vehicle_service.service;

import com.yova.vehicle_service.component.VehicleMapper;
import com.yova.vehicle_service.component.VehicleValidator;
import com.yova.vehicle_service.dto.VehicleRequest;
import com.yova.vehicle_service.dto.VehicleResponse;
import com.yova.vehicle_service.entity.Vehicle;
import com.yova.vehicle_service.enums.AvailabilityStatus;
import com.yova.vehicle_service.exception.ResourceNotFoundException;
import com.yova.vehicle_service.exception.ValidationException;
import com.yova.vehicle_service.repository.VehicleRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository repository;
    private final VehicleValidator validator;
    private final VehicleMapper mapper;

    public VehicleService(VehicleRepository repository, VehicleValidator validator, VehicleMapper mapper) {
        this.repository = repository;
        this.validator = validator;
        this.mapper = mapper;
    }

    // Create
    @PreAuthorize("hasAuthority('ADMIN')")
    public VehicleResponse createVehicle(VehicleRequest request) {

        validator.normalizeAndValidate(request);

        if (repository.existsByPlate(request.getPlate())) {
            throw new ValidationException(List.of("Bu plaka zaten kayıtlı: " + request.getPlate()));
        }

        Vehicle vehicle = mapper.toEntity(request);
        Vehicle savedVehicle = repository.save(vehicle);
        return mapper.toResponse(savedVehicle);
    }

    // Get
    public List<VehicleResponse> getAllVehicles() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    // Patch
    @PreAuthorize("hasAuthority('ADMIN')")
    public Optional<VehicleResponse> updateVehicle(Long id, VehicleRequest patchData) {
        return repository.findById(id).map(existing -> {
            validator.normalizeAndValidate(patchData);

            if (patchData.getPlate() != null && !patchData.getPlate().equals(existing.getPlate())) {
                if (repository.existsByPlate(patchData.getPlate())) {
                    throw new ValidationException(List.of("Bu plaka başka bir araca kayıtlı!"));
                }
            }

            validateKmNotDecreasing(existing, patchData);

            mapper.updateEntityFromPatch(patchData, existing);
            return mapper.toResponse(repository.save(existing));
        });
    }

    // Patch (Status)
    @PreAuthorize("hasAuthority('ADMIN')")
    public VehicleResponse updateVehicleStatus(Long id, AvailabilityStatus newStatus) {
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setStatus(newStatus);
        Vehicle savedVehicle = repository.save(vehicle);

        return mapper.toResponse(savedVehicle);
    }

    // Patch (User)
    public Optional<VehicleResponse> updateKmAndLocation(Long id, VehicleRequest patchData) {
        return repository.findById(id).map(existing -> {

            validateKmNotDecreasing(existing, patchData);

            if (patchData.getKm() != null) {
                existing.setKm(patchData.getKm());
            }

            if (patchData.getLocation() != null) {
                existing.setLocation(patchData.getLocation());
            }

            return mapper.toResponse(repository.save(existing));
        });
    }

    // Delete
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteVehicle(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found with id: " + id);
        }
        repository.deleteById(id);
    }

    // Kilometer can't be decreased (updateVehicle and updateKmAndLocation)
    private void validateKmNotDecreasing(Vehicle existing, VehicleRequest patchData) {
        if (patchData.getKm() != null && patchData.getKm() < existing.getKm()) {
            throw new ValidationException(
                    "Kilometre azaltılamaz. Mevcut: " + existing.getKm() +
                            ", gönderilen: " + patchData.getKm()
            );
        }
    }
}