package com.yaltes.appointment_service.controller;

import com.yaltes.appointment_service.dto.ApiResponse;
import com.yaltes.appointment_service.entity.Appointment;
import com.yaltes.appointment_service.entity.AppointmentStatus;
import com.yaltes.appointment_service.repository.AppointmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }


    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus(AppointmentStatus.PENDING);
        }

        List<Appointment> overlapping = repository.findOverlapping(
                appointment.getVehicleId(),
                appointment.getDateStart(),
                appointment.getDateEnd());

        if (!overlapping.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(true, "Bu arac, secilen tarih araliginda baska bir randevuya sahip"));
        }

        Appointment saved = repository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", saved, "succes", true));
    }

    @GetMapping("/vehicle/{vehicleId}/busy")
    public List<Appointment> getBusyDatesForVehicle(@PathVariable UUID vehicleId) {
        return repository.findByVehicleIdAndStatusNot(vehicleId, AppointmentStatus.CANCELLED);
    }

    @GetMapping
    public List<Appointment> getAll() {
        return repository.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(appointment -> ResponseEntity.ok(appointment))
                .orElse(ResponseEntity.notFound().build());
    }


    @PatchMapping("/{id}")
    public ResponseEntity<Appointment> updateStatus(@PathVariable UUID id, @RequestParam AppointmentStatus status) {

        return repository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return ResponseEntity.ok(repository.save(appointment));
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}