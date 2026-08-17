package com.yaltes.vehicle_service.entity;

import com.yaltes.vehicle_service.exception.InvalidKilometerException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Locale;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true,name = "plate")
    @Size(min = 5,max = 12)
    //İstenilen formatta olmalı 41 ABC 233 gibi şu olmamalı 41 444 222 !!! (Çözüm bul ai dan annotationlardan)
    private String plate;
    @Column(nullable = false,name = "brand")
    private String brand;
    @Column(nullable = false,name = "model")
    private String model;
    @Column(nullable = false,name = "year")
    private String year;
    @Column(nullable = false,name = "gear")
    private String gear;
    @Column(nullable = false,name = "km")
    private Integer km;
    @Column(nullable = false,name = "fuel")
    private String fuel;
    @Column(nullable = false,name = "location")
    private String location;

    // Format and normalize plates and kilometer values.
    @PrePersist
    @PreUpdate
    public void normalizePlateAndKm(){

        // Converting plates into valid format, for example: " 55 öş123" -> "55OS123".
        if (this.plate != null) {
            this.plate = this.plate
                    .replaceAll("\\s+", "")
                    .toUpperCase(Locale.ENGLISH)
                    .replace('Ç', 'C')
                    .replace('Ğ', 'G')
                    .replace('İ', 'I')
                    .replace('Ö', 'O')
                    .replace('Ş', 'S')
                    .replace('Ü', 'U');
        }
        //Buradan çıkar bu throwu exceptionsa koy
        // Ensure vehicle kilometer is positive.
        if (this.km != null && this.km <= 0) {
            throw new InvalidKilometerException("Araç kilometresi 0 veya negatif olamaz. Girilen değer: " + this.km);
        }
    }

    // Constructors
    public Vehicle(){}
    public Vehicle(Long id, String plate, String brand,String model ,String year,
                   String gear, String fuel, Integer km ,String location) {
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
    public Long getId() { return id; }

    public String getPlate() { return plate; }
    public void setPlate(String plate) { this.plate = plate; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getGear() { return gear; }
    public void setGear(String gear) { this.gear = gear; }

    public Integer getKm() { return km; }
    public void setKm(Integer km) { this.km = km; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

}