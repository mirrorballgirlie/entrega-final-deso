// package com.gestionhotelera.gestion_hotelera.dto;

// import java.util.List;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class GenerarFacturaRequest {
    
//     private Long estadiaId;
//     private String cuitResponsable;  // CUIT del responsable de pago
//     private Boolean incluirEstadia;  // Si se incluye el monto de estadía
//     private List<Long> idsConsumosSeleccionados;  // IDs de consumos seleccionados
//     private Long huespedId;         // Para ocupantes seleccionados
    
// }

package com.gestionhotelera.gestion_hotelera.dto;
import java.util.List;

public class GenerarFacturaRequest {
    private Long estadiaId;
    private String cuitResponsable;
    private Boolean incluirEstadia;
    private List<Long> idsConsumosSeleccionados;
    private Long huespedId;

    public GenerarFacturaRequest() {} // Constructor vacío para Jackson

    // Getters manuales (sin Lombok para asegurar que funcione)
    public Long getEstadiaId() { return estadiaId; }
    public void setEstadiaId(Long estadiaId) { this.estadiaId = estadiaId; }
    public String getCuitResponsable() { return cuitResponsable; }
    public void setCuitResponsable(String cuitResponsable) { this.cuitResponsable = cuitResponsable; }
    public Boolean getIncluirEstadia() { return incluirEstadia; }
    public void setIncluirEstadia(Boolean incluirEstadia) { this.incluirEstadia = incluirEstadia; }
    public List<Long> getIdsConsumosSeleccionados() { return idsConsumosSeleccionados; }
    public void setIdsConsumosSeleccionados(List<Long> ids) { this.idsConsumosSeleccionados = ids; }
    public Long getHuespedId() { return huespedId; }
    public void setHuespedId(Long huespedId) { this.huespedId = huespedId; }
}
