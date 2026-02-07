package com.gestionhotelera.gestion_hotelera.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AltaResponsableDePagoRequest {

    private TipoPersona tipoPersona; // FISICA o JURIDICA

    private String razonSocial;   //nombre de la empresa u organizacion para pj, nombre completo para pf
    private String cuit;
    private String telefono;

    private DireccionDTO direccion;  //obligatorio para pj, opcional para pf

    private Long huespedId; // ID del huésped asociado al responsable de pago
}

