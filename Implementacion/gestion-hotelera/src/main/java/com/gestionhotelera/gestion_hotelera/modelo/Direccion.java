package com.gestionhotelera.gestion_hotelera.modelo;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "direccion")
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor


public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pais;
    private String provincia;
    private String ciudad;
    private String codigoPostal;
    private String calle;
    private int numero;
    private Integer piso; // opcional
    private String departamento; // opcional

    @OneToOne
    @JoinColumn(name = "persona_juridica_id")
    private PersonaJuridica personaJuridica;

    @OneToOne(mappedBy = "direccion")
    @JsonIgnore
    private Huesped huesped;







    /* 
    // 🔒 Constructor privado: solo el Builder puede usarlo
    private Direccion(Builder builder) {
        this.pais = builder.pais;
        this.provincia = builder.provincia;
        this.ciudad = builder.ciudad;
        this.codigoPostal = builder.codigoPostal;
        this.calle = builder.calle;
        this.numero = builder.numero;
        this.piso = builder.piso;
        this.departamento = builder.departamento;
    }

    // 🧱 Builder interno
    public static class Builder {
        private String pais;
        private String provincia;
        private String ciudad;
        private String codigoPostal;
        private String calle;
        private int numero;
        private Integer piso;
        private String departamento;

        public Builder pais(String pais) {
            this.pais = pais;
            return this;
        }

        public Builder provincia(String provincia) {
            this.provincia = provincia;
            return this;
        }

        public Builder ciudad(String ciudad) {
            this.ciudad = ciudad;
            return this;
        }

        public Builder codigoPostal(String codigoPostal) {
            this.codigoPostal = codigoPostal;
            return this;
        }

        public Builder calle(String calle) {
            this.calle = calle;
            return this;
        }

        public Builder numero(int numero) {
            this.numero = numero;
            return this;
        }

        public Builder piso(Integer piso) {
            this.piso = piso;
            return this;
        }

        public Builder departamento(String departamento) {
            this.departamento = departamento;
            return this;
        }

        public Direccion build() {
            return new Direccion(this);
        }
    }

    // ✅ Getters (sin setters, porque es inmutable)
    public String getPais() { return pais; }
    public String getProvincia() { return provincia; }
    public String getCiudad() { return ciudad; }
    public String getCodigoPostal() { return codigoPostal; }
    public String getCalle() { return calle; }
    public int getNumero() { return numero; }
    public Integer getPiso() { return piso; }
    public String getDepartamento() { return departamento; }

    */

}
