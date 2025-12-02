package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//modelar el response de la confirmacion de reserva

public class ConfirmarReservaResponse {

    private List<Long> reservasIds;
    private String mensaje; 

}
