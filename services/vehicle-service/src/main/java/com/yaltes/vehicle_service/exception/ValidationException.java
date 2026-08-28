package com.yaltes.vehicle_service.exception;

import java.util.List;

public class ValidationException extends RuntimeException {

    private List<String> errors;
    private String error;

    public ValidationException(List<String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public ValidationException(String error) {
        super("Validation failed");
        this.error = error;
    }

    public List<String> getErrors() {return errors;}
    public String getError() {return error;}
}
