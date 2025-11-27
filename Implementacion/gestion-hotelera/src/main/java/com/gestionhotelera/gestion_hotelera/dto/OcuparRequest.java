package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OcuparRequest {

    private List<Long> huespedIds; //lista con el id del huesped responsable + acompañantes
    private List<HabitacionOcupacionDTO> habitaciones; //lista con el id de la habitacion + el rango de fechas seleccionado por habitacion
    private boolean opcionOcuparIgual = false; //si es verdadero, se permite ocupar igual aunque existan reservas solapadas (cu 3.d.2.1)

}
