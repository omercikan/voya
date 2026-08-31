package com.voya.appointment_service.dto;

public class HourSlot {
    private String time;
    private int free;

    public HourSlot() {
    }

    public HourSlot(String time, int free) {
        this.time = time;
        this.free = free;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getFree() {
        return free;
    }

    public void setFree(int free) {
        this.free = free;
    }
}