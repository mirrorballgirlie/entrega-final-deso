package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
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

public class HuespedDTO {

    @NotNull(message = "El ID del huésped no puede ser nulo")
    
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío")
    
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    
    private String apellido;

    @NotBlank(message = "El tipo de documento no puede estar vacío")
    
    private String tipoDocumento;

    @NotBlank(message = "El documento no puede estar vacío")
    private String documento;

    @NotBlank(message = "La posición IVA no puede estar vacía")
    private String posicionIVA;

    @NotNull(message = "La fecha de nacimiento no puede estar vacía")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El teléfono no puede estar vacío")
    private String telefono;

    //@NotBlank(message = "El email no puede estar vacío")
    @Email(message = "email invalido")
    private String email;

    @NotBlank(message = "La ocupación no puede estar vacía")
    private String ocupacion;

    @NotBlank(message = "La nacionalidad no puede estar vacía")
    private String nacionalidad;


    @NotNull(message = "La dirección no puede ser nula")
    private DireccionDTO direccion;

    
    private String cuit;


    

}
