package com.yaltes.vehicle_service.controller;

import com.yaltes.vehicle_service.entity.Vehicle;
import com.yaltes.vehicle_service.repository.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    // POST
    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }
    // GET
    @GetMapping
    public List<Vehicle> findAll(){ return vehicleRepository.findAll(); }
    // PATCH
    @PatchMapping
    public Vehicle update(@RequestBody Vehicle vehicle) {return vehicleRepository.save(vehicle); }
    // DELETE
    @DeleteMapping
    public void delete(@RequestBody Vehicle vehicle) {}

}