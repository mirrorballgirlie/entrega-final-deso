package com.gestionhotelera.gestion_hotelera.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.EstadoHabitacionesResponse;
import com.gestionhotelera.gestion_hotelera.gestores.GestorHabitacion;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/habitaciones")
@RequiredArgsConstructor

public class HabitacionController {

    private final GestorHabitacion gestorHabitacion;

    //cu5: mostrar estado de todas las habitaciones entre dos fechas dadas

    @GetMapping("/estado")
    
    public ResponseEntity<?> obtenerEstadoHabitaciones(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {

        try {

            if (desde == null || hasta == null) {
                return ResponseEntity.badRequest().body("Las fechas no pueden ser nulas.");
            }

            if (hasta.isBefore(desde)) {
                return ResponseEntity.badRequest().body("La fecha 'hasta' no puede ser anterior a 'desde'.");
            }

            EstadoHabitacionesResponse response =
                    gestorHabitacion.obtenerEstadoHabitaciones(desde, hasta);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error inesperado al obtener el estado de habitaciones.");
        }
    }

}
