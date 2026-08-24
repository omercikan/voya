package com.yaltes.appointment_service.controller;

import com.yaltes.appointment_service.entity.Appointment;
import com.yaltes.appointment_service.entity.AppointmentStatus;
import com.yaltes.appointment_service.repository.AppointmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentControllerTest {

    @Mock
    private AppointmentRepository repository;

    @InjectMocks
    private AppointmentController controller;

    @Test
    void appointment_must_successfully_created() {
        Appointment appointment = new Appointment();
        appointment.setVehicleId(2L);
        appointment.setCustomerId(3L);
        appointment.setDateStart(LocalDate.of(2026, 9, 1));
        appointment.setDateEnd(LocalDate.of(2026, 9, 3));
        appointment.setHourStart(LocalTime.of(9, 0));
        appointment.setHourEnd(LocalTime.of(18, 0));
        appointment.setPurpose("is seyahati");

        when(repository.findOverlapping(any(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(repository.save(appointment)).thenReturn(appointment);
        ResponseEntity<?> response = controller.create(appointment);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(AppointmentStatus.PENDING, appointment.getStatus());
    }

    @Test
    void conflict_if_there_409() {
        Appointment appointment = new Appointment();
        appointment.setVehicleId(2L);
        appointment.setCustomerId(3L);
        appointment.setDateStart(LocalDate.of(2026, 9, 1));
        appointment.setDateEnd(LocalDate.of(2026, 9, 3));
        appointment.setHourStart(LocalTime.of(9, 0));
        appointment.setHourEnd(LocalTime.of(18, 0));
        appointment.setPurpose("is seyahati");
        Appointment mevcutRandevu = new Appointment();
        mevcutRandevu.setId(UUID.randomUUID());

        when(repository.findOverlapping(any(), any(), any())).thenReturn(List.of(mevcutRandevu));
        ResponseEntity<?> response = controller.create(appointment);
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void if_appointment_found_200() {
        Appointment appointment = new Appointment();
        UUID id = UUID.randomUUID();
        appointment.setId(id);

        when(repository.findById(id)).thenReturn(Optional.of(appointment));
        ResponseEntity<Appointment> response = controller.getById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(id, response.getBody().getId());
    }

    @Test
    void if_appointment_not_found_404() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());
        ResponseEntity<Appointment> response = controller.getById(id);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void existing_appointment_must_deleted() {
        UUID id = UUID.randomUUID();

        when(repository.existsById(id)).thenReturn(true);
        ResponseEntity<Void> response = controller.delete(id);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void non_existing_appointment_not_deleted() {
        UUID id = UUID.randomUUID();

        when(repository.existsById(id)).thenReturn(false);
        ResponseEntity<Void> response = controller.delete(id);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}