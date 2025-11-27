package com.gestionhotelera.gestion_hotelera.dto;


//como este es un DTO agregado, recordar ponerlo en el diagrama de clases
//es para validar la seleccion de habitaciones en el CU4, por la disponibilidad entre las fechas dadas

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ValidarSeleccionRequest {

    private List<Long> habitacionIds;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaDesde;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaHasta;

}
