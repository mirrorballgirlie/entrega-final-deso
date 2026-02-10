package com.gestionhotelera.gestion_hotelera.modelo;
import java.time.LocalDate;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "metodoDePago")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder

@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_metodo_pago", discriminatorType = DiscriminatorType.STRING)


public abstract class MetodoDePago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaPago;
    private double monto;


    @ManyToOne
    @JoinColumn(name = "factura_id")
    private Factura factura; // opcional

    /*public MetodoDePago(double monto, Date fechaPago) {
        this.monto = monto;
        this.fechaPago = fechaPago;
    }

    // getters y setters
    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public Date getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Date fechaPago) {
        this.fechaPago = fechaPago;
    }

    // método abstracto
    //public abstract void procesarPago();
    
    */
}
