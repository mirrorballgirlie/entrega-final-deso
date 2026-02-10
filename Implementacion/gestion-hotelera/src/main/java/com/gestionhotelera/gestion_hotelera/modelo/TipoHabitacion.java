package com.gestionhotelera.gestion_hotelera.modelo;

public enum TipoHabitacion {
    // 1. Definición de constantes
    INDIVIDUAL_ESTANDAR,
    DOBLE_ESTANDAR,
    DOBLE_SUPERIOR,
    SUPERIOR_FAMILY_PLAN,
    SUITE_DOBLE; 

    
    public double getPrecioNoche() {
        switch (this) {
            case INDIVIDUAL_ESTANDAR: return 1000.0;
            case DOBLE_ESTANDAR: return 1500.0;
            case DOBLE_SUPERIOR: return 2000.0;
            case SUPERIOR_FAMILY_PLAN: return 2500.0;
            case SUITE_DOBLE: return 3000.0;
            default: throw new IllegalArgumentException("Tipo de habitación desconocido");
        }
    }
}