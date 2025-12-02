package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

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

//request para obtener las habitaciones que quiero ocupar

public class ValidarOcupacionRequest {

    public List<HabitacionOcupacionDTO> habitaciones;

}
