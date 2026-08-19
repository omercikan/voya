package com.yaltes.vehicle_service.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private boolean success;
    private Map<String,String> errors;

    public ErrorResponse(int status, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.success = false;
    }

    public ErrorResponse(int status, Map<String,String> errors, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.errors = errors;
        this.message = message;
        this.success = false;
    }

    // Getters (No need for setter cause of constructor)
    public LocalDateTime getTimestamp() {return timestamp;}
    public int getStatus() {return status;}
    public Map<String,String> getErrors() {return errors;}
    public String getMessage() {return message;}
    public boolean isSuccess() {return success;}
}
