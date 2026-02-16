package com.gestionhotelera.gestion_hotelera.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacturaPendienteResponseDTO {
    private Long id;
    private String nroFactura;
    private LocalDate fecha;
    private BigDecimal importeNeto;
    private BigDecimal iva;
    private BigDecimal importeTotal;
}
