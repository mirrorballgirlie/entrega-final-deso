package com.gestionhotelera.gestion_hotelera.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


@SuperBuilder

public class ResponsableDePagoDTO {

    private String cuit;

    // Si es persona física, se usa este campo, si es persona jurídica, se deja en null
    private PersonaFisicaDTO personaFisica;

    // Si es persona jurídica, se usa este campo, si es persona física, se deja en null
    private PersonaJuridicaDTO personaJuridica;

    private String telefono; // <-- agregado

}
