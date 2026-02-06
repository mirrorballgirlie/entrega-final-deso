package com.gestionhotelera.gestion_hotelera.gestores;

public class EstrategiaEstadiaCompleta implements EstrategiaCancelacion {
    @Override
    public double calcularRecargo(double costo) { return costo; }
}