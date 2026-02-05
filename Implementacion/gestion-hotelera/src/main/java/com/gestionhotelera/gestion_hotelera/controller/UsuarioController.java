package com.gestionhotelera.gestion_hotelera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.LoginRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.UsuarioDTO;
import com.gestionhotelera.gestion_hotelera.gestores.GestorUsuario;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final GestorUsuario gestorUsuario;

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(gestorUsuario.autenticar(request));
    }
}

