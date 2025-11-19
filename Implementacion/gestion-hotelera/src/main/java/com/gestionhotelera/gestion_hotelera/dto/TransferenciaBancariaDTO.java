package com.gestionhotelera.gestion_hotelera.dto;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder

@NoArgsConstructor
@AllArgsConstructor

@Getter
@Setter
public class TransferenciaBancariaDTO extends MetodoDePagoDTO {

    private String numeroTransferencia;
    private double monto;
    private Date fechaPago;
    private String titular;

}
