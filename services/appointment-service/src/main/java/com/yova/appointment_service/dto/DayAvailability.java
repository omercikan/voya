package com.yova.appointment_service.dto;

import java.time.LocalDate;
import java.util.List;

public class DayAvailability {
    private LocalDate date;
    private String status;
    private int minFreeVehicles;
    private List<HourSlot> hourly;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getMinFreeVehicles() {
        return minFreeVehicles;
    }

    public void setMinFreeVehicles(int minFreeVehicles) {
        this.minFreeVehicles = minFreeVehicles;
    }

    public List<HourSlot> getHourly() {
        return hourly;
    }

    public void setHourly(List<HourSlot> hourly) {
        this.hourly = hourly;
    }
}
