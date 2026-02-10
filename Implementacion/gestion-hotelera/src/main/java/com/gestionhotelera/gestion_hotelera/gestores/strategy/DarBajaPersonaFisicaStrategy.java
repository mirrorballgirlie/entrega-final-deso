package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import org.springframework.stereotype.Component;

import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import com.gestionhotelera.gestion_hotelera.repository.PersonaFisicaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DarBajaPersonaFisicaStrategy implements DarBajaResponsableStrategy {

    private final PersonaFisicaRepository personaFisicaRepository;

    @Override
    public void darBaja(ResponsableDePago responsable) {
        PersonaFisica pf = (PersonaFisica) responsable;
        Huesped huesped = pf.getHuesped();
        if (huesped != null) {
            huesped.setPersonaFisica(null); // desvincular relación
        }
        pf.setHuesped(null);
        personaFisicaRepository.delete(pf); // borra solo la entidad PersonaFisica
    }
}

