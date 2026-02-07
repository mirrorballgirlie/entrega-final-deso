package com.gestionhotelera.gestion_hotelera.gestores;

class EstrategiaSinRecargo implements EstrategiaCancelacion {
    @Override
    public double calcularRecargo(double costo) { return 0.0; }
}
