package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidarOcupacionRequest {

    // make the field private and provide an explicit getter to avoid
    // "cannot find symbol: method getHabitaciones()" when Lombok
    // is not processed by the compiler/IDE
    private List<HabitacionOcupacionDTO> habitaciones;

    public List<HabitacionOcupacionDTO> getHabitaciones() {
        return habitaciones;
    }

}
