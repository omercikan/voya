package com.yaltes.vehicle_service;

import com.yaltes.vehicle_service.component.VehicleMapper;
import com.yaltes.vehicle_service.component.VehicleValidator;
import com.yaltes.vehicle_service.dto.VehicleRequest;
import com.yaltes.vehicle_service.dto.VehicleResponse;
import com.yaltes.vehicle_service.entity.Vehicle;
import com.yaltes.vehicle_service.enums.AvailabilityStatus;
import com.yaltes.vehicle_service.exception.ResourceNotFoundException;
import com.yaltes.vehicle_service.exception.ValidationException;
import com.yaltes.vehicle_service.repository.VehicleRepository;
import com.yaltes.vehicle_service.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("VehicleService Tests")
class VehicleServiceTest {

    @Mock
    private VehicleRepository repository;

    @Mock
    private VehicleMapper mapper;

    @Mock
    private VehicleValidator validator;

    @InjectMocks
    private VehicleService service;

    private VehicleRequest request;
    private Vehicle entity;
    private VehicleResponse response;

    @BeforeEach
    void setUp() {
        request = new VehicleRequest();
        request.setPlate("41ABO233");
        request.setKm(50000);
        request.setYear(2020);

        entity = new Vehicle();
        ReflectionTestUtils.setField(entity, "id", 1L);
        entity.setPlate("41ABO233");
        entity.setKm(50000);
        entity.setYear(2020);
        entity.setStatus(AvailabilityStatus.AVAILABLE);

        response = new VehicleResponse();
        ReflectionTestUtils.setField(response, "id", 1L);
        response.setPlate("41ABO233");
        response.setKm(50000);
        response.setYear(2020);
        response.setStatus(AvailabilityStatus.AVAILABLE);
    }

    // Create
    @Test
    @DisplayName("Should create vehicle successfully with valid data")
    void shouldCreateVehicleSuccessfully() {
        when(repository.existsByPlate(request.getPlate())).thenReturn(false);
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(entity)).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        VehicleResponse result = service.createVehicle(request);

        assertNotNull(result);
        verify(validator).normalizeAndValidate(request);
        verify(repository).save(entity);
    }

    // Get
    @Test
    @DisplayName("Should return list of vehicle responses when vehicles exist")
    void getAllVehicles() {
        List<Vehicle> entities = List.of(entity);
        List<VehicleResponse> expectedResponses = List.of(response);

        when(repository.findAll()).thenReturn(entities);
        when(mapper.toResponse(entity)).thenReturn(response);

        List<VehicleResponse> actualResponses = service.getAllVehicles();

        assertNotNull(actualResponses);
        assertEquals(1, actualResponses.size());
        assertEquals(expectedResponses.getFirst().getId(), actualResponses.getFirst().getId());

        verify(repository, times(1)).findAll();
        verify(mapper, times(1)).toResponse(entity);
    }
    @Test
    @DisplayName("Should return vehicle response when valid ID is provided")
    void getVehicleById() {
        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(mapper.toResponse(entity)).thenReturn(response);

        VehicleResponse actualResponse = service.getVehicleById(id);

        assertNotNull(actualResponse);
        assertEquals(response.getId(), actualResponse.getId());
        verify(repository, times(1)).findById(id);
    }

    // Patch
    @Test
    @DisplayName("Should successfully update vehicle when valid patch data is provided")
    void shouldUpdateVehicleSuccessfully() {
        Long id = 1L;
        VehicleRequest patchRequest = new VehicleRequest();
        patchRequest.setPlate("34NEW34");
        patchRequest.setBrand("Toyota");
        patchRequest.setModel("Corolla");
        patchRequest.setGear("Automatic");
        patchRequest.setFuel("Gasoline");
        patchRequest.setKm(55000);
        patchRequest.setLocation("Büyük Otopark");

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.existsByPlate("34NEW34")).thenReturn(false);
        when(repository.save(any(Vehicle.class))).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        Optional<VehicleResponse> result = service.updateVehicle(id, patchRequest);

        assertTrue(result.isPresent());
        verify(validator).normalizeAndValidate(patchRequest);
        verify(mapper).updateEntityFromPatch(patchRequest, entity);
        verify(repository, times(1)).save(entity);
    }
    @Test
    @DisplayName("Should throw exception when updating vehicle with already existing plate")
    void shouldThrowExceptionWhenPlateAlreadyExistsOnUpdate() {
        Long id = 1L;
        VehicleRequest patchRequest = new VehicleRequest();
        patchRequest.setPlate("34EXIST34");

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.existsByPlate("34EXIST34")).thenReturn(true);

        ValidationException ex = assertThrows(ValidationException.class,
                () -> service.updateVehicle(id, patchRequest));

        assertTrue(ex.getErrors().contains("Bu plaka başka bir araca kayıtlı!"));
        verify(repository, never()).save(any());
    }
    @Test
    @DisplayName("Should successfully update vehicle status when valid ID and status provided")
    void shouldUpdateVehicleStatusSuccessfully() {
        Long id = 1L;
        AvailabilityStatus newStatus = AvailabilityStatus.OUT_OF_SERVICE;

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(entity)).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        VehicleResponse result = service.updateVehicleStatus(id, newStatus);

        assertNotNull(result);
        assertEquals(newStatus, entity.getStatus());
        verify(repository, times(1)).save(entity);
    }
    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating status for non-existent vehicle")
    void shouldThrowExceptionWhenUpdatingStatusForNonExistentVehicle() {
        Long idDummy = 99L;
        AvailabilityStatus newStatus = AvailabilityStatus.OUT_OF_SERVICE;

        when(repository.findById(idDummy)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.updateVehicleStatus(idDummy, newStatus));

        verify(repository, never()).save(any());
    }

    // Patch (User)
    @Test
    @DisplayName("Should successfully update vehicle km and location when valid data is provided")
    void successfullyUpdateKmAndLocation() {
        Long id = 1L;

        VehicleRequest updateRequest = new VehicleRequest();
        updateRequest.setKm(60000);
        updateRequest.setLocation("Dış Otopark");

        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(any(Vehicle.class))).thenReturn(entity);
        when(mapper.toResponse(entity)).thenReturn(response);

        Optional<VehicleResponse> result = service.updateKmAndLocation(id, updateRequest);

        assertTrue(result.isPresent());
        verify(repository, times(1)).save(any(Vehicle.class));
    }
    @Test
    @DisplayName("Should throw exception on vehicle when kilometer is decreased")
    void decreasingVehicleKmRequest() {
        Long id = 1L;

        VehicleRequest updateRequest = new VehicleRequest();
        updateRequest.setKm(40000);

        when(repository.findById(id)).thenReturn(Optional.of(entity));

        ValidationException ex = assertThrows(ValidationException.class,
                () -> service.updateKmAndLocation(id, updateRequest));

        assertTrue(ex.getErrors().contains("Kilometre azaltılamaz. Mevcut: " + entity.getKm() +
                ", gönderilen: " + updateRequest.getKm()
        ));
        verify(repository, never()).save(any());
    }

    // Delete
    @Test
    @DisplayName("Should delete vehicle successfully when ID exists")
    void shouldDeleteVehicleSuccessfully() {
        Long id = 1L;

        when(repository.existsById(id)).thenReturn(true);
        doNothing().when(repository).deleteById(id);

        assertDoesNotThrow(() -> service.deleteVehicle(id));
        verify(repository, times(1)).deleteById(id);
    }
    @Test
    @DisplayName("Should throw exception on delete when vehicle does not exist")
    void shouldThrowExceptionOnDeleteWhenVehicleNotFound() {
        Long idDummy = 99L;

        when(repository.existsById(idDummy)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> service.deleteVehicle(idDummy));
        verify(repository, never()).deleteById(idDummy);
    }
}