package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder

public class TarjetaDebitoDTO extends MetodoDePagoDTO {

    private String numeroTarjetaDebito;
    private String titular;
    private String bancoEmisor;

}
