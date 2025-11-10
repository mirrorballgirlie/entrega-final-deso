package com.gestionhotelera.gestion_hotelera.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder

public abstract class MetodoDePagoDTO {

    private Date fechaPago;
    private double monto;

}
