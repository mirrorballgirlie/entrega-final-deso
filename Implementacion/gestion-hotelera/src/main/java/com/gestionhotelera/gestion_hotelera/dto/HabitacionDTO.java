package com.gestionhotelera.gestion_hotelera.dto;
import com.gestionhotelera.gestion_hotelera.modelo.TipoHabitacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class HabitacionDTO {

    private int numero;
    private TipoHabitacion tipo;
    private int capacidad;
    private double precio;
    private String descripcion;
    private String estado;

}
