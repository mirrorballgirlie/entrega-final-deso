package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.ArrayList;
import java.util.Date;
import lombok.*;
import jakarta.persistence.*;
import java.util.List;

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
    private Date fechaIngreso;
    private Date fechaEgreso;

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

