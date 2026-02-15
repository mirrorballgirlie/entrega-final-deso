package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@Table(name = "responsable_de_pago")
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public abstract class ResponsableDePago {

    @Column(unique = true, nullable = false)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cuit;
    //private String razonSocial;

    @OneToMany(mappedBy = "responsableDePago")
    private List<Factura> facturas;

    @Column(nullable = false)
    private String telefono; // <-- agregado, obligatorio

    public abstract String getRazonSocial();
}
