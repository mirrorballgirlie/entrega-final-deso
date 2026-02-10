package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class ConsumoDTO {
 
    private String nombre;
    private int cantidad;
    private double precio;
    private double subtotal;

}
