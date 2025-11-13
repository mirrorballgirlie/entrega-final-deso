package com.gestionhotelera.gestion_hotelera.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EstadiaDTO {

    private String estado;
    private Date fechaIngreso;
    private Date fechaEgreso;

}
