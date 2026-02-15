package com.gestionhotelera.gestion_hotelera.controller;

import com.gestionhotelera.gestion_hotelera.dto.FacturaDTO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.List;
import com.gestionhotelera.gestion_hotelera.gestores.GestorPago;
import lombok.*;
import org.springframework.web.bind.annotation.PostMapping;





@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pago")
@RequiredArgsConstructor

public class PagoController { 
    private final GestorPago gestorPago;

    @GetMapping("/facturas-pendientes/{nroHabitacion}")
    public ResponseEntity<List<FacturaDTO>> obtenerFacturasPendientes(@PathVariable Integer nroHabitacion) {
        List<FacturaDTO> facturas = gestorPago.obtenerFacturasPendientes(nroHabitacion); 
        return ResponseEntity.ok(facturas);
    }

    @PostMapping("pagar/{monto}/de/{idFactura}")
    public ResponseEntity<String> pagar(@PathVariable Double monto, @PathVariable Long idFactura) {
        try {
            gestorPago.pagar(monto, idFactura);
            return ResponseEntity.ok("Pago realizado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el pago: " + e.getMessage());
        }
    }
}
