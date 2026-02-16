package com.gestionhotelera.gestion_hotelera.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearNotaCreditoRequestDTO {
    private List<Long> facturaIds;
}
