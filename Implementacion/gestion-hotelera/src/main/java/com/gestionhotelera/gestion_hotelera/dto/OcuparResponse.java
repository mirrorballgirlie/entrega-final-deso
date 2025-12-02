package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

//si se logra hacer la ocupacion, se muestra el id de la estadia generada (el check in) y un mensaje detallando los aspectos necesarios


public class OcuparResponse {

    private List<Long> estadiaIds;
    private String mensaje;

}
