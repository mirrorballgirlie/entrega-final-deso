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
import jakarta.persistence.*;
import jakarta.persistence.Inheritance;

@Data
@Table(name = "responsable_de_pago")
@Entity
//@Inheritance(strategy = InheritanceType.JOINED)
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Indica que todos van a una sola tabla
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING) // Nombre de la columna de la imagen

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

    // NUEVO: Método abstracto para que el Gestor pueda pedir el nombre sin importar el tipo
    public abstract String getNombreRazonSocial();


}
