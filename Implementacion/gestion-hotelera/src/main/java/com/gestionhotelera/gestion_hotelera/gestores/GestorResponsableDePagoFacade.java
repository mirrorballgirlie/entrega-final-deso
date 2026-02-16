package com.gestionhotelera.gestion_hotelera.gestores;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.gestionhotelera.gestion_hotelera.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.AltaResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.dto.ModificarResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.dto.TipoPersona;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.DarBajaPersonaFisicaStrategy;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.DarBajaPersonaJuridicaStrategy;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.DarBajaResponsableStrategy;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.ModificarPersonaFisicaStrategy;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.ModificarPersonaJuridicaStrategy;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.ModificarResponsableDePagoStrategy;
import com.gestionhotelera.gestion_hotelera.modelo.Direccion;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;

import lombok.RequiredArgsConstructor;
import lombok.*;

@Service
@RequiredArgsConstructor
@Transactional
public class GestorResponsableDePagoFacade {

    private final PersonaJuridicaRepository personaJuridicaRepository;
    private final PersonaFisicaRepository personaFisicaRepository;
    private final HuespedRepository huespedRepository;
    //NO pienso usar el huesped, me rindo - edit: no quedo de otra
    private final ResponsableDePagoRepository responsableRepository;
    //estrategias aca
    private final DarBajaPersonaJuridicaStrategy darBajaPersonaJuridicaStrategy;
    private final DarBajaPersonaFisicaStrategy darBajaPersonaFisicaStrategy;
    private final ModificarPersonaJuridicaStrategy modificarPersonaJuridicaStrategy;
    private final ModificarPersonaFisicaStrategy modificarPersonaFisicaStrategy;
    private final DireccionRepository direccionRepository;

    private final ResponsableDePagoRepository responsableDePagoRepository;


    /*
     * CU03 - Buscar Responsable de Pago
     * Permite al conserje buscar un responsable de pago (Persona Jurídica o Física)
     * según criterios: razon social y/o CUIT.
     * Si no se ingresa ningún filtro, se devuelven todos los responsables de pago.
     *
     * @param razonSocial filtro de razón social o nombre completo (puede ser null)
     * @param cuit        filtro de CUIT (puede ser null)
     * @return lista de ResponsablesDePago que cumplen los criterios
     *
     *
     */


    @Transactional(readOnly = true)

//buscar responsable

    public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {
        //busco en tabla de responsables ya existentes (fisicas/juridicas)
        return responsableRepository.buscarPorCriterios(razonSocial, cuit);
    }
//dar alta
    @Transactional
    public ResponsableDePago darAltaResponsableDePago(AltaResponsableDePagoRequest request){
        validarCamposObligatoriosAlta(request);
        verificarCuitDuplicado(request.getCuit());

        if(request.getTipoPersona() == TipoPersona.JURIDICA){
            return crearPersonaJuridica(request);
        } else {
            return crearPersonaFisica(request);
        }
    }
    //metodos de dar alta
    private void validarCamposObligatoriosAlta(AltaResponsableDePagoRequest request) {
        List<String> faltantes = new ArrayList<>();

        if (request.getTipoPersona() == null) faltantes.add("Tipo de Persona");
        if (request.getCuit() == null || request.getCuit().isBlank()) faltantes.add("CUIT");
        if (request.getTelefono() == null || request.getTelefono().isBlank()) faltantes.add("Teléfono");
        if (request.getRazonSocial() == null || request.getRazonSocial().isBlank()) faltantes.add("Nombre/Razón Social");
        if (request.getDireccion() == null) faltantes.add("Dirección");

        if (!faltantes.isEmpty()) {
            throw new RuntimeException("Datos obligatorios faltantes: " + String.join(", ", faltantes));
        }
    }
    private void verificarCuitDuplicado(String cuit) {
        if (personaFisicaRepository.existsByCuit(cuit) || personaJuridicaRepository.existsByCuit(cuit)) {
            throw new RuntimeException("El CUIT " + cuit + " ya se encuentra registrado en el sistema.");
        }
    }
    private PersonaJuridica crearPersonaJuridica(AltaResponsableDePagoRequest request) {
        PersonaJuridica pj = new PersonaJuridica();
        pj.setCuit(request.getCuit());
        pj.setNombreRazonSocial(request.getRazonSocial().toUpperCase());
        pj.setTelefono(request.getTelefono()); 

        pj.setDireccion(mapearDireccion(request, pj, null));
        return personaJuridicaRepository.save(pj);
    }

    private PersonaFisica crearPersonaFisica(AltaResponsableDePagoRequest request) {
        PersonaFisica pf = new PersonaFisica();
        pf.setCuit(request.getCuit());
        pf.setTelefono(request.getTelefono());
        pf.setNombreRazonSocial(request.getRazonSocial().toUpperCase());
        pf.setHuesped(null); 

         PersonaFisica pfGuardada = personaFisicaRepository.save(pf);

        Direccion dir = mapearDireccion(request, null, pfGuardada);
        direccionRepository.save(dir);

       

        return pfGuardada;
    }
    private Direccion mapearDireccion(AltaResponsableDePagoRequest request, PersonaJuridica pj, PersonaFisica pf) {
        return Direccion.builder()
                .calle(request.getDireccion().getCalle().toUpperCase())
                .numero(request.getDireccion().getNumero())
                .piso(request.getDireccion().getPiso())
                .departamento(request.getDireccion().getDepartamento())
                .codigoPostal(request.getDireccion().getCodigoPostal().toUpperCase())
                .ciudad(request.getDireccion().getCiudad().toUpperCase())
                .provincia(request.getDireccion().getProvincia().toUpperCase())
                .pais(request.getDireccion().getPais().toUpperCase())
                .personaJuridica(pj)
                .personaFisica(pf)
                .build();
    }
    @Transactional
    public void modificarResponsableDePago(Long id, ModificarResponsableDePagoRequest request){
        ResponsableDePago responsable = buscarPorId(id);

        if(responsable instanceof PersonaJuridica pj){
            modificarPersonaJuridicaStrategy.modificar(pj, request);
            personaJuridicaRepository.save(pj);
        } else if(responsable instanceof PersonaFisica pf){
            modificarPersonaFisicaStrategy.modificar(pf, request);
            personaFisicaRepository.save(pf);
        }
    }
    //metodos de modifica
    private ResponsableDePago buscarPorId(Long id) {
        return personaJuridicaRepository.findById(id)
                .map(pj -> (ResponsableDePago) pj)
                .orElseGet(() -> personaFisicaRepository.findById(id)
                        .map(pf -> (ResponsableDePago) pf)
                        .orElseThrow(() -> new RuntimeException("Responsable de Pago no encontrado con ID: " + id)));
    }

    public ResponsableDePago obtenerResponsablePorId(Long id) {
        return responsableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsable no encontrado"));
    }
    @Transactional
    public void darBajaResponsableDePago(Long id) {
        ResponsableDePago responsable = buscarPorId(id);
        validarSiPuedeEliminarse(responsable);

        if(responsable instanceof PersonaJuridica pj){
            darBajaPersonaJuridicaStrategy.darBaja(pj);
        } else  if(responsable instanceof PersonaFisica pf){
            darBajaPersonaFisicaStrategy.darBaja(pf);
        }
    }
    //metodos para la baja
    private void validarSiPuedeEliminarse(ResponsableDePago responsable) {
        if (responsable.getFacturas() != null && !responsable.getFacturas().isEmpty()) {
            throw new RuntimeException("La firma no puede ser eliminada pues posee facturas confeccionadas.");
        }
    }


    //para facturar

    public ResponsableDePago buscarUnicoPorCuit(String cuit) {
        // Buscamos en el repositorio
        return responsableDePagoRepository.findByCuit(cuit)
                .orElse(null); // Si no lo encuentra, devuelve null (el Controller enviará el 404)
    }

    //toma un huesped y lo asegura como responsable de pago (persona fisica)
    //si ya existe lo devuelve, si no lo crea copiando datos

    @Transactional
    public ResponsableDePago asegurarHuespedComoResponsable(Long huespedId) {
        // buscamos si ya existe una PersonaFisica vinculada a este Huésped
        Optional<PersonaFisica> existente = personaFisicaRepository.findByHuespedId(huespedId);

        if (existente.isPresent()) {
            return existente.get();
        }

        // no existe, buscamos el huésped para obtener sus datos
        Huesped huesped = huespedRepository.findById(huespedId)
                .orElseThrow(() -> new RuntimeException("Huésped no encontrado con ID: " + huespedId));

        // creamos la nueva PersonaFisica
        // usamos el documento como CUIT si no tiene uno
        PersonaFisica nuevaPf = new PersonaFisica();
        nuevaPf.setCuit(huesped.getDocumento());
        nuevaPf.setNombreRazonSocial((huesped.getNombre() + " " + huesped.getApellido()).toUpperCase());
        nuevaPf.setTelefono(huesped.getTelefono() != null ? huesped.getTelefono() : "S/N");
        nuevaPf.setHuesped(huesped); // IMPORTANTE: Mantenemos la relación

        PersonaFisica guardada = personaFisicaRepository.save(nuevaPf);

        if (huesped.getDireccion() != null) {
            Direccion dir = Direccion.builder()
                    .calle(huesped.getDireccion().getCalle())
                    .numero(huesped.getDireccion().getNumero())
                    .piso(huesped.getDireccion().getPiso())
                    .departamento(huesped.getDireccion().getDepartamento())
                    .codigoPostal(huesped.getDireccion().getCodigoPostal())
                    .ciudad(huesped.getDireccion().getCiudad())
                    .provincia(huesped.getDireccion().getProvincia())
                    .pais(huesped.getDireccion().getPais())
                    .personaFisica(guardada)
                    .build();
            direccionRepository.save(dir);
        }

        return guardada;
    }

}

