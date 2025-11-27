package com.gestionhotelera.gestion_hotelera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestionhotelera.gestion_hotelera.dto.*;
import com.gestionhotelera.gestion_hotelera.gestores.GestorEstadia;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/estadias")
@RequiredArgsConstructor

public class EstadiaController {

    private final GestorEstadia gestorEstadia;

    @PostMapping("/validar-ocupacion")
    public ResponseEntity<ValidarOcupacionResponse> validarOcupacion(@RequestBody ValidarOcupacionRequest req) {
        return ResponseEntity.ok(gestorEstadia.validarOcupacion(req));
    }

    @PostMapping("/ocupar")
    public ResponseEntity<OcuparResponse> ocuparHabitaciones(@RequestBody OcuparRequest req) {
        return ResponseEntity.ok(gestorEstadia.ocuparHabitaciones(req));
    }

}
