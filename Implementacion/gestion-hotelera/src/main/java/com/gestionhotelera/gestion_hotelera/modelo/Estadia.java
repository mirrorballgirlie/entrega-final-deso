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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "estadia")

public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String estado;
    private LocalDate fechaIngreso;
    private LocalDate fechaEgreso;

    @OneToOne(optional = false)
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;


    @OneToOne
    @JoinColumn(name = "reserva_id")
    private Reserva reserva; // opcional

    @ManyToMany
    @JoinTable(
    name = "estadia_huesped",
    joinColumns = @JoinColumn(name = "estadia_id"),
    inverseJoinColumns = @JoinColumn(name = "huesped_id")
)
    @Builder.Default
    private List<Huesped> huespedes = new ArrayList<>();

    @OneToMany(
    mappedBy = "estadia",
    cascade = CascadeType.ALL,
    orphanRemoval = true)

    @Builder.Default
    private List<Consumo> consumos = new ArrayList<>();

    @OneToOne(mappedBy = "estadia")
    private Factura factura;




    /*private Estadia(Builder builder) {
        this.estado = builder.estado;
        this.fechaIngreso = builder.fechaIngreso;
        this.fechaEgreso = builder.fechaEgreso;
    }

    public static class Builder {
        private String estado;
        private Date fechaIngreso;
        private Date fechaEgreso;

        public Builder estado(String estado) { this.estado = estado; return this; }
        public Builder fechaIngreso(Date fechaIngreso) { this.fechaIngreso = fechaIngreso; return this; }
        public Builder fechaEgreso(Date fechaEgreso) { this.fechaEgreso = fechaEgreso; return this; }

        public Estadia build() { return new Estadia(this); }
    }

    public String getEstado() { return estado; }

    /*@Override
    public String toString() {
        return "Estadía: " + estado + " desde " + fechaIngreso + " hasta " + fechaEgreso;
    }*/

}

