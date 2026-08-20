package com.yaltes.vehicle_service.component;

import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.dto.VehicleResponse;
import com.yaltes.vehicle_service.entity.Vehicle;
import com.yaltes.vehicle_service.enums.AvailabilityStatus;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    // dto -> Entity
    public Vehicle toEntity(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setPlate(request.getPlate());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setGear(request.getGear());
        vehicle.setKm(request.getKm());
        vehicle.setFuel(request.getFuel());
        vehicle.setLocation(request.getLocation());
        vehicle.setStatus(AvailabilityStatus.AVAILABLE);
        return vehicle;
    }

    // Entity -> dto
    public VehicleResponse toResponse(Vehicle vehicle) {
        VehicleResponse response = new VehicleResponse();
        response.setId(vehicle.getId());
        response.setPlate(vehicle.getPlate());
        response.setBrand(vehicle.getBrand());
        response.setModel(vehicle.getModel());
        response.setYear(vehicle.getYear());
        response.setGear(vehicle.getGear());
        response.setKm(vehicle.getKm());
        response.setFuel(vehicle.getFuel());
        response.setLocation(vehicle.getLocation());

        if (vehicle.getStatus() != null) {response.setStatus(vehicle.getStatus());}
        return response;
    }

    // PATCH
    public void updateEntityFromPatch(VehicleRequest patchData, Vehicle existing) {
        if (patchData.getPlate() != null) existing.setPlate(patchData.getPlate());
        if (patchData.getBrand() != null) existing.setBrand(patchData.getBrand());
        if (patchData.getModel() != null) existing.setModel(patchData.getModel());
        if (patchData.getYear() != null) existing.setYear(patchData.getYear());
        if (patchData.getGear() != null) existing.setGear(patchData.getGear());
        if (patchData.getKm() != null) existing.setKm(patchData.getKm());
        if (patchData.getFuel() != null) existing.setFuel(patchData.getFuel());
        if (patchData.getLocation() != null) existing.setLocation(patchData.getLocation());
    }
}