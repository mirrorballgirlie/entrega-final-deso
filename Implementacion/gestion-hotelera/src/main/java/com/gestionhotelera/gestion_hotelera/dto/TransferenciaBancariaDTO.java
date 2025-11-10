package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.Date;

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
