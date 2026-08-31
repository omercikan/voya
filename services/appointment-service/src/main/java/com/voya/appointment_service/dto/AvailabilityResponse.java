package com.voya.appointment_service.dto;

import java.util.List;

public class AvailabilityResponse {
    private DateRange Range;
    private int totalVehicles;
    private List<DayAvailability> days;

    public DateRange getRange() {
        return Range;
    }

    public void setRange(DateRange range) {
        this.Range = range;
    }

    public int getTotalVehicles() {
        return totalVehicles;
    }

    public void setTotalVehicles(int totalVehicles) {
        this.totalVehicles = totalVehicles;
    }

    public List<DayAvailability> getDays() {
        return days;
    }

    public void setDays(List<DayAvailability> days) {
        this.days = days;
    }
}
