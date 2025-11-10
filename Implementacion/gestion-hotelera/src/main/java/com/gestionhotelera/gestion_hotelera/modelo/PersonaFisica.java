package com.gestionhotelera.gestion_hotelera.modelo;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class PersonaFisica extends ResponsableDePago {

    @OneToOne
    @JoinColumn(name = "huesped_id")
    private Huesped huesped; // opcional


   

}
