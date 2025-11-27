package com.gestionhotelera.gestion_hotelera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaRequest;
import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaResponse;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionRequest;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionResponse;
import com.gestionhotelera.gestion_hotelera.gestores.GestorReserva;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final GestorReserva gestorReserva;

    /**
     * Endpoint para validar la selección de habitaciones antes de confirmar.
     * Simula el paso en el que el UI detecta habitaciones no DISPONIBLES.
     */
    @PostMapping("/validar-seleccion")
    public ResponseEntity<ValidarSeleccionResponse> validarSeleccion(@RequestBody ValidarSeleccionRequest req) {
        ValidarSeleccionResponse resp = gestorReserva.validarSeleccion(req);
        return ResponseEntity.ok(resp);
    }

    /**
     * Endpoint para confirmar la(s) reserva(s). Recibe un request con varias habitaciones
     * (misma fecha de ingreso/egreso y mismo huésped) y crea una reserva por habitación.
     */
    @PostMapping("/confirmar")
    public ResponseEntity<ConfirmarReservaResponse> confirmarReservas(@RequestBody ConfirmarReservaRequest req) {
        ConfirmarReservaResponse resp = gestorReserva.confirmarReservas(req);
        return ResponseEntity.ok(resp);
    }
}

