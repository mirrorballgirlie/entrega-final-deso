package com.gestionhotelera.gestion_hotelera.modelo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "factura")
@Entity
public class Factura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    // CORRECCIÓN 1: Mapeo de Enum. 
    // Sin esto, JPA guarda un entero (0, 1) que causa errores si la BD espera String ('A', 'B') o si cambias el orden del Enum.
    @Enumerated(EnumType.STRING)
    private TipoFactura tipo;
    
    private String cuit;
    private double monto;
    private double iva;
    private double total;
    private LocalDateTime fechaEmision;

    // CORRECCIÓN ADICIONAL: También mapear el estado como STRING
    @Enumerated(EnumType.STRING)
    private EstadoFactura estado;

    @ManyToMany
    @JoinTable(
        name = "factura_impuesto",
        joinColumns = @JoinColumn(name = "factura_id"),
        inverseJoinColumns = @JoinColumn(name = "impuesto_id")
    )
    @Builder.Default
    private List<Impuesto> impuestos = new ArrayList<>();

    // CORRECCIÓN 3: Cambio de @OneToOne a @ManyToOne.
    // Lógica de Negocio: Una estadía podría tener múltiples facturas (ej: pago parcial, facturación dividida, notas de crédito).
    // Si mantienes OneToOne, el segundo intento de facturar la misma estadía dará Error 500.
    @ManyToOne(optional = false)
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "responsable_id", nullable = false)
    private ResponsableDePago responsableDePago;

    @OneToMany(
        mappedBy = "factura",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<MetodoDePago> metodosDePago = new ArrayList<>();

    @OneToMany(mappedBy = "factura")
    @Builder.Default
    private List<Pago> pagos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "nota_credito_id")
    private NotaCredito notaCredito; // opcional

    public double getTotal() { 
        return total; 
    }

    public void setTipo(String tipo) {
        this.tipo = TipoFactura.valueOf(tipo.toUpperCase());
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;   
    }
}


