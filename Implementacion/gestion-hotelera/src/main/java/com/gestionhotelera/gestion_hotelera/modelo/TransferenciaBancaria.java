package com.gestionhotelera.gestion_hotelera.modelo;
import java.util.Date;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

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
    private LocalDate fechaPago;
    private String titular;

}
