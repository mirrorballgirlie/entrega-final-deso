package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import org.springframework.stereotype.Component;

import com.gestionhotelera.gestion_hotelera.dto.ModificarResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.modelo.Direccion;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor


public class ModificarPersonaJuridicaStrategy implements ModificarResponsableDePagoStrategy {

    @Override
    public void modificar(ResponsableDePago responsable, ModificarResponsableDePagoRequest request) {

        PersonaJuridica pj = (PersonaJuridica) responsable;

        if (request.getTelefono() != null) {
            pj.setTelefono(request.getTelefono());
        }

        if (request.getRazonSocial() != null) {
            pj.setNombreRazonSocial(request.getRazonSocial().toUpperCase());
        }

        if (request.getDireccion() != null) {
            Direccion d = pj.getDireccion();
            d.setCalle(request.getDireccion().getCalle().toUpperCase());
            d.setNumero(request.getDireccion().getNumero());
            d.setPiso(request.getDireccion().getPiso());
            d.setDepartamento(request.getDireccion().getDepartamento());
            d.setCodigoPostal(request.getDireccion().getCodigoPostal().toUpperCase());
            d.setCiudad(request.getDireccion().getCiudad().toUpperCase());
            d.setProvincia(request.getDireccion().getProvincia().toUpperCase());
            d.setPais(request.getDireccion().getPais().toUpperCase());
        }
    }

    

}
