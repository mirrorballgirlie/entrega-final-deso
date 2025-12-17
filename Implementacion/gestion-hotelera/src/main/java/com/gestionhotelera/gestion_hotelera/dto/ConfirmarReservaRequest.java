// package com.gestionhotelera.gestion_hotelera.dto;

// import java.time.LocalDate;
// import java.util.List;

// import com.fasterxml.jackson.annotation.JsonFormat;

// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @AllArgsConstructor
// @NoArgsConstructor

// //modelar el request para la confirmacion de la reserva

// public class ConfirmarReservaRequest {

//     private List<Long> habitacionIds;  //una o mas habitaciones
//     @JsonFormat(pattern = "yyyy-MM-dd")
//     private LocalDate fechaDesde;
//     @JsonFormat(pattern = "yyyy-MM-dd")
//     private LocalDate fechaHasta;
//     //8. El sistema muestra el campo “Reserva a nombre de:  
//     //apellido 
//     //nombre 
//     //teléfono 
//     //punto 8 del CU4, por eso se presentan estos campos
//     private String nombre;
//     private String apellido;
//     private String telefono;

// }
package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// modelar el request para la confirmacion de la reserva
public class ConfirmarReservaRequest {

    private List<Long> habitacionIds;  // una o mas habitaciones
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaDesde;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaHasta;
    
    // Datos de contacto (Texto)
    private String nombre;
    private String apellido;
    private String telefono;

    // --- NUEVO CAMPO AGREGADO ---
    // Si el frontend manda un ID, buscamos al Huesped. Si manda null, guardamos solo texto.
    private Long clienteId; 
}