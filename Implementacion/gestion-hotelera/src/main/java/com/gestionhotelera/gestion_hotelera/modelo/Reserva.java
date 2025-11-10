package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.Date;
import lombok.*;
import jakarta.persistence.*;   

@Data
@Entity
@Table(name = "reserva")
@Builder


public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
        
    private int numero;
    private EstadoReserva estado;
    private Date fechaDesde;
    private Date fechaHasta;
    private String nombre;
    private String apellido;
    private String telefono;

    @OneToOne(mappedBy = "reserva")
    private Estadia estadia; // opcional

    @ManyToOne(optional = false)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;


    /*private Reserva(Builder builder) {
        this.numero = builder.numero;
        this.estado = builder.estado;
        this.fechaDesde = builder.fechaDesde;
        this.fechaHasta = builder.fechaHasta;
        this.nombre = builder.nombre;
        this.apellido = builder.apellido;
        this.telefono = builder.telefono;
    }

    public static class Builder {
        private int numero;
        private EstadoReserva estado;
        private Date fechaDesde;
        private Date fechaHasta;
        private String nombre;
        private String apellido;
        private String telefono;

        public Builder numero(int numero) { this.numero = numero; return this; }
        public Builder estado(EstadoReserva estado) { this.estado = estado; return this; }
        public Builder fechaDesde(Date fechaDesde) { this.fechaDesde = fechaDesde; return this; }
        public Builder fechaHasta(Date fechaHasta) { this.fechaHasta = fechaHasta; return this; }
        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder apellido(String apellido) { this.apellido = apellido; return this; }
        public Builder telefono(String telefono) { this.telefono = telefono; return this; }

        public Reserva build() { return new Reserva(this); }
    }

    public int getNumero() { return numero; }
    public EstadoReserva getEstado() { return estado; }
    public Date getFechaDesde() { return fechaDesde; }
    public Date getFechaHasta() { return fechaHasta; }
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getTelefono() { return telefono; }

    @Override
    public String toString() {
        return "Reserva N°" + numero + " - " + estado + " (" + nombre + " " + apellido + ")";
    }
        */
}
