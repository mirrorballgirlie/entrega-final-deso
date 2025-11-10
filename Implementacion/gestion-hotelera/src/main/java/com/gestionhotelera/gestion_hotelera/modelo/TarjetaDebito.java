package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tarjetaDebito")
@SuperBuilder
//recordar hacer los getters y setters a mano
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

//recordar hacer los getters y setters a mano
public class TarjetaDebito extends MetodoDePago {

    private String numeroTarjetaDebito;
    private String titular;
    private String bancoEmisor;

}
