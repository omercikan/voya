package com.voya.appointment_service.repository;

import com.voya.appointment_service.entity.Appointment;
import com.voya.appointment_service.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("""
            SELECT a FROM Appointment a
            WHERE a.vehicleId = :vehicleId
            AND a.status <> com.voya.appointment_service.entity.AppointmentStatus.CANCELLED
            AND a.dateStart <= :dateEnd
            AND a.dateEnd >= :dateStart
            """)
    List<Appointment> findOverlapping(
            @Param("vehicleId") Long vehicleId,
            @Param("dateStart") LocalDate dateStart,
            @Param("dateEnd") LocalDate dateEnd
    );

    List<Appointment> findByVehicleIdAndStatusNot(Long vehicleId, AppointmentStatus status);

    @Query("""
            SELECT a FROM Appointment a
            WHERE a.status <> com.voya.appointment_service.entity.AppointmentStatus.CANCELLED
            AND a.dateStart <= :toDate
            AND a.dateEnd >= :fromDate
            """)
    List<Appointment> findActiveInRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    List<Appointment> findByCustomerId(Long customerId);

    List<Appointment> findByStatus(AppointmentStatus status);
}