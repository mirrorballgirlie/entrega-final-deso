package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;


//@Data
//hacer los getters y los setters manualmente
//@Table(name = "notaCredito")
@AllArgsConstructor
@SuperBuilder
@Entity
@Getter
@Setter
@NoArgsConstructor

@DiscriminatorValue("NOTA_CREDITO")


public class NotaCredito extends MetodoDePago{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private int numero;
    private double monto;
    private double iva;
    private double total;

    @OneToMany(mappedBy = "notaCredito")
    @Builder.Default
    private List<Factura> facturas = new ArrayList<>();

    



}
