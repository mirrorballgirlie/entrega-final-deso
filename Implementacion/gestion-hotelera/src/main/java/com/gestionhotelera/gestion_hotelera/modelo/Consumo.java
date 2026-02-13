package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    //en esta linea hay un error diciendo que el builder ignora el valor false en  facturado = false.
    //opcion segun chat
  
    //@Builder.Default
    //@Column(nullable = false)
    //private boolean facturado = false;
    //el efecto: si el builder no lo setea, pondra el valor false por defecto

    @Builder.Default
    @Column(nullable = false)
    private boolean facturado = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    public double getPrecioUnitario() {
        return precio;
    }
   
   
    

}
