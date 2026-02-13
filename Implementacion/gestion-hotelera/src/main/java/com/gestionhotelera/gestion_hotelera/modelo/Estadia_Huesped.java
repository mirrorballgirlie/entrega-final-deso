package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estadia_huesped") // Nombre de la tabla en la DB
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estadia_Huesped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    @ManyToOne
    @JoinColumn(name = "huesped_id", nullable = false)
    private Huesped huesped;

}