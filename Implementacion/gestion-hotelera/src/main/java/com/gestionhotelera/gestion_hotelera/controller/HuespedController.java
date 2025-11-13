package com.gestionhotelera.gestion_hotelera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.gestores.GestorHuesped;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/huespedes")
public class HuespedController {

    @Autowired
    private GestorHuesped gestorHuesped;

    @PostMapping("/alta")
    public ResponseEntity<?> altaHuesped(@Valid @RequestBody HuespedDTO huespedDTO) {
        try {
            Huesped nuevo = gestorHuesped.registrarHuesped(huespedDTO);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarHuesped(
        @RequestParam(required = false) String apellido,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String tipoDocumento,
        @RequestParam(required = false) String documento) {

    try {
        var resultados = gestorHuesped.buscarFiltrado(apellido, nombre, tipoDocumento, documento);
        if (resultados.isEmpty()) {
            return ResponseEntity.ok("No se encontraron huéspedes con los filtros aplicados.");
        }
        return ResponseEntity.ok(resultados);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error al buscar huéspedes: " + e.getMessage());
    }
}

}

