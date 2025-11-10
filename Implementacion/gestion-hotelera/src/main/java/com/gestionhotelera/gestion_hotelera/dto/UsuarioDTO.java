package com.gestionhotelera.gestion_hotelera.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UsuarioDTO {

    private String usuario;
    private String contrasenia;

}
