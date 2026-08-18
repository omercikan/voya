package com.yaltes.appointment_service.dto;

public class ApiResponse {
    private final String message;
    private final boolean success;

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public boolean isSuccess() {
        return success;
    }
}