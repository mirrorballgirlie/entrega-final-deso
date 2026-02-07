package com.gestionhotelera.gestion_hotelera.gestores;

class EstrategiaEstadiaCompleta implements EstrategiaCancelacion {
    @Override
    public double calcularRecargo(double costo) { return costo; }
}