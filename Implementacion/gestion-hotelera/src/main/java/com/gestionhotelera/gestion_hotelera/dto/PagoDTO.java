package com.gestionhotelera.gestion_hotelera.dto;
import java.util.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PagoDTO {

    private int numeroDePago;
    private double monto;
    private Date fechaPago;

}
