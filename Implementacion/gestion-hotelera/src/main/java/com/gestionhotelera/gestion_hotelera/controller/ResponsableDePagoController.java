package com.gestionhotelera.gestion_hotelera.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
=======
import org.springframework.web.bind.annotation.*;
>>>>>>> develop-luci

import com.gestionhotelera.gestion_hotelera.dto.AltaResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.dto.ModificarResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.gestores.GestorResponsableDePagoFacade;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/responsablesdepago")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ResponsableDePagoController {

    private final GestorResponsableDePagoFacade gestorResponsableDePagoFacade;

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarResponsables(
            @RequestParam(required = false) String razonSocial,
            @RequestParam(required = false) String cuit) {

    List<ResponsableDePago> resultados = gestorResponsableDePagoFacade.buscarResponsableDePago(razonSocial, cuit);

    Map<String, Object> respuesta = new HashMap<>();
    respuesta.put("resultados", resultados);
    respuesta.put("existe", !resultados.isEmpty());

    // Si no hay filtros, mostramos todos los responsables
    boolean sinFiltros = (razonSocial == null || razonSocial.isBlank()) && (cuit == null || cuit.isBlank());

    if (resultados.isEmpty()) {
        respuesta.put("mensaje", sinFiltros
                ? "No hay responsables de pago registrados en el sistema."
                : "No se encontró ningún responsable de pago con esos criterios.");
    } else {
        respuesta.put("mensaje", sinFiltros
                ? "Listado completo de responsables de pago."
                : "Se encontraron " + resultados.size() + " responsables de pago que coinciden con los criterios.");
    }
        // devuelvo siempre obj respuesta
        return ResponseEntity.ok(respuesta);
}


    // ------------------- ALTA -------------------
    @PostMapping("/alta")
    public ResponseEntity<?> darAltaResponsable(@RequestBody AltaResponsableDePagoRequest request) {
        try {
            ResponsableDePago nuevo = gestorResponsableDePagoFacade.darAltaResponsableDePago(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    // ---obtener por id---
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerResponsablePorId(@PathVariable Long id) {
        try {
            ResponsableDePago responsable = gestorResponsableDePagoFacade.obtenerResponsablePorId(id);
            return ResponseEntity.ok(responsable);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el responsable con ID: " + id);
        }
    }

    // ------------------- MODIFICACIÓN -------------------
    @PutMapping("/modificar/{id}")
    public ResponseEntity<String> modificarResponsable(
            @PathVariable Long id,
            @RequestBody ModificarResponsableDePagoRequest request) {

        try {
            gestorResponsableDePagoFacade.modificarResponsableDePago(id, request);
            return ResponseEntity.ok("Responsable de pago modificado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ------------------- BAJA -------------------
    @DeleteMapping("/baja/{id}")
    public ResponseEntity<String> darBajaResponsable(@PathVariable Long id) {
        try {
            gestorResponsableDePagoFacade.darBajaResponsableDePago(id);
            return ResponseEntity.ok("El responsable de pago fue dado de baja correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

