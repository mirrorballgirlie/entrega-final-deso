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

    //se agrega este dto para poder simplificar la respuesta en el front para el cu5, sino hay muchos atributos que quedarian en null
    //es para el estado diario de cada habitacion 


}
