package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//modelar el request para la confirmacion de la reserva

public class ConfirmarReservaRequest {

    private List<Long> habitacionIds;  //una o mas habitaciones
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    //8. El sistema muestra el campo “Reserva a nombre de:  
    //apellido 
    //nombre 
    //teléfono 
    //punto 8 del CU4, por eso se presentan estos campos
    private String nombre;
    private String apellido;
    private String telefono;

}
