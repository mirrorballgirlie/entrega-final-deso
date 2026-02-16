package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Data
@Table(name = "responsableDePago")
@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Indica que todos van a una sola tabla
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING) // Nombre de la columna de la imagen

public abstract class ResponsableDePago {

    @Column(unique = true, nullable = false)
    private String cuit;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "responsableDePago")
    private List<Factura> facturas;

    @Column(nullable = false)
    private String telefono; // <-- agregado, obligatorio

    // NUEVO: Método abstracto para que el Gestor pueda pedir el nombre sin importar el tipo
    public abstract String getNombreRazonSocial();


}
