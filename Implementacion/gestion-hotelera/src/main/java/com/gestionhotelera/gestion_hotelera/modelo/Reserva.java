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