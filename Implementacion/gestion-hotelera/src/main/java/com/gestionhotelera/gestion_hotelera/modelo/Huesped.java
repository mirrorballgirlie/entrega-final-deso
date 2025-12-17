package com.gestionhotelera.gestion_hotelera.modelo;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "huesped")
@Entity

public class Huesped {

@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String tipoDocumento;
    private String documento;
    private String posicionIVA;
    private LocalDate fechaNacimiento;
    private String telefono;
    private String email;
    private String ocupacion;
    private String nacionalidad;

    // --- 2. AQUÍ ESTÁ LA CORRECCIÓN ---
    @ManyToMany(mappedBy = "huespedes")
    @JsonIgnore // <--- ESTO EVITA EL ERROR DE REFERENCIA CIRCULAR
    private List<Estadia> estadias;

    @OneToOne(mappedBy = "huesped")
    @JsonIgnore // <--- RECOMENDADO: Para evitar bucles si PersonaFisica tiene link al Huesped
    private PersonaFisica personaFisica; 

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "direccion_id", nullable = false)
    private Direccion direccion;



    /*private Huesped(Builder builder) {
        this.nombre = builder.nombre;
        this.apellido = builder.apellido;
        this.tipoDocumento = builder.tipoDocumento;
        this.documento = builder.documento;
        this.posicionIVA = builder.posicionIVA;
        this.fechaNacimiento = builder.fechaNacimiento;
        this.telefono = builder.telefono;
        this.email = builder.email;
        this.ocupacion = builder.ocupacion;
        this.nacionalidad = builder.nacionalidad;
    }

    public static class Builder {
        private String nombre;
        private String apellido;
        private String tipoDocumento;
        private String documento;
        private String posicionIVA;
        private Date fechaNacimiento;
        private String telefono;
        private String email;
        private String ocupacion;
        private String nacionalidad;

        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder apellido(String apellido) { this.apellido = apellido; return this; }
        public Builder tipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; return this; }
        public Builder documento(String documento) { this.documento = documento; return this; }
        public Builder posicionIVA(String posicionIVA) { this.posicionIVA = posicionIVA; return this; }
        public Builder fechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; return this; }
        public Builder telefono(String telefono) { this.telefono = telefono; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder ocupacion(String ocupacion) { this.ocupacion = ocupacion; return this; }
        public Builder nacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; return this; }

        public Huesped build() { return new Huesped(this); }
    }

    // Getters
    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getTipoDocumento() { return tipoDocumento; }
    public String getDocumento() { return documento; }
    public String getEmail() { return email; }

    /*@Override
    public String toString() {
        return nombre + " " + apellido + " (" + documento + ")";
    }*/


}
