package com.gestionhotelera.gestion_hotelera.modelo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore; // <--- IMPORTANTE

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString; // <--- Recomendado para evitar errores en logs
import com.gestionhotelera.gestion_hotelera.modelo.EstadoHabitacion;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;



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

    
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "tipo")
    private TipoHabitacion tipo;
    
    private int capacidad;
    private double precio;
    private String descripcion;
    @Enumerated(EnumType.ORDINAL)
    private EstadoHabitacion estado;
    

    // --- CAMBIO PRINCIPAL AQUÍ ---
    // Antes era @OneToOne. Ahora es @OneToMany para permitir historial.
    @OneToMany(mappedBy = "habitacion")
    @JsonIgnore       // Evita error "Infinite Recursion" al enviar al front
    @ToString.Exclude // Evita error "StackOverflow" al imprimir en consola
    @Builder.Default  // Necesario para que el new ArrayList() funcione con @Builder
    private List<Estadia> estadias = new ArrayList<>();

    @OneToMany(
        mappedBy = "habitacion",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<Cama> camas = new ArrayList<>();

}