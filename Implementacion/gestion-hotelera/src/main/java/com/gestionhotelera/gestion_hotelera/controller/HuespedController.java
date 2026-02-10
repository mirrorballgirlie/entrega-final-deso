package com.gestionhotelera.gestion_hotelera.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.gestores.GestorHuesped;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;

import jakarta.validation.Valid;

//import jakarta.validation.Valid;
//import com.fasterxml.jackson.databind.ObjectMapper;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/huespedes")
public class HuespedController {

    @Autowired
    private GestorHuesped gestorHuesped;

    @PostMapping("/alta")
    public ResponseEntity<?> altaHuesped(@Valid @RequestBody HuespedDTO huespedDTO, BindingResult result) {

       /*  // Mostrar en consola el JSON recibido
        try {
            ObjectMapper mapper = new ObjectMapper();
            System.out.println("JSON recibido desde el front:");
            System.out.println(mapper.writeValueAsString(huespedDTO));
        } catch (Exception e) {
            System.out.println("Error al mostrar JSON recibido: " + e.getMessage());
        } */

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

//     @GetMapping("/buscar")
// public ResponseEntity<?> buscarHuesped(
//         @RequestParam(required = false) String apellido,
//         @RequestParam(required = false) String nombre,
//         @RequestParam(required = false) String tipoDocumento,
//         @RequestParam(required = false) String documento) {

//     // Normalización de filtros
//     apellido = (apellido == null || apellido.isBlank()) ? null : apellido.trim();
//     nombre = (nombre == null || nombre.isBlank()) ? null : nombre.trim();
//     tipoDocumento = (tipoDocumento == null || tipoDocumento.isBlank()) ? null : tipoDocumento.trim();
//     documento = (documento == null || documento.isBlank()) ? null : documento.trim();

//     try {
//         var resultados = gestorHuesped.buscarFiltrado(apellido, nombre, tipoDocumento, documento);

//         if (resultados.isEmpty()) {
//             Map<String, Object> response = new HashMap<>();
//             response.put("existe", false);
//             response.put("resultados", List.of());
//             response.put("mensaje", "No se encontraron huéspedes con los filtros aplicados.");
//             return ResponseEntity.ok(response);
//         }

//         Map<String, Object> response = new HashMap<>();
//         response.put("existe", true);
//         response.put("resultados", resultados);

//         return ResponseEntity.ok(response);

//     } catch (Exception e) {
//         Map<String, Object> error = new HashMap<>();
//         error.put("error", "Error al buscar huéspedes");
//         error.put("detalle", e.getMessage());
//         return ResponseEntity.internalServerError().body(error);
//     }
// }


@GetMapping("/buscar")
public ResponseEntity<?> buscarHuesped(
        @RequestParam(required = false) String apellido,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) String tipoDocumento,
        @RequestParam(required = false) String documento) {

    // 1. Normalización de filtros (Igual que antes)
    // Convertimos vacíos a NULL para verificar fácil después
    apellido = (apellido == null || apellido.isBlank()) ? null : apellido.trim();
    nombre = (nombre == null || nombre.isBlank()) ? null : nombre.trim();
    tipoDocumento = (tipoDocumento == null || tipoDocumento.isBlank()) ? null : tipoDocumento.trim();
    documento = (documento == null || documento.isBlank()) ? null : documento.trim();

    try {
        List<Huesped> resultados;

        //Verificar si hay filtros
        boolean hayFiltros = (apellido != null || nombre != null || tipoDocumento != null || documento != null);

        if (hayFiltros) {
            resultados = gestorHuesped.buscarFiltrado(apellido, nombre, tipoDocumento, documento);
        } else {
            resultados = gestorHuesped.obtenerTodos();
        }

        //Armado de respuesta 
        Map<String, Object> response = new HashMap<>();

        if (resultados.isEmpty()) {
            response.put("existe", false);
            response.put("resultados", List.of());
            // Mensaje opcional: cambia según si filtró o si la base está vacía
            response.put("mensaje", hayFiltros ? 
                "No se encontraron huéspedes con los filtros aplicados." : 
                "No hay huéspedes registrados en el sistema.");
            return ResponseEntity.ok(response);
        }

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

@GetMapping("/{id}")
    public ResponseEntity<?> obtenerHuespedPorId(@PathVariable Long id) {
        try {
            // Asumo que tienes este método en tu Gestor. Si no, mira el paso 2.
            Huesped huesped = gestorHuesped.buscarPorId(id); 
            return ResponseEntity.ok(huesped);
        } catch (Exception e) {
            // Si no existe o hay error, devolvemos 404 para que el front lo maneje
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarHuesped(@PathVariable Long id, @Valid @RequestBody HuespedDTO huespedDTO) {
        try {
            // Llamamos al gestor para actualizar
            Huesped actualizado = gestorHuesped.actualizarHuesped(id, huespedDTO);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @DeleteMapping("/baja/{id}")
public ResponseEntity<?> eliminarHuesped(@PathVariable Long id) {
    try {
        gestorHuesped.eliminarHuesped(id);
        return ResponseEntity.ok(
            "Los datos del huésped han sido eliminados del sistema."
        );

    } catch (IllegalStateException e) {
        // Caso: el huésped tuvo estadías
        return ResponseEntity.badRequest().body(
            Map.of("error", e.getMessage())
        );

    } catch (RuntimeException e) {
        // Huésped no encontrado
        return ResponseEntity.notFound().build();
    }
}


}

