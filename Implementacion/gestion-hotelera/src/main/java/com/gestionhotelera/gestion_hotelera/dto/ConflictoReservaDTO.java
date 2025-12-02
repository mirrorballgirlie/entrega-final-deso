package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

//hay conflictos en la reserva?? aca se obtienen los detalles en caso de ser asi


public class ConflictoReservaDTO {

    private Long habitacionId;
    private Long reservaId;
    private String nombreReserva; // quien reservo
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaDesde;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaHasta;

}
