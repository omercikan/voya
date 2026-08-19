package com.yaltes.vehicle_service.service;

import com.yaltes.vehicle_service.component.VehicleMapper;
import com.yaltes.vehicle_service.component.VehicleValidator;
import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.dto.VehicleResponse;
import com.yaltes.vehicle_service.entity.Vehicle;
import com.yaltes.vehicle_service.exception.RoleException;
import com.yaltes.vehicle_service.exception.ValidationException;
import com.yaltes.vehicle_service.repository.VehicleRepository;
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
    public VehicleResponse createVehicle(VehicleRequest request,String userRole) {

        if(!userRole.equals("ADMIN")) {
            throw new RoleException("Geçersiz rol.");
        }

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

    public Optional<VehicleResponse> getVehicle(Long id) {
        return repository.findById(id).map(mapper::toResponse);
    }

    // Patch
    public Optional<VehicleResponse> updateVehicle(Long id, VehicleRequest patchData) {
        return repository.findById(id).map(existing -> {
            validator.normalizeAndValidate(patchData);

            if (patchData.getPlate() != null && !patchData.getPlate().equals(existing.getPlate())) {
                if (repository.existsByPlate(patchData.getPlate())) {
                    throw new ValidationException(List.of("Bu plaka başka bir araca kayıtlı!"));
                }
            }

            mapper.updateEntityFromPatch(patchData, existing);
            return mapper.toResponse(repository.save(existing));
        });
    }

    // Delete
    public boolean deleteVehicle(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
}