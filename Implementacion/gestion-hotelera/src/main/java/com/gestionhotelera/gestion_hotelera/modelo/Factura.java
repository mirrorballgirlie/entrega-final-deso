package com.gestionhotelera.gestion_hotelera.modelo;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import com.gestionhotelera.gestion_hotelera.modelo.TipoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import lombok.Builder;

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
    private TipoFactura tipo;
    private String cuit;
    private double monto;
    private double iva;
    private double total;
    private LocalDateTime fechaEmision;
    EstadoFactura estado;

    @ManyToMany
    @JoinTable(
        name = "factura_impuesto",
        joinColumns = @JoinColumn(name = "factura_id"),
        inverseJoinColumns = @JoinColumn(name = "impuesto_id")
    )

    @lombok.Builder.Default

    private List<Impuesto> impuestos = new ArrayList<>();

    @OneToOne(optional = false)
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "responsable_id", nullable = false)
    private ResponsableDePago responsableDePago;

    @OneToMany(
    mappedBy = "factura",
    cascade = CascadeType.ALL,
    orphanRemoval = true)

    @lombok.Builder.Default

    private List<MetodoDePago> metodosDePago = new ArrayList<>();

    @OneToMany(mappedBy = "factura")
    @lombok.Builder.Default
    private List<Pago> pagos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "nota_credito_id")
    private NotaCredito notaCredito; // opcional






    private Factura(Builder builder) {
        this.nombre = builder.nombre;
        this.tipo = builder.tipo;
        this.cuit = builder.cuit;
        this.monto = builder.monto;
        this.iva = builder.iva;
        this.total = builder.total;
    }

    public static class Builder {
        private String nombre;
        private TipoFactura tipo;
        private String cuit;
        private double monto;
        private double iva;
        private double total;
        private LocalDateTime fechaEmision;
        private EstadoFactura estado;

        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder tipo(TipoFactura tipo) { this.tipo = tipo; return this; }
        public Builder cuit(String cuit) { this.cuit = cuit; return this; }
        public Builder monto(double monto) { this.monto = monto; return this; }
        public Builder iva(double iva) { this.iva = iva; return this; }
        public Builder total(double total) { this.total = total; return this; }

        public Factura build() { return new Factura(this); }
    }

    public double getTotal() { return total; }

  

    public void setTipo(String tipo) {
        this.tipo = TipoFactura.valueOf(tipo.toUpperCase());
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;   
    }

}

