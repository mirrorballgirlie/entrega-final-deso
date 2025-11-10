package com.gestionhotelera.gestion_hotelera.modelo;
import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;



@Table(name = "cheque")
//@Data

//recordar hacer los getters y setters manualmente

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Getter
@Setter

public class Cheque extends MetodoDePago{

    private String librador;
    private String bancoEmisor;

}
