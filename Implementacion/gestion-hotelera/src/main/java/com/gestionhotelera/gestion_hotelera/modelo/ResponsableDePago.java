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

public class ResponsableDePago {

    private String cuit;

    @OneToMany(mappedBy = "responsableDePago")
    private List<Factura> facturas;


}
