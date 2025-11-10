package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;

//crear los getters y setters a mano
@Entity
@Table(name = "personaJuridica")
@SuperBuilder
@Getter
@Setter


public class PersonaJuridica  extends ResponsableDePago {

    private TipoRazonSocial razonSocial;

    @OneToOne(mappedBy = "personaJuridica")
    private Direccion direccion;


}
