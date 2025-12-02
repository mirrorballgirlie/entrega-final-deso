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

    
      //seleccion de habitaciones antes de confirmar. chequear que la seleccion sea valida
    
    @PostMapping("/validar-seleccion")
    public ResponseEntity<ValidarSeleccionResponse> validarSeleccion(@RequestBody ValidarSeleccionRequest req) {
        ValidarSeleccionResponse resp = gestorReserva.validarSeleccion(req);
        return ResponseEntity.ok(resp);
    }

    
    
     //confirmar la reserva. si quiero reservar mas de una habitacion, se "replica" la reserva en cada habitacion seleccionada
     //se replica manteniendo los datos del huesped y las fecahas de ingreso y egreso

    @PostMapping("/confirmar")
    public ResponseEntity<ConfirmarReservaResponse> confirmarReservas(@RequestBody ConfirmarReservaRequest req) {
        ConfirmarReservaResponse resp = gestorReserva.confirmarReservas(req);
        return ResponseEntity.ok(resp);
    }
}

