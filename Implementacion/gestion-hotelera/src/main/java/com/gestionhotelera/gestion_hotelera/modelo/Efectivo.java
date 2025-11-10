package com.gestionhotelera.gestion_hotelera.modelo;

import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;


//@Data
//@EqualsAndHashCode(callSuper = true)
//hacer los getters y los setters aca manualmente
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "efectivo")
@Entity
@Getter
@Setter


public class Efectivo extends MetodoDePago {

    private String moneda;
    private double cotiazcion;

}
