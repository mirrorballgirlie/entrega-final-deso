package com.gestionhotelera.gestion_hotelera.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UsuarioDTO {

    private String usuario;
    //private String contrasenia;

    /*como en el diagrama de clases aparece esto para usuario dto, comentamos la contraseña
    class UsuarioDTO {
    - usuario: String
    /' No poner contraseña, es falla de seguridad '/
    }
    en cambio creamos un dto de input "loginrequest", como veniamos trabajando
 */

}
