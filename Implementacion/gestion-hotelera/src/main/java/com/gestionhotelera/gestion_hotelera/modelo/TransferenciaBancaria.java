package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.Date;
import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

@Entity
//@Table(name = "transferenciaBancaria")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("TRANSFERENCIA_BANCARIA")

public class TransferenciaBancaria extends MetodoDePago {

    private String numeroTransferencia;
    private double monto;
    private Date fechaPago;
    private String titular;

}
