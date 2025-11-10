package com.gestionhotelera.gestion_hotelera.modelo;

import lombok.*;

import java.util.ArrayList;

import jakarta.persistence.*;
import java.util.List;

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

    @ManyToMany
    @JoinTable(
    name = "factura_impuesto",
    joinColumns = @JoinColumn(name = "factura_id"),
    inverseJoinColumns = @JoinColumn(name = "impuesto_id"))

    @Builder.Default

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

    @Builder.Default

    private List<MetodoDePago> metodosDePago = new ArrayList<>();

    @OneToMany(mappedBy = "factura")
    @Builder.Default
    private List<Pago> pagos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "nota_credito_id")
    private NotaCredito notaCredito; // opcional






    /*private Factura(Builder builder) {
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

        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder tipo(TipoFactura tipo) { this.tipo = tipo; return this; }
        public Builder cuit(String cuit) { this.cuit = cuit; return this; }
        public Builder monto(double monto) { this.monto = monto; return this; }
        public Builder iva(double iva) { this.iva = iva; return this; }
        public Builder total(double total) { this.total = total; return this; }

        public Factura build() { return new Factura(this); }
    }

    public double getTotal() { return total; }

    /*@Override
    public String toString() {
        return tipo + " - " + nombre + " - Total: $" + total;
    }*/

}

