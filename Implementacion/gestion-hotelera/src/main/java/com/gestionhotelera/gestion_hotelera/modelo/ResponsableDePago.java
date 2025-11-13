package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import java.util.List;

@Data
@Table(name = "responsableDePago")
@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public abstract class ResponsableDePago {

    private String cuit;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "responsableDePago")
    private List<Factura> facturas;


}
