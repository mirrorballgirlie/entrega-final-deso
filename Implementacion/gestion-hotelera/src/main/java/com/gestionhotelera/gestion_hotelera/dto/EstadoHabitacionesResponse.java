package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EstadoHabitacionesResponse {

    private List<HabitacionEstadoDTO> habitaciones; // filas
    private List<LocalDate> dias;                   // columnas (fechas desde..hasta)

}
