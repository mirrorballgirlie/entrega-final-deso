package com.gestionhotelera.gestion_hotelera.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.BusquedaFacturaRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.CrearNotaCreditoRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.FacturaPendienteResponseDTO;
import com.gestionhotelera.gestion_hotelera.dto.NotaCreditoDetalleResponseDTO;
import com.gestionhotelera.gestion_hotelera.gestores.GestorNotaCredito;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/notas-credito")
@RequiredArgsConstructor
public class NotaCreditoController {

    private final GestorNotaCredito gestorNotaCredito;

    /**
     * Paso 4 del CU: Lista facturas pendientes de pago (PAGADAS o con deuda)
     * para el responsable ingresado (CUIT o Doc).
     */
    @PostMapping("/buscar-facturas") 
    public ResponseEntity<List<FacturaPendienteResponseDTO>> buscarFacturas(@RequestBody BusquedaFacturaRequestDTO filtros) {
        System.out.println(">>> BUSCANDO FACTURAS PARA NC - FILTROS: " + filtros);
        List<FacturaPendienteResponseDTO> facturas = gestorNotaCredito.buscarFacturasParaNC(filtros);
        
        if (facturas.isEmpty()) {
            return ResponseEntity.noContent().build(); // 4.A: No hay facturas
        }
        return ResponseEntity.ok(facturas);
    }

    /**
     * Paso 7 y 8 del CU: Genera la Nota de Crédito y anula las facturas.
     */
    @PostMapping("/generar")
    public ResponseEntity<?> generarNotaCredito(@RequestBody CrearNotaCreditoRequestDTO request) {
        try {
            System.out.println(">>> GENERANDO NOTA DE CRÉDITO PARA IDs: " + request.getFacturaIds());
            NotaCreditoDetalleResponseDTO response = gestorNotaCredito.procesarNotaCredito(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al generar NC: " + e.getMessage());
        }
    }
}
