package com.yaltes.vehicle_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String plate;
    private String brand;
    private String model;
    private String year;
    private String gear;
    private Integer km;
    private String fuel;
    private String location;
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

    public int getKm() { return km; }
    public void setKm(int km) { this.km = km; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

}