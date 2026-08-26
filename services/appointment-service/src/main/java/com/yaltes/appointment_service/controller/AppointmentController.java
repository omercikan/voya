package com.yaltes.appointment_service.controller;

import com.yaltes.appointment_service.client.CustomerClient;
import com.yaltes.appointment_service.client.VehicleClient;
import com.yaltes.appointment_service.dto.ApiResponse;
import com.yaltes.appointment_service.dto.AppointmentResponse;
import com.yaltes.appointment_service.dto.AvailabilityResponse;
import com.yaltes.appointment_service.dto.Vehicle;
import com.yaltes.appointment_service.entity.Appointment;
import com.yaltes.appointment_service.entity.AppointmentStatus;
import com.yaltes.appointment_service.repository.AppointmentRepository;
import com.yaltes.appointment_service.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.data.repository.support.Repositories;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository repository;
    private final VehicleClient vehicleClient;
    private final CustomerClient customerClient;
    private final AvailabilityService availabilityService;

    public AppointmentController(AppointmentRepository repository,
                                 VehicleClient vehicleClient,
                                 CustomerClient customerClient,
                                 AvailabilityService availabilityService) {
        this.repository = repository;
        this.vehicleClient = vehicleClient;
        this.customerClient = customerClient;
        this.availabilityService = availabilityService;
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

        boolean realConflict = overlapping.stream()
                .anyMatch(existing -> actuallyOverlaps(existing, appointment));

        if (realConflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(true, "Bu arac, secilen tarih araliginda baska bir randevuya sahip"));
        }

        Appointment saved = repository.save(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", saved, "succes", true));
    }

    @GetMapping("/vehicle/{vehicleId}/busy")
    public List<Appointment> getBusyDatesForVehicle(@PathVariable Long vehicleId) {
        return repository.findByVehicleIdAndStatusNot(vehicleId, AppointmentStatus.CANCELLED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(this::toResponse).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<AppointmentResponse> getAll(@RequestParam(required = false) AppointmentStatus status) {
        List<Appointment> appointments = (status != null)
                ? repository.findByStatus(status)
                : repository.findAll();

        return appointments.stream()
                .map(this::toResponse)
                .toList();
    }

    // GET /appointments/me
    @GetMapping("/me")
    public List<AppointmentResponse> getMyAppointments(@RequestHeader("X-User-Id") Long userId) {
        return repository.findByCustomerId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/availability")
    public AvailabilityResponse getAvailability(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
    ) {
        return availabilityService.getAvailability(from, to);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Appointment> updateStatus(@PathVariable UUID id, @RequestParam AppointmentStatus status) {
        return repository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(status);
                    return ResponseEntity.ok(repository.save(appointment));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setStatus(appointment.getStatus());
        response.setDateStart(appointment.getDateStart());
        response.setDateEnd(appointment.getDateEnd());
        response.setHourStart(appointment.getHourStart());
        response.setHourEnd(appointment.getHourEnd());
        response.setPurpose(appointment.getPurpose());
        response.setNote(appointment.getNote());
        response.setVehicle(vehicleClient.getVehicleById(appointment.getVehicleId()));
        response.setCustomer(customerClient.getCustomerById(appointment.getCustomerId()));
        return response;
    }

    private boolean actuallyOverlaps(Appointment existing, Appointment newAppointment) {
        LocalDateTime existingStart = LocalDateTime.of(existing.getDateStart(), existing.getHourStart());
        LocalDateTime existingEnd = LocalDateTime.of(existing.getDateEnd(), existing.getHourEnd());
        LocalDateTime newStart = LocalDateTime.of(newAppointment.getDateStart(), newAppointment.getHourStart());
        LocalDateTime newEnd = LocalDateTime.of(newAppointment.getDateEnd(), newAppointment.getHourEnd());

        return existingStart.isBefore(newEnd) && existingEnd.isAfter(newStart);
    }
}