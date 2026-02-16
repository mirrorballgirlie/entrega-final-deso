package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;



@Entity
@Getter
@Setter
@DiscriminatorValue("PERSONA_FISICA")
@Table(name = "persona_fisica")
@PrimaryKeyJoinColumn(name = "id")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

public class PersonaFisica extends ResponsableDePago {

    @OneToOne
    @JoinColumn(name = "huesped_id")
    private Huesped huesped; // opcional

    @Column(name = "nombre_razon_social")
    private String nombreRazonSocial; // el nombre completo de la persona física, se setea automáticamente a partir del nombre y apellido del huésped asociado

    @Override
    public String getRazonSocial() {
        // Si el campo está vacío, intentamos sacarlo del huésped asociado (si existe)
        if ((nombreRazonSocial == null || nombreRazonSocial.isBlank()) && huesped != null) {
            return huesped.getNombre() + " " + huesped.getApellido();
        }
        return nombreRazonSocial;
    }
   

}
