package com.gestionhotelera.gestion_hotelera.dto;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PagoDTO {

    private int numeroDePago;
    private double monto;
    private LocalDate fechaPago;

}
