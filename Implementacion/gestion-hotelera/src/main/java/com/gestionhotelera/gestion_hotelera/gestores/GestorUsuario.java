package com.gestionhotelera.gestion_hotelera.gestores;

import org.springframework.stereotype.Service;

import com.gestionhotelera.gestion_hotelera.dto.LoginRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.UsuarioDTO;
import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
import com.gestionhotelera.gestion_hotelera.modelo.Usuario;
import com.gestionhotelera.gestion_hotelera.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor

public class GestorUsuario {

     private final UsuarioRepository usuarioRepository;

    public UsuarioDTO autenticar(LoginRequestDTO request) {

        Usuario usuario = usuarioRepository
                .findByUsuario(request.getUsuario())
                .orElseThrow(() ->
                        new BadRequestException("El usuario o la contraseña no son válidos"));

        if (!usuario.getContrasenia().equals(request.getContrasenia())) {
            throw new BadRequestException("El usuario o la contraseña no son válidos");
        }

        return UsuarioDTO.builder()
                .usuario(usuario.getUsuario())
                .build();
    }

    

}
