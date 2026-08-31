package com.voya.appointment_service.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @NotNull(message = "dateStart zorunludur")
    @Column(name = "date_start")
    private LocalDate dateStart;

    @NotNull(message = "dateEnd zorunludur")
    @Column(name = "date_end")
    private LocalDate dateEnd;

    @NotNull(message = "hourStart zorunludur")
    @Column(name = "hour_start")
    private LocalTime hourStart;

    @NotNull(message = "hourEnd zorunludur")
    @Column(name = "hour_end")
    private LocalTime hourEnd;

    @NotNull(message = "vehicleId zorunludur")
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @NotNull(message = "customerId zorunludur")
    @Column(name = "customer_id")
    private Long customerId;

    @NotBlank(message = "purpose zorunludur")
    @Size(max = 500, message = "purpose en fazla 500 karakter olabilir")
    @Column(name = "purpose")
    private String purpose;

    @Size(max = 500, message = "note en fazla 500 karakter olabilir")
    @Column(name = "note")
    private String note;

    @Column(name = "reject_note")
    private String rejectNote;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }

    public void setDateStart(LocalDate dateStart) {
        this.dateStart = dateStart;
    }

    public LocalDate getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
    }

    public LocalTime getHourStart() {
        return hourStart;
    }

    public void setHourStart(LocalTime hourStart) {
        this.hourStart = hourStart;
    }

    public LocalTime getHourEnd() {
        return hourEnd;
    }

    public void setHourEnd(LocalTime hourEnd) {
        this.hourEnd = hourEnd;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getRejectNote() {
        return rejectNote;
    }

    public void setRejectNote(String rejectNote) {
        this.rejectNote = rejectNote;
    }
}