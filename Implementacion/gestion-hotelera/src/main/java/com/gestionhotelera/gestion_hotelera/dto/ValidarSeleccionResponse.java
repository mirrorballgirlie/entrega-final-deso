package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//se hace una lista de habitaciones que pasan la validacion por fechas y estado, sino los errores

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ValidarSeleccionResponse {

    private List<Long> habitacionIdsValidas;
    private List<String> errores; // lista de mensajes que dicen por que habria fallado alguna seleccion

}
