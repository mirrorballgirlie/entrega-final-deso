package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;

//hacer los getters y los setters manualmente
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@Setter

public class NotaCreditoDTO extends MetodoDePagoDTO {

    private int numero;
    private double monto;
    private double iva;
    private double total;

}
