package com.gestionhotelera.gestion_hotelera.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotaCreditoDetalleResponseDTO {
    private String nroNotaCredito;
    private String responsablePago;
    private BigDecimal importeNeto;
    private BigDecimal iva;
    private BigDecimal importeTotal;
    private LocalDate fechaEmision;
}
