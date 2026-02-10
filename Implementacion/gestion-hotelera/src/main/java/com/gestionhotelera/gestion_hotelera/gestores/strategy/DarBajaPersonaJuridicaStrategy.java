package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import org.springframework.stereotype.Component;

import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import com.gestionhotelera.gestion_hotelera.repository.PersonaJuridicaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DarBajaPersonaJuridicaStrategy implements DarBajaResponsableStrategy {

    private final PersonaJuridicaRepository personaJuridicaRepository;

    @Override
    public void darBaja(ResponsableDePago responsable) {
        personaJuridicaRepository.delete((PersonaJuridica) responsable);
    }
}

