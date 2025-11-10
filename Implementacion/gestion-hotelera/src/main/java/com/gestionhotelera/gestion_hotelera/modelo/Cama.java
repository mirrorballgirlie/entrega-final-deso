package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cama")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Cama {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    //terminar de ver aca el tema del id de cama porque es una entidad debil

    @Column
    private TipoCama tipo;
    @Column
    private int cantidad;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;

}
