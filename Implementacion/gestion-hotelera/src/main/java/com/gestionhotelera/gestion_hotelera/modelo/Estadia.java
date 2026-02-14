

package com.gestionhotelera.gestion_hotelera.modelo;

import java.time.LocalDate;
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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "estadia")
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private EstadoEstadia estado;
    private LocalDate fechaIngreso;
    private LocalDate fechaEgreso;

    // Relación obligatoria con Habitación
    @ManyToOne(optional = false)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;

    // Relación opcional con Reserva
    @OneToOne
    @JoinColumn(name = "reserva_id")
    @ToString.Exclude            // <--- NUEVO: Evita bucles al imprimir logs
    @EqualsAndHashCode.Exclude   // <--- NUEVO: Evita comparar objetos profundos
    private Reserva reserva; 

    @ManyToMany
    @JoinTable(
        name = "estadia_huesped",
        joinColumns = @JoinColumn(name = "estadia_id"),
        inverseJoinColumns = @JoinColumn(name = "huesped_id")
    )
    @Builder.Default
    @ToString.Exclude            // <--- CRÍTICO AQUÍ: La lista de huéspedes suele romper el toString
    @EqualsAndHashCode.Exclude
    private List<Huesped> huespedes = new ArrayList<>();

    @OneToMany(
        mappedBy = "estadia",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    @ToString.Exclude            // <--- NUEVO
    @EqualsAndHashCode.Exclude
    private List<Consumo> consumos = new ArrayList<>();

    @OneToOne(mappedBy = "estadia")
    @ToString.Exclude            // <--- NUEVO
    @EqualsAndHashCode.Exclude
    private Factura factura;

    public double calcularTotal() {
        double total = 0.0;
        for (Consumo c : consumos) {
            total += c.getPrecioUnitario() * c.getCantidad();
        }
        return total;
    }

    
}