package com.gestionhotelera.gestion_hotelera.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class HabitacionEstadoDTO {

    private long Id;
    private int numero;
    private String tipo;
    private int capacidad;
    private double precio;
    private String descripcion;
    private String estadoActual;
    private List<EstadoDiarioDTO> estadosPorDia = new ArrayList<>();

    //se agrega este dto para poder simplificar la respuesta en el front para el cu5, sino hay muchos atributos que quedarian en null

}
