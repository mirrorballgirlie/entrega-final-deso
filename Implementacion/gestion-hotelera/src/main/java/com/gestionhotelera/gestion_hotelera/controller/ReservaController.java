package com.gestionhotelera.gestion_hotelera.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List; // Para el símbolo List
import com.gestionhotelera.gestion_hotelera.dto.ReservaDTO; // Para el símbolo ReservaDTO
import org.springframework.web.bind.annotation.GetMapping; // Para el símbolo GetMapping
import org.springframework.web.bind.annotation.RequestParam; // Para el símbolo RequestParam


import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaRequest;
import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaResponse;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionRequest;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionResponse;
import com.gestionhotelera.gestion_hotelera.gestores.GestorReserva;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/cancelar-reserva/{id}") // Endpoint para cancelar reserva y calcular recargo
    public ResponseEntity<String> cancelar(@PathVariable Long id) {
        String recargo = gestorReserva.cancelarReserva(id);
        return ResponseEntity.ok(recargo);
    }
    
 @GetMapping("/buscar-activas-por-titular")
    public ResponseEntity<List<ReservaDTO>> buscarReservasActivasPorTitular(
            @RequestParam(required = false) String nombre, 
            @RequestParam String apellido) {
        List<ReservaDTO> reservas = gestorReserva.buscarReservasActivas(nombre, apellido);
        return ResponseEntity.ok(reservas);
    }
  
    @PostMapping("/confirmar")
    public ResponseEntity<?> confirmarReservas(@RequestBody ConfirmarReservaRequest req) {
        try {
            System.out.println("JAVA RECIBIÓ: " + req); // Verificamos datos
            return ResponseEntity.ok(gestorReserva.confirmarReservas(req));
            
        } catch (Exception e) {
            // IMPRIMIR ERROR EN CONSOLA (Rojo)
            e.printStackTrace(); 
            
            // DEVOLVER ERROR AL FRONTEND (Para que lo leas en el alert)
            String causa = (e.getCause() != null) ? e.getCause().getMessage() : "Desconocida";
            String mensaje = "ERROR JAVA: " + e.getMessage() + " | CAUSA: " + causa;
            
            return ResponseEntity.status(500).body("{\"message\": \"" + mensaje + "\"}");
        }
    }

}