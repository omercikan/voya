package com.yaltes.vehicle_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidKilometerException.class)
    public ResponseEntity<ErrorResponse> handleInvalidKilometerException(InvalidKilometerException e) {

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(), // HTTP 400 (km<=0) -> olamaz!
                "Bad Request",e.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Genel hata ayıklayıcı
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        ErrorResponse response = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(), // HTTP 500
                "Internal Server Error", "Sunucuda beklenmeyen bir hata oluştu."
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
