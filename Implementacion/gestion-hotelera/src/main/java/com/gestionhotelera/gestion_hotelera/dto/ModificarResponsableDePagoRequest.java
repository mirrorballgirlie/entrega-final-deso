package com.gestionhotelera.gestion_hotelera.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModificarResponsableDePagoRequest {
    private String tipoPersona; //para validacion
    private String cuit;
    private String telefono;
    private String razonSocial;
    private DireccionDTO direccion;
}

