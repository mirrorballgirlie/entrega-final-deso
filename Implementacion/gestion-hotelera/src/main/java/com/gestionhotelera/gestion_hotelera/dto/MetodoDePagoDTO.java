package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder

public abstract class MetodoDePagoDTO {

    private LocalDate fechaPago;
    private double monto;

}
