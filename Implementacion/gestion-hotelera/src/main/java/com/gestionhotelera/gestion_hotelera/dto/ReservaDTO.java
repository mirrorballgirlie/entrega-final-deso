// package com.gestionhotelera.gestion_hotelera.dto;
// import java.time.LocalDate;

// import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder


// public class ReservaDTO {

//     private int numero;
//     private EstadoReserva estado;
//     private LocalDate fechaDesde;
//     private LocalDate fechaHasta;
//     private String nombre;
//     private String apellido;
//     private String telefono;

// }

package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {

    private Long id; // A veces útil para updates
    private int numero;
    private EstadoReserva estado;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    
    // Datos de texto (siempre se envían)
    private String nombre;
    private String apellido;
    private String telefono;
    
    // --- NUEVO CAMPO: ID del Cliente (Opcional) ---
    private Long clienteId; 
    
    // También solemos necesitar el ID de la habitación al crear
    private Long habitacionId; 
}