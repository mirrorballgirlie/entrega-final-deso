package com.gestionhotelera.gestion_hotelera.dto;

import com.gestionhotelera.gestion_hotelera.modelo.TipoRazonSocial;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

//crear los getters y setters a mano
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor


public class PersonaJuridicaDTO {

    private String nombreRazonSocial; // el nombre real de la empresa

    private TipoRazonSocial razonSocial;

    private DireccionDTO direccion;

}
