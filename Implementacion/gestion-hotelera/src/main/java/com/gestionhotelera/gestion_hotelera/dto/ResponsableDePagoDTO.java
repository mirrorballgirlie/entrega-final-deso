package com.gestionhotelera.gestion_hotelera.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


@SuperBuilder

public class ResponsableDePagoDTO {

    private String cuit;

}
