package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;


//@Data
//@EqualsAndHashCode(callSuper = true)
//hacer los getters y los setters manualmente
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@Setter
public class ChequeDTO extends MetodoDePagoDTO{

    private String librador;
    private String bancoEmisor;

}
