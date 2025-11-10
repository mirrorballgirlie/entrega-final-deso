package com.gestionhotelera.gestion_hotelera.dto;

import com.gestionhotelera.gestion_hotelera.modelo.TipoCama;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data                     // Getters, setters, toString, equals, hashCode
@NoArgsConstructor         // Constructor vacío
@AllArgsConstructor        // Constructor con todos los campos
@Builder                   // Patrón Builder automático

public class CamaDTO {

    private TipoCama tipo;
    private int cantidad;

    

}
