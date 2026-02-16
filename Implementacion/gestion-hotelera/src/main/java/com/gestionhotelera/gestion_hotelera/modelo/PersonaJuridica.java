package com.gestionhotelera.gestion_hotelera.modelo;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Column(name = "nombre_razon_social") // 👈 Agregá esto para que coincida con la imagen
    private String nombreRazonSocial; // el nombre real de la empresa

    @Enumerated(EnumType.ORDINAL) // 0=persona juridica, 1=monotributista, 2=responsable inscripto, 3=exento
    private TipoRazonSocial razonSocial;

    @OneToOne(mappedBy = "personaJuridica")
    private Direccion direccion;


}
