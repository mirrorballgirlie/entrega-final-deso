package com.gestionhotelera.gestion_hotelera.modelo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

//crear los getters y setters a mano
@Entity
@Table(name = "persona_juridica")
@PrimaryKeyJoinColumn(name = "id")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


@DiscriminatorValue("PERSONA_JURIDICA")

public class PersonaJuridica  extends ResponsableDePago {

    private String nombreRazonSocial; // el nombre real de la empresa

    @Enumerated(EnumType.ORDINAL) // 0=persona juridica, 1=monotributista, 2=responsable inscripto, 3=exento
    private TipoRazonSocial condicionIva;

    @OneToOne(mappedBy = "personaJuridica", cascade = CascadeType.ALL)
    private Direccion direccion;

    @Override
    public String getRazonSocial() {
        return this.nombreRazonSocial;
    }


}
