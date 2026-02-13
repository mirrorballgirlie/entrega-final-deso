package com.gestionhotelera.gestion_hotelera.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class ConsumoDTO {


    private Long id;  // <-- agregar este campo para identificar el consumo, útil para el frontend
    private String nombre;
    private int cantidad;
    private double precio;
    private double subtotal;

}
