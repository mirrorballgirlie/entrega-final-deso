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


public class ValidarOcupacionResponse {

    private List<Long> habitacionIdsValidas;
    private List<String> errores;
    private List<ConflictoReservaDTO> conflictos; // si hay reservas en el rango

}
