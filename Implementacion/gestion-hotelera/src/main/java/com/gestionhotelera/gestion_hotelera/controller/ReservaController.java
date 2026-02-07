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

    @PostMapping("/{id}/cancelar") // Endpoint para cancelar reserva y calcular recargo
    public ResponseEntity<Double> cancelar(@PathVariable Long id) {
        double recargo = gestorReserva.cancelarReserva(id);
        return ResponseEntity.ok(recargo);
    }
    
     //confirmar la reserva. si quiero reservar mas de una habitacion, se "replica" la reserva en cada habitacion seleccionada
     //se replica manteniendo los datos del huesped y las fecahas de ingreso y egreso

    // @PostMapping("/confirmar")
    // public ResponseEntity<ConfirmarReservaResponse> confirmarReservas(@RequestBody ConfirmarReservaRequest req) {
    //     ConfirmarReservaResponse resp = gestorReserva.confirmarReservas(req);
    //     return ResponseEntity.ok(resp);
    // }

    //ULTIMA VERSION CON DEBUGGING
    // @PostMapping("/confirmar")
    // public ResponseEntity<?> confirmarReservas(@RequestBody ConfirmarReservaRequest req) {
    //     try {
    //      // Imprimimos qué llegó para estar seguros
    //          System.out.println("JAVA RECIBIÓ: " + req.toString());

    //         ConfirmarReservaResponse resp = gestorReserva.confirmarReservas(req);
    //         return ResponseEntity.ok(resp);

    //     } catch (Exception e) {
    //         // ESTO ES LO QUE NECESITAMOS VER
    //         e.printStackTrace(); // Imprime el error rojo en la consola de Java
    //         return ResponseEntity.internalServerError().body("ERROR EN JAVA: " + e.getMessage());
    //     }
    // }


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