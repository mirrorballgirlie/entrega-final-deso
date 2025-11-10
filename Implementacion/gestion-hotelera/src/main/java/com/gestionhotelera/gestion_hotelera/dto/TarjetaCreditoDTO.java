package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder


public class TarjetaCreditoDTO extends MetodoDePagoDTO {

    private String numeroTarjetaCredito;
    private String titular;
    private String bancoEmisor;
    private int cuotas;

}
