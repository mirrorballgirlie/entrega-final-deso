package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class OcuparResponse {

    private List<Long> estadiaIds;
    private String mensaje;

}
