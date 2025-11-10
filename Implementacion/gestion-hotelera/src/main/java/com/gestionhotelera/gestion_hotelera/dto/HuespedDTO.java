package com.gestionhotelera.gestion_hotelera.dto;

import java.util.Date;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HuespedDTO {

    private String nombre;
    private String apellido;
    private String tipoDocumento;
    private String documento;
    private String posicionIVA;
    private Date fechaNacimiento;
    private String telefono;
    private String email;
    private String ocupacion;
    private String nacionalidad;

}
