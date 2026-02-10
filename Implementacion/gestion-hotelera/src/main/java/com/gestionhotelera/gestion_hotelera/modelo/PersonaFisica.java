package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;




@Entity
@Getter
@Setter
@DiscriminatorValue("PERSONA_FISICA")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

public class PersonaFisica extends ResponsableDePago {

    @OneToOne
    @JoinColumn(name = "huesped_id")
    private Huesped huesped; // opcional
    private String nombreRazonSocial; // el nombre completo de la persona física, se setea automáticamente a partir del nombre y apellido del huésped asociado


   

}
