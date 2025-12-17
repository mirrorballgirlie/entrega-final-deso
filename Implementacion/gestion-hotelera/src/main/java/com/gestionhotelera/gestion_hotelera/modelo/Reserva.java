// package com.gestionhotelera.gestion_hotelera.modelo;
// import java.time.LocalDate;

// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.OneToOne;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @Entity
// @Table(name = "reserva")
// @Builder
// @AllArgsConstructor
// @NoArgsConstructor


// public class Reserva {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
        
//     private int numero;

//     // @Enumerated(EnumType.STRING)
//     @Enumerated(EnumType.ORDINAL)
//     private EstadoReserva estado;
    
//     private LocalDate fechaDesde;
//     private LocalDate fechaHasta;
//     private String nombre;
//     private String apellido;
//     private String telefono;

//     @OneToOne(mappedBy = "reserva")
//     private Estadia estadia; // opcional

//     @ManyToOne(optional = false)
//     @JoinColumn(name = "habitacion_id", nullable = false)
//     private Habitacion habitacion;


//     /*
//     private Reserva(Builder builder) {
//         this.numero = builder.numero;
//         this.estado = builder.estado;
//         this.fechaDesde = builder.fechaDesde;
//         this.fechaHasta = builder.fechaHasta;
//         this.nombre = builder.nombre;
//         this.apellido = builder.apellido;
//         this.telefono = builder.telefono;
//     }

//     public static class Builder {
//         private int numero;
//         private EstadoReserva estado;
//         private Date fechaDesde;
//         private Date fechaHasta;
//         private String nombre;
//         private String apellido;
//         private String telefono;

//         public Builder numero(int numero) { this.numero = numero; return this; }
//         public Builder estado(EstadoReserva estado) { this.estado = estado; return this; }
//         public Builder fechaDesde(Date fechaDesde) { this.fechaDesde = fechaDesde; return this; }
//         public Builder fechaHasta(Date fechaHasta) { this.fechaHasta = fechaHasta; return this; }
//         public Builder nombre(String nombre) { this.nombre = nombre; return this; }
//         public Builder apellido(String apellido) { this.apellido = apellido; return this; }
//         public Builder telefono(String telefono) { this.telefono = telefono; return this; }

//         public Reserva build() { return new Reserva(this); }
//     }

//     public int getNumero() { return numero; }
//     public EstadoReserva getEstado() { return estado; }
//     public Date getFechaDesde() { return fechaDesde; }
//     public Date getFechaHasta() { return fechaHasta; }
//     public String getNombre() { return nombre; }
//     public String getApellido() { return apellido; }
//     public String getTelefono() { return telefono; }

//     @Override
//     public String toString() {
//         return "Reserva N°" + numero + " - " + estado + " (" + nombre + " " + apellido + ")";
//     }
//         */
// }
package com.gestionhotelera.gestion_hotelera.modelo;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "reserva")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString // Se puede usar, pero excluyendo las relaciones
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
        
    private int numero;

    @Enumerated(EnumType.ORDINAL) // 0=ACTIVA, 1=CANCELADA
    private EstadoReserva estado;
    
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    
    // Datos de contacto (Texto simple)
    private String nombre;
    private String apellido;
    private String telefono;

    // --- NUEVO CAMPO: Vínculo con Cliente Real (Opcional) ---
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = true) // Puede ser NULL si es solo texto
    @ToString.Exclude
    private Huesped cliente;

    // --- RELACIONES ---
    @OneToOne(mappedBy = "reserva")
    @ToString.Exclude
    private Estadia estadia; // opcional

    @ManyToOne(optional = false)
    @JoinColumn(name = "habitacion_id", nullable = false)
    @ToString.Exclude
    private Habitacion habitacion;

    // --- MÉTODOS ---
    @PrePersist
    public void prePersist() {
        if (this.estado == null) {
            this.estado = EstadoReserva.ACTIVA;
        }
    }
}