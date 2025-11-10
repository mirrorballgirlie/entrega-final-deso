package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import lombok.*;

//recordar hacer los getters y setters a mano
@Entity
@Table(name = "tarjetaCredito")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor


public class TarjetaCredito extends MetodoDePago {

    private String numeroTarjetaCredito;
    private String titular;
    private String bancoEmisor;
    private int cuotas;
}
