package com.yaltes.vehicle_service.component;

import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class VehicleValidator {

    public void normalizeAndValidate(VehicleRequest request) {
        Map<String,String> errors = new HashMap<>();

        normalizePlate(request);

        validatePlateFormat(request.getPlate(), errors);
        validateKm(request.getKm(), errors);
        validateYear(request.getYear(), errors);

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }

    // Plate normalizer
    private void normalizePlate(VehicleRequest request) {
        if (request.getPlate() != null) {
            String normalized = request.getPlate()
                    .replaceAll("\\s+", "").toUpperCase(Locale.ENGLISH)
                    .replace('Ç', 'C')
                    .replace('Ğ', 'G')
                    .replace('İ', 'I')
                    .replace('Ö', 'O')
                    .replace('Ş', 'S')
                    .replace('Ü', 'U');
            request.setPlate(normalized);
        }
    }

    // Plate exception catcher
    private void validatePlateFormat(String plate, Map<String,String> errors) {
        if (plate != null && !plate.matches("^\\d{2}[A-Z]{1,3}\\d{2,4}$")) {
            errors.put("plate","Plaka formatı geçersiz: " + plate);
        }
    }

    // Kilometer exception catcher
    private void validateKm(Integer km, Map<String,String> errors) {
        if (km != null && km <= 0) {
            errors.put("km","Kilometre 0'dan küçük olamaz: " + km);
        }
    }

    // Year exception catcher
    private void validateYear(Integer year, Map<String,String> errors) {
        int currentYear = LocalDate.now().getYear();
        if (year != null && (year < 1950 || year > currentYear)) {
            errors.put("year","Geçersiz araç yılı: " + year);
        }
    }

}
