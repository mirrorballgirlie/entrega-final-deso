package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.Date;
import lombok.*;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pago")


public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int numeroDePago;
    private double monto;
    private Date fechaPago;

    @ManyToOne
    @JoinColumn(name = "factura_id")
    private Factura factura; // opcional


    /*private Pago(Builder builder) {
        this.numeroDePago = builder.numeroDePago;
        this.monto = builder.monto;
        this.fechaPago = builder.fechaPago;
    }

    public static class Builder {
        private int numeroDePago;
        private double monto;
        private Date fechaPago;

        public Builder numeroDePago(int numeroDePago) { this.numeroDePago = numeroDePago; return this; }
        public Builder monto(double monto) { this.monto = monto; return this; }
        public Builder fechaPago(Date fechaPago) { this.fechaPago = fechaPago; return this; }

        public Pago build() { return new Pago(this); }
    }

    @Override
    public String toString() {
        return "Pago #" + numeroDePago + " - $" + monto;
    }
    */
}

