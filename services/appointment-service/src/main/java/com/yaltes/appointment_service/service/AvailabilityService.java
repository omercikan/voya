package com.yaltes.appointment_service.service;

import com.yaltes.appointment_service.client.VehicleClient;
import com.yaltes.appointment_service.dto.*;
import com.yaltes.appointment_service.entity.Appointment;
import com.yaltes.appointment_service.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class AvailabilityService {

    private static final List<String> HOUR_SLOTS = List.of(
            "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
            "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    );

    private final AppointmentRepository repository;
    private final VehicleClient vehicleClient;

    public AvailabilityService(AppointmentRepository repository, VehicleClient vehicleClient) {
        this.repository = repository;
        this.vehicleClient = vehicleClient;
    }

    public AvailabilityResponse getAvailability(LocalDate from, LocalDate to) {
        int totalVehicles = vehicleClient.getAllVehicles().size();
        List<Appointment> activeAppointments = repository.findActiveInRange(from, to);

        List<DayAvailability> days = new ArrayList<>();
        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            days.add(buildDayAvailability(date, activeAppointments, totalVehicles));
        }

        AvailabilityResponse response = new AvailabilityResponse();
        response.setRange(new DateRange(from, to));
        response.setTotalVehicles(totalVehicles);
        response.setDays(days);
        return response;
    }

    private DayAvailability buildDayAvailability(LocalDate date, List<Appointment> appointments, int totalVehicles) {
        List<HourSlot> hourly = new ArrayList<>();
        int minFree = totalVehicles;

        for (String slot : HOUR_SLOTS) {
            LocalTime slotStart = LocalTime.parse(slot.split("-")[0]);
            LocalTime slotEnd = LocalTime.parse(slot.split("-")[1]);

            Set<Long> busyVehicleIds = new HashSet<>();
            for (Appointment appointment : appointments) {
                if (isVehicleBusy(appointment, date, slotStart, slotEnd)) {
                    busyVehicleIds.add(appointment.getVehicleId());
                }
            }

            int free = totalVehicles - busyVehicleIds.size();
            hourly.add(new HourSlot(slot, free));
            minFree = Math.min(minFree, free);
        }

        DayAvailability day = new DayAvailability();
        day.setDate(date);
        day.setMinFreeVehicles(minFree);
        day.setHourly(hourly);

        boolean allFull = hourly.stream().allMatch(h -> h.getFree() == 0);
        if (allFull) {
            day.setStatus("full");
        } else if (minFree == 0) {
            day.setStatus("limited");
        } else {
            day.setStatus("available");
        }

        return day;
    }

    private boolean isVehicleBusy(Appointment appointment, LocalDate date, LocalTime slotStart, LocalTime slotEnd) {
        if (date.isBefore(appointment.getDateStart()) || date.isAfter(appointment.getDateEnd())) {
            return false;
        }

        LocalTime busyFrom = date.isEqual(appointment.getDateStart()) ? appointment.getHourStart() : LocalTime.MIN;
        LocalTime busyTo = date.isEqual(appointment.getDateEnd()) ? appointment.getHourEnd() : LocalTime.MAX;

        return busyFrom.isBefore(slotEnd) && busyTo.isAfter(slotStart);
    }
}