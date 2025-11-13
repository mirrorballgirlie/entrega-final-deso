package com.gestionhotelera.gestion_hotelera.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DireccionDTO {


    @NotBlank(message = "El país no puede estar vacío")
    private String pais;

    @NotBlank(message = "La provincia no puede estar vacía")
    private String provincia;

    @NotBlank(message = "La ciudad no puede estar vacía")
    private String ciudad;

    @NotBlank(message = "El código postal no puede estar vacío")
    private String codigoPostal;

    @NotBlank(message = "La calle no puede estar vacía")
    private String calle;

    @NotNull(message = "El número no puede ser nulo")
    private int numero;

    
    private Integer piso; // opcional
    private String departamento; // opcional

}
