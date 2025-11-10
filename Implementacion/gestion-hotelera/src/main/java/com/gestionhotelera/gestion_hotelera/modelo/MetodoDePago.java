package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.Date;
import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;

@Entity
@Table(name = "metodoDePago")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class MetodoDePago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date fechaPago;
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
