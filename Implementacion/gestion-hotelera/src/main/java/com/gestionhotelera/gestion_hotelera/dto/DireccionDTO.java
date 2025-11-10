package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DireccionDTO {

    private String pais;
    private String provincia;
    private String ciudad;
    private String codigoPostal;
    private String calle;
    private int numero;
    private Integer piso; // opcional
    private String departamento; // opcional

}
