package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerarFacturaRequest {
    
    private Long estadiaId;
    private String cuitResponsable;  // CUIT del responsable de pago
    private boolean incluirEstadia;  // Si se incluye el monto de estadía
    private List<Long> idsConsumosSeleccionados;  // IDs de consumos seleccionados
    
}
