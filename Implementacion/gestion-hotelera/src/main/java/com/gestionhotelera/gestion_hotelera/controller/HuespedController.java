package com.gestionhotelera.gestion_hotelera.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/huespedes")
public class HuespedController {

    @Autowired
    private GestorHuesped gestorHuesped;

    @PostMapping("/alta")
    public ResponseEntity<?> altaHuesped(@Valid @RequestBody HuespedDTO huespedDTO, BindingResult result) {
        if(result.hasErrors()) {
            Map<String, Object> errores = new HashMap<>();
        errores.put("status", 400);

        List<Map<String, String>> lista = new ArrayList<>();

        result.getFieldErrors().forEach(err -> {
            Map<String, String> error = new HashMap<>();
            error.put("campo", err.getField());
            error.put("mensaje", err.getDefaultMessage());
            lista.add(error);
        });

        errores.put("errores", lista);

        return ResponseEntity.badRequest().body(errores);
        }
        
        try {
            Huesped nuevo = gestorHuesped.registrarHuesped(huespedDTO);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/buscar")
public ResponseEntity<?> buscarHuesped(
        @RequestParam(required = false) String apellido,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String tipoDocumento,
        @RequestParam(required = false) String documento) {

    // Normalización de filtros
    apellido = (apellido == null || apellido.isBlank()) ? null : apellido.trim();
    nombre = (nombre == null || nombre.isBlank()) ? null : nombre.trim();
    tipoDocumento = (tipoDocumento == null || tipoDocumento.isBlank()) ? null : tipoDocumento.trim();
    documento = (documento == null || documento.isBlank()) ? null : documento.trim();

    try {
        var resultados = gestorHuesped.buscarFiltrado(apellido, nombre, tipoDocumento, documento);

        if (resultados.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("existe", false);
            response.put("resultados", List.of());
            response.put("mensaje", "No se encontraron huéspedes con los filtros aplicados.");
            return ResponseEntity.ok(response);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("existe", true);
        response.put("resultados", resultados);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Error al buscar huéspedes");
        error.put("detalle", e.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}


}

