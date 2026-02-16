package com.gestionhotelera.gestion_hotelera.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class BusquedaFacturaRequestDTO {

    String cuit;
    String tipoDoc;
    String nroDoc;

    // Agregamos un método de validación rápida para cumplir con el flujo 2.A.1
    public boolean tieneFiltrosMinimos() {
        return (cuit != null && !cuit.isBlank()) || 
               (tipoDoc != null && nroDoc != null && !nroDoc.isBlank());
}
}
