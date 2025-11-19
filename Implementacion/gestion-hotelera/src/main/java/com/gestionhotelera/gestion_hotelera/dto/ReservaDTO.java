package com.gestionhotelera.gestion_hotelera.dto;
import java.time.LocalDate;

import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class ReservaDTO {

    private int numero;
    private EstadoReserva estado;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private String nombre;
    private String apellido;
    private String telefono;

}
