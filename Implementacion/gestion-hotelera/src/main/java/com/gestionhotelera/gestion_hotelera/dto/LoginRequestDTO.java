package com.gestionhotelera.gestion_hotelera.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class LoginRequestDTO {

    private String usuario;
    private String contrasenia;

}
