package com.yaltes.appointment_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private LocalDate dateStart;
    private LocalDate dateEnd;
    private LocalTime hourStart;
    private LocalTime hourEnd;

    private UUID vehicleId;
    private String vehiclePlate;
    private String vehicleBrand;
    private String vehicleModel;
    private Integer vehicleYear;
    private String vehicleGear;
    private Integer vehicleKm;
    private String vehicleFuel;
    private String vehicleLocation;

    private UUID customerId;
    private String customerFullName;
    private String customerNumber;
    private String customerMail;

    private String note;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public LocalDate getDateStart() { return dateStart; }
    public void setDateStart(LocalDate dateStart) { this.dateStart = dateStart; }

    public LocalDate getDateEnd() { return dateEnd; }
    public void setDateEnd(LocalDate dateEnd) { this.dateEnd = dateEnd; }

    public LocalTime getHourStart() { return hourStart; }
    public void setHourStart(LocalTime hourStart) { this.hourStart = hourStart; }

    public LocalTime getHourEnd() { return hourEnd; }
    public void setHourEnd(LocalTime hourEnd) { this.hourEnd = hourEnd; }

    public UUID getVehicleId() { return vehicleId; }
    public void setVehicleId(UUID vehicleId) { this.vehicleId = vehicleId; }

    public String getVehiclePlate() { return vehiclePlate; }
    public void setVehiclePlate(String vehiclePlate) { this.vehiclePlate = vehiclePlate; }

    public String getVehicleBrand() { return vehicleBrand; }
    public void setVehicleBrand(String vehicleBrand) { this.vehicleBrand = vehicleBrand; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public Integer getVehicleYear() { return vehicleYear; }
    public void setVehicleYear(Integer vehicleYear) { this.vehicleYear = vehicleYear; }

    public String getVehicleGear() { return vehicleGear; }
    public void setVehicleGear(String vehicleGear) { this.vehicleGear = vehicleGear; }

    public Integer getVehicleKm() { return vehicleKm; }
    public void setVehicleKm(Integer vehicleKm) { this.vehicleKm = vehicleKm; }

    public String getVehicleFuel() { return vehicleFuel; }
    public void setVehicleFuel(String vehicleFuel) { this.vehicleFuel = vehicleFuel; }

    public String getVehicleLocation() { return vehicleLocation; }
    public void setVehicleLocation(String vehicleLocation) { this.vehicleLocation = vehicleLocation; }

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public String getCustomerFullName() { return customerFullName; }
    public void setCustomerFullName(String customerFullName) { this.customerFullName = customerFullName; }

    public String getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(String customerNumber) { this.customerNumber = customerNumber; }

    public String getCustomerMail() { return customerMail; }
    public void setCustomerMail(String customerMail) { this.customerMail = customerMail; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}