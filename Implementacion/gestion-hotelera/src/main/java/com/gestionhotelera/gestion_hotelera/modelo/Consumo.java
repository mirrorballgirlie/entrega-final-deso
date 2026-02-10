package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consumo")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Consumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column
    private String nombre;
    @Column
    private int cantidad;
    @Column
    private double precio;
    @Column(nullable = false)
    private boolean facturado = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    public double getPrecioUnitario() {
        return precio;
    }
   
   
    

}
