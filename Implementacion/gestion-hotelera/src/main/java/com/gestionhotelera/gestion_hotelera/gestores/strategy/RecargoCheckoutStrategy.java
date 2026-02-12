package com.gestionhotelera.gestion_hotelera.gestores.strategy;
import java.time.LocalTime;


public interface RecargoCheckoutStrategy {
    double calcularRecargo(LocalTime horaSalidaEfectiva, double precioNoche);
}