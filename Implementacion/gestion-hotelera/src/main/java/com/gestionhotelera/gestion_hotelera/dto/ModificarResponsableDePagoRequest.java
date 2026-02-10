/*Modificar Responsable de Pago
└── si es Persona Jurídica → modificar datos fiscales completos
└── si es Persona Física → modificar SOLO datos fiscales permitidos
*/



package com.gestionhotelera.gestion_hotelera.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModificarResponsableDePagoRequest {

    private String telefono;

    // SOLO para PJ
    private String razonSocial;
    private DireccionDTO direccion;
}

