package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadoDiarioDTO {

    private LocalDate fecha;
    private String estado;

    // --- NUEVOS CAMPOS PARA IDENTIFICAR AL HUÉSPED ---
    private String reservadoPor; // Nombre y Apellido concatenados
    private Long clienteId;      // ID del Huesped (si está vinculado)
    private Long reservaId;      // ID de la reserva (útil para el frontend)

    // Constructor auxiliar para cuando está disponible (sin datos extra)
    public EstadoDiarioDTO(LocalDate fecha, String estado) {
        this.fecha = fecha;
        this.estado = estado;
    }
}