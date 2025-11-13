package com.gestionhotelera.gestion_hotelera.modelo;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

//crear los getters y setters a mano
@Entity
//@Table(name = "personaJuridica")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


@DiscriminatorValue("PERSONA_JURIDICA")

public class PersonaJuridica  extends ResponsableDePago {

    private TipoRazonSocial razonSocial;

    @OneToOne(mappedBy = "personaJuridica")
    private Direccion direccion;


}
