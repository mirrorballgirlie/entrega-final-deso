package com.gestionhotelera.gestion_hotelera.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstadiaDTO {

    private Long id;
    private String nombreHuesped;
    private double montoBase;
    private EstadoEstadia estado;
    private LocalDate fechaIngreso;
    private LocalDate fechaEgreso;

   public static EstadiaDTO from(Estadia estadia) {
    EstadiaDTO dto = new EstadiaDTO();
    dto.setId(estadia.getId());
    
    // Como es una LISTA, sacamos el primero para el nombre
    if (estadia.getHuespedes() != null && !estadia.getHuespedes().isEmpty()) {
        Huesped primero = estadia.getHuespedes().get(0);
        dto.setNombreHuesped(primero.getNombre() + " " + primero.getApellido());
    } else {
        dto.setNombreHuesped("Sin huésped registrado");
    }
    
    if (estadia.getHabitacion() != null) {
        dto.setMontoBase(estadia.getHabitacion().getPrecio());
    }
    
    // Tu campo estado en la entidad es un String, no un Enum
    dto.setEstado(estadia.getEstado()); 
    dto.setFechaIngreso(estadia.getFechaIngreso());
    dto.setFechaEgreso(estadia.getFechaEgreso());
    
    return dto;
}
}