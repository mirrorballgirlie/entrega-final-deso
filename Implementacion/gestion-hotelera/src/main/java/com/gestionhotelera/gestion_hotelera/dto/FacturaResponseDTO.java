package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturaResponseDTO {
    private Long id;
    private String tipo;
    private String cuit;
    private String nombreResponsable;
    private double monto;
    private double iva;
    private double total;
    private LocalDateTime fechaEmision;
    private String estado;
}
