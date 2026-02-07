package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import org.springframework.stereotype.Component;

import com.gestionhotelera.gestion_hotelera.dto.ModificarResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor

public class ModificarPersonaFisicaStrategy implements ModificarResponsableDePagoStrategy {

    @Override
    public void modificar(ResponsableDePago responsable,
                           ModificarResponsableDePagoRequest request) {

        PersonaFisica pf = (PersonaFisica) responsable;

        if (request.getTelefono() != null) {
            pf.setTelefono(request.getTelefono());
        }

        // 📌 Dirección NO se modifica acá
        // Porque la dirección pertenece al huésped
        // y se gestiona por su propio CU
    }
}

