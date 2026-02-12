package com.gestionhotelera.gestion_hotelera.dto;

import com.gestionhotelera.gestion_hotelera.modelo.TipoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import java.time.LocalDateTime;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacturaDTO {

    private String nombre;
    private TipoFactura tipo;
    private String cuit;
    private double monto;
    private double iva;
    private double total;
    LocalDateTime fechaEmision;
    EstadoFactura estado;
    


}
