package com.gestionhotelera.gestion_hotelera.modelo;

import lombok.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "habitacion")
@Entity

public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numero;
    private TipoHabitacion tipo;
    private int capacidad;
    private double precio;
    private String descripcion;
    private String estado;

    @OneToOne(mappedBy = "habitacion")
    private Estadia estadia;   // puede ser null

    @OneToMany(
    mappedBy = "habitacion",
    cascade = CascadeType.ALL,
    orphanRemoval = true)

    @Builder.Default
    private List<Cama> camas = new ArrayList<>();


    /*private Habitacion(Builder builder) {
        this.numero = builder.numero;
        this.tipo = builder.tipo;
        this.capacidad = builder.capacidad;
        this.precio = builder.precio;
        this.descripcion = builder.descripcion;
        this.estado = builder.estado;
    }

    public static class Builder {
        private int numero;
        private TipoHabitacion tipo;
        private int capacidad;
        private double precio;
        private String descripcion;
        private String estado;

        public Builder numero(int numero) { this.numero = numero; return this; }
        public Builder tipo(TipoHabitacion tipo) { this.tipo = tipo; return this; }
        public Builder capacidad(int capacidad) { this.capacidad = capacidad; return this; }
        public Builder precio(double precio) { this.precio = precio; return this; }
        public Builder descripcion(String descripcion) { this.descripcion = descripcion; return this; }
        public Builder estado(String estado) { this.estado = estado; return this; }

        public Habitacion build() { return new Habitacion(this); }
    }

    public int getNumero() { return numero; }
    public TipoHabitacion getTipo() { return tipo; }
    public int getCapacidad() { return capacidad; }
    public double getPrecio() { return precio; }
    public String getDescripcion() { return descripcion; }
    public String getEstado() { return estado; }

    /*@Override
    public String toString() {
        return "Habitación " + numero + " (" + tipo + ") - Estado: " + estado;
    }*/

}
