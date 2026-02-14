package com.gestionhotelera.gestion_hotelera.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionhotelera.gestion_hotelera.dto.ConsumoDTO;
import com.gestionhotelera.gestion_hotelera.dto.GenerarFacturaRequest;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.gestores.GestorFactura;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;

import lombok.RequiredArgsConstructor;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/facturas")
@RequiredArgsConstructor

 
public class FacturarController {
    private final GestorFactura gestorFactura;
    
    // @GetMapping("/buscar-ocupantes")                         //estamos buscando por fecha, cuando en el modelo existe una unica estadia activa por fecha
    // public ResponseEntity<List<HuespedDTO>> buscarOcupantes(
    //     @RequestParam Integer habitacion, 
    //     @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate salida) {
        
    //     List<HuespedDTO> ocupantes = gestorFactura.obtenerOcupantes(habitacion, salida);
    //     return ResponseEntity.ok(ocupantes);
    // }

    @GetMapping("/buscar-ocupantes")
    public ResponseEntity<List<HuespedDTO>> buscarOcupantes(
    @RequestParam Integer habitacion) {

    List<HuespedDTO> ocupantes = gestorFactura.obtenerOcupantes(habitacion);
    return ResponseEntity.ok(ocupantes);
}


    //selecciono un ocupante y veo si es mayor
    @GetMapping("/verificar-mayor/{huespedId}")
    public ResponseEntity<Boolean> verificarMayor(@PathVariable Long huespedId) {
        // El controlador solo recibe el ID y le pregunta al gestor
        boolean esMayor = gestorFactura.esMayorDeEdad(huespedId);
        return ResponseEntity.ok(esMayor);
    }

    // valor de los consumos individualmente, si quieren sumenlo y muestrenlo como 1 solo
    @GetMapping("/{estadiaId}/items-pendientes")
    public ResponseEntity<List<ConsumoDTO>> obtenerItemsPendientes(@PathVariable Long estadiaId) {
        // lista de lo que todavía no se pagó
        List<ConsumoDTO> items = gestorFactura.obtenerItemsPendientes(estadiaId);
        return ResponseEntity.ok(items);
    }

    //valor de la estadia
    @GetMapping("/{estadiaId}/valor-estadia")
    public ResponseEntity<Double> obtenerValorEstadia(@PathVariable Long estadiaId) {
        // valor total de la estadia, sin contar consumos
        double valor = gestorFactura.obtenerValorEstadia(estadiaId);
        return ResponseEntity.ok(valor);
    }

    @GetMapping("/{estadiaId}/valor-total")
    public double calcularMontoTotalPendiente(@PathVariable Long estadiaId) {
        // 1. Extraer el valor del sobre (ResponseEntity)
        Double valorEstadia = this.obtenerValorEstadia(estadiaId).getBody();

        List<ConsumoDTO> lista = this.obtenerItemsPendientes(estadiaId).getBody();
        
        double totalConsumos = 0;
        if (lista != null) {
            totalConsumos = lista.stream()
                    .mapToDouble(ConsumoDTO::getSubtotal)
                    .sum();
        }

        // 3. Retornamos el Neto Total
        return (valorEstadia != null ? valorEstadia : 0) + totalConsumos;
    }

    @PostMapping("/generar")
    public ResponseEntity<Factura> generarFactura(@RequestBody GenerarFacturaRequest request) {
        Factura factura = gestorFactura.generarFactura(request);
        return ResponseEntity.ok(factura);
    }
    
}
