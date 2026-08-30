package com.yova.vehicle_service;

import com.yova.vehicle_service.component.VehicleValidator;
import com.yova.vehicle_service.dto.VehicleRequest;
import com.yova.vehicle_service.exception.ValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("VehicleValidator Tests")
class VehicleValidatorTest {

    private final VehicleValidator validator = new VehicleValidator();


    @Test
    @DisplayName("Should pass validation and normalize plate for valid vehicle request")
    void validVehicleRequest() {
        VehicleRequest request = new VehicleRequest();
        request.setPlate("41 abö 233"); // valid
        request.setKm(50000);           // valid
        request.setYear(2020);          // valid

        assertDoesNotThrow(() -> validator.normalizeAndValidate(request));
        assertEquals("41ABO233", request.getPlate());
    }

    @Test
    @DisplayName("Should fail when vehicle kilometer is negative")
    void invalidVehicleKmRequest() {
        VehicleRequest request = new VehicleRequest();
        request.setPlate("41ABC233");   // valid
        request.setKm(-100);            // invalid
        request.setYear(2020);          // valid

        ValidationException ex = assertThrows(ValidationException.class,
                () -> validator.normalizeAndValidate(request));

        assertTrue(ex.getErrors().contains("Kilometre 0'dan küçük olamaz: " + request.getKm()));
    }

    @Test
    @DisplayName("Should fail when vehicle plate format is invalid")
    void invalidVehiclePlateRequest() {
        VehicleRequest request = new VehicleRequest();
        request.setPlate("41444222");   // invalid
        request.setKm(50000);           // valid
        request.setYear(2020);          // valid

        ValidationException ex = assertThrows(ValidationException.class,
                () -> validator.normalizeAndValidate(request));

        assertTrue(ex.getErrors().contains("Plaka formatı geçersiz: " + request.getPlate()));
    }

    @Test
    @DisplayName("Should fail when vehicle year is invalid (older than 60 years or greater than current year)")
    void invalidVehicleYearRequest() {
        VehicleRequest request = new VehicleRequest();
        request.setPlate("41ABC233");   // valid
        request.setKm(50000);           // valid
        request.setYear(1965);          // invalid

        ValidationException ex = assertThrows(ValidationException.class,
                () -> validator.normalizeAndValidate(request));

        assertTrue(ex.getErrors().contains("Geçersiz araç yılı: " + request.getYear()));
    }

    @Test
    @DisplayName("Should collect all validation errors when multiple fields are invalid")
    void multipleInvalidFieldsRequest() {
        VehicleRequest request = new VehicleRequest();
        request.setPlate("41444222");   // invalid
        request.setKm(-50);             // invalid
        request.setYear(2023);          // valid

        ValidationException ex = assertThrows(ValidationException.class,
                () -> validator.normalizeAndValidate(request));
        System.out.println("Validation Errors: " + ex.getErrors());
        assertEquals(2, ex.getErrors().size());
    }
}