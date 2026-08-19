package com.yaltes.vehicle_service.component;

import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
public class VehicleValidator {

    public void normalizeAndValidate(VehicleRequest request) {
        List<String> errors = new ArrayList<>();

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
    private void validatePlateFormat(String plate, List<String> errors) {
        if (plate != null && !plate.matches("^\\d{2}[A-Z]{1,3}\\d{2,4}$")) {
            errors.add("Plaka formatı geçersiz: " + plate);
        }
    }

    // Kilometer exception catcher
    private void validateKm(Integer km, List<String> errors) {
        if (km != null && km < 0) {
            errors.add("Kilometre 0'dan küçük olamaz: " + km);
        }
    }

    // Year exception catcher
    private void validateYear(Integer year, List<String> errors) {
        if (year != null && (year < 1900 || year > 2027)) {
            errors.add("Geçersiz araç yılı: " + year);
        }
    }

}
