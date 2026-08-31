package com.voya.vehicle_service.entity;

import com.voya.vehicle_service.enums.AvailabilityStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, name = "plate")
    private String plate;
    @Column(nullable = false, name = "brand")
    private String brand;
    @Column(nullable = false, name = "model")
    private String model;
    @Column(nullable = false, name = "year")
    private Integer year;
    @Column(nullable = false, name = "gear")
    private String gear;
    @Column(nullable = false, name = "km")
    private Integer km;
    @Column(nullable = false, name = "fuel")
    private String fuel;
    @Column(nullable = false, name = "location")
    private String location;
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus status = AvailabilityStatus.AVAILABLE;


    // Constructors
    public Vehicle() {
    }

    public Vehicle(Long id, String plate, String brand, String model, Integer year,
                   String gear, String fuel, Integer km, String location) {
        this.id = id;
        this.plate = plate;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.gear = gear;
        this.fuel = fuel;
        this.km = km;
        this.location = location;
    }

    // Getter-Setter
    public Long getId() {
        return id;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getGear() {
        return gear;
    }

    public void setGear(String gear) {
        this.gear = gear;
    }

    public Integer getKm() {
        return km;
    }

    public void setKm(Integer km) {
        this.km = km;
    }

    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }
}