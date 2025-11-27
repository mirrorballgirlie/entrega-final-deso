package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter


public class HabitacionOcupacionDTO {

    private Long habitacionId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaDesde;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaHasta;

}
