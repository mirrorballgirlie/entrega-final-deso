package com.gestionhotelera.gestion_hotelera.gestores;

public class EstrategiaMediaEstadia implements EstrategiaCancelacion {
    @Override
    public double calcularRecargo(double costo) { return costo * 0.5; }
}