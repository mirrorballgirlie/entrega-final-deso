package com.gestionhotelera.gestion_hotelera.dto;

import com.gestionhotelera.gestion_hotelera.modelo.TipoRazonSocial;

import lombok.*;
import lombok.experimental.SuperBuilder;

//crear los getters y setters a mano
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor


public class PersonaJuridicaDTO {

    private TipoRazonSocial razonSocial;

}
