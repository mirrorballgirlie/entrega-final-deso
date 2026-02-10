package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import org.springframework.stereotype.Component;
import java.time.LocalTime;


@Component
public class RecargoEstandarStrategy implements RecargoCheckoutStrategy {
    @Override
    public double calcularRecargo(LocalTime horaSalidaEfectiva, double precioNoche) {
        LocalTime horaLimite = LocalTime.of(11, 0);
        if (horaSalidaEfectiva.isAfter(horaLimite)) {
            return precioNoche * 0.5; // 50% de recargo
        }
        return 0.0;
    }
}