package com.gestionhotelera.gestion_hotelera.gestores;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;

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
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.PersonaFisicaRepository;
import com.gestionhotelera.gestion_hotelera.repository.PersonaJuridicaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GestorResponsableDePagoFacade {

    private final PersonaJuridicaRepository personaJuridicaRepository;
    private final PersonaFisicaRepository personaFisicaRepository;
    private final DarBajaPersonaJuridicaStrategy darBajaPersonaJuridicaStrategy;
    private final DarBajaPersonaFisicaStrategy darBajaPersonaFisicaStrategy;
    private final ModificarPersonaJuridicaStrategy modificarPersonaJuridicaStrategy;
    private final ModificarPersonaFisicaStrategy modificarPersonaFisicaStrategy;
    private final HuespedRepository huespedRepository;




    /**
     * CU03 - Buscar Responsable de Pago
     * Permite al conserje buscar un responsable de pago (Persona Jurídica o Física)
     * según criterios: razon social y/o CUIT.
     * Si no se ingresa ningún filtro, se devuelven todos los responsables de pago.
     *
     * @param razonSocial filtro de razón social o nombre completo (puede ser null)
     * @param cuit filtro de CUIT (puede ser null)
     * @return lista de ResponsablesDePago que cumplen los criterios
     * 
     * 
     */





    public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {

    // --- Normalizar filtros ---
    String filtroTexto = normalizar(razonSocial);
    String filtroCuit = (cuit != null && !cuit.isBlank()) ? cuit.replace("-", "").trim() : null;

    List<String> palabrasFiltro = filtroTexto.isBlank()
            ? List.of()
            : List.of(filtroTexto.split("\\s+"))
                  .stream()
                  .filter(s -> !s.isBlank())
                  .toList();

    boolean sinFiltroTexto = palabrasFiltro.isEmpty();
    boolean sinFiltroCuit = (filtroCuit == null || filtroCuit.isBlank());

    List<ResponsableDePago> resultados = new ArrayList<>();

    // ================= PERSONA JURIDICA =================
    for (PersonaJuridica pj : personaJuridicaRepository.findAll()) {
        String nombre = pj.getNombreRazonSocial() == null ? "" : pj.getNombreRazonSocial();
        String textoBD = normalizar(nombre);

        boolean matcheaTexto = sinFiltroTexto || palabrasFiltro.stream().allMatch(textoBD::contains);
        boolean matcheaCuit = sinFiltroCuit || (pj.getCuit() != null && pj.getCuit().replace("-", "").contains(filtroCuit));

        if (matcheaTexto && matcheaCuit) {
            resultados.add(pj);
        }
    }

    // ================= PERSONA FISICA =================
    for (PersonaFisica pf : personaFisicaRepository.findAll()) {
        if (pf.getHuesped() == null) continue;

        String nombre = pf.getHuesped().getNombre() == null ? "" : pf.getHuesped().getNombre();
        String apellido = pf.getHuesped().getApellido() == null ? "" : pf.getHuesped().getApellido();
        String textoBD = normalizar(nombre + " " + apellido);

        boolean matcheaTexto = sinFiltroTexto || palabrasFiltro.stream().allMatch(textoBD::contains);
        boolean matcheaCuit = sinFiltroCuit || (pf.getCuit() != null && pf.getCuit().replace("-", "").contains(filtroCuit));

        if (matcheaTexto && matcheaCuit) {
            resultados.add(pf);
        }
    }

    // ================= RESULTADO =================
    // Si no hay filtros, devuelve todos los responsables de pago
    return resultados;
}

/**
 * Normaliza texto: saca tildes, convierte a minúsculas y reemplaza caracteres no alfanuméricos por espacio.
 */
private String normalizar(String texto) {
    if (texto == null) return "";
    return Normalizer.normalize(texto, Normalizer.Form.NFD)
            .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
            .replaceAll("[^a-zA-Z0-9 ]", " ")
            .toLowerCase()
            .trim();
}


//     public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {

//     String filtroTexto = normalizar(razonSocial);
//     String filtroCuit = (cuit != null) ? cuit.replace("-", "").trim() : null;

//     List<String> palabrasFiltro = filtroTexto.isBlank()
//             ? List.of()
//             : List.of(filtroTexto.split("\\s+"));

//     boolean sinFiltroTexto = palabrasFiltro.isEmpty();
//     boolean sinFiltroCuit = (filtroCuit == null || filtroCuit.isBlank());

//     List<ResponsableDePago> resultados = new ArrayList<>();

//     // ================= PERSONA JURIDICA =================
//     for (PersonaJuridica pj : personaJuridicaRepository.findAll()) {

//         String textoBD = normalizar(pj.getNombreRazonSocial());
//         boolean matcheaTexto = sinFiltroTexto ||
//                 palabrasFiltro.stream().allMatch(textoBD::contains);

//         boolean matcheaCuit = sinFiltroCuit ||
//                 pj.getCuit().replace("-", "").contains(filtroCuit);

//         if (matcheaTexto && matcheaCuit) {
//             resultados.add(pj);
//         }
//     }

//     // ================= PERSONA FISICA =================
//     for (PersonaFisica pf : personaFisicaRepository.findAll()) {
//         if (pf.getHuesped() == null) continue;

//         String textoBD = normalizar(
//                 pf.getHuesped().getNombre() + " " +
//                 pf.getHuesped().getApellido()
//         );

//         boolean matcheaTexto = sinFiltroTexto ||
//                 palabrasFiltro.stream().allMatch(textoBD::contains);

//         boolean matcheaCuit = sinFiltroCuit ||
//                 pf.getCuit().replace("-", "").contains(filtroCuit);

//         if (matcheaTexto && matcheaCuit) {
//             resultados.add(pf);
//         }
//     }

//     return resultados;
// }


//     public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {
//     List<ResponsableDePago> resultados = new ArrayList<>();

//     // --- Normalizar filtros ---
//     String filtroRazonSocial = (razonSocial != null && !razonSocial.isBlank())
//             ? normalizar(razonSocial)
//             : null;

//     String filtroCuit = (cuit != null && !cuit.isBlank())
//             ? cuit.replace("-", "").trim()
//             : null;

//     boolean sinFiltros = (filtroRazonSocial == null && filtroCuit == null);

//     // --- Buscar Persona Jurídica ---
//     for (PersonaJuridica pj : personaJuridicaRepository.findAll()) {
//         if (pj == null) continue;

//         boolean coincideRazonSocial = sinFiltros || filtroRazonSocial == null
//                 || (pj.getNombreRazonSocial() != null 
//                     && normalizar(pj.getNombreRazonSocial()).contains(filtroRazonSocial));

//         boolean coincideCuit = sinFiltros || filtroCuit == null
//                 || (pj.getCuit() != null 
//                     && pj.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocial && coincideCuit) {
//             resultados.add(pj);
//         }
//     }

//     // --- Buscar Persona Física ---
//     for (PersonaFisica pf : personaFisicaRepository.findAll()) {
//         if (pf == null || pf.getHuesped() == null) continue;

//         String nombreCompleto = pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido();
//         nombreCompleto = normalizar(nombreCompleto);

//         boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null
//                 || nombreCompleto.contains(filtroRazonSocial);

//         boolean coincideCuitPF = sinFiltros || filtroCuit == null
//                 || (pf.getCuit() != null && pf.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocialPF && coincideCuitPF) {
//             resultados.add(pf);
//         }
//     }

//     return resultados;
// }


// private String normalizar(String texto) {
//     if (texto == null) return "";

//     return Normalizer.normalize(texto, Normalizer.Form.NFD)
//             .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "") // saca tildes
//             .replaceAll("[^a-zA-Z0-9 ]", " ") // saca puntos, guiones, etc
//             .toLowerCase()
//             .trim();
// }


//     public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {

//     // --- Paso 1: Normalizar filtros ---
//     String filtroRazonSocial = (razonSocial != null && !razonSocial.isBlank())
//             ? razonSocial.toLowerCase().trim()
//             : null;

//     String filtroCuit = (cuit != null && !cuit.isBlank())
//             ? cuit.replace("-", "").trim()
//             : null;

//     // --- Paso 2: Determinar si no hay filtros ---
//     boolean sinFiltros = (filtroRazonSocial == null && filtroCuit == null);

//     // --- Paso 3: Lista donde guardaremos todos los resultados ---
//     List<ResponsableDePago> resultados = new ArrayList<>();

//     // --- Paso 4: Buscar Persona Jurídica ---
//     List<PersonaJuridica> listaPJ = personaJuridicaRepository.findAll();
//     for (PersonaJuridica pj : listaPJ) {

//         if (pj == null) continue;

//         // Nombre/razón social tipo Google
//         boolean coincideRazonSocial = sinFiltros || filtroRazonSocial == null
//                 || (pj.getNombreRazonSocial() != null
//                     && pj.getNombreRazonSocial().toLowerCase().contains(filtroRazonSocial));

//         // CUIT sin guiones
//         boolean coincideCuit = sinFiltros || filtroCuit == null
//                 || (pj.getCuit() != null
//                     && pj.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocial && coincideCuit) {
//             resultados.add(pj);
//         }
//     }

//     // --- Paso 5: Buscar Persona Física ---
//     List<PersonaFisica> listaPF = personaFisicaRepository.findAll();
//     for (PersonaFisica pf : listaPF) {

//         if (pf == null || pf.getHuesped() == null) continue;

//         String nombreCompleto = (pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido())
//                 .toLowerCase();

//         boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null
//                 || nombreCompleto.contains(filtroRazonSocial);

//         boolean coincideCuitPF = sinFiltros || filtroCuit == null
//                 || (pf.getCuit() != null && pf.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocialPF && coincideCuitPF) {
//             resultados.add(pf);
//         }
//     }

//     // --- Paso 6: Devolver resultados ---
//     return resultados;
// }


//     public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {
//     List<ResponsableDePago> resultados = new ArrayList<>();

//     // --- Paso 1: Normalizar filtros ---
//     String filtroRazonSocial = (razonSocial != null && !razonSocial.isBlank())
//             ? razonSocial.toLowerCase().trim()
//             : null;

//     String filtroCuit = (cuit != null && !cuit.isBlank())
//             ? cuit.replace("-", "").trim()
//             : null;
// 
//     // --- Paso 2: Determinar si no hay filtros ingresados ---
//     boolean sinFiltros = (filtroRazonSocial == null && filtroCuit == null);

//     // --- Paso 3: Buscar Persona Jurídica ---
//     List<PersonaJuridica> listaPJ = personaJuridicaRepository.findAll();
//     for (PersonaJuridica pj : listaPJ) {
//         boolean coincideRazonSocial = sinFiltros || filtroRazonSocial == null
//                 || (pj.getNombreRazonSocial() != null 
//                     && pj.getNombreRazonSocial().toLowerCase().contains(filtroRazonSocial));

//         boolean coincideCuit = sinFiltros || filtroCuit == null
//                 || (pj.getCuit() != null 
//                     && pj.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocial && coincideCuit) {
//             resultados.add(pj);
//         }
//     }

//     // --- Paso 4: Buscar Persona Física ---
//     List<PersonaFisica> listaPF = personaFisicaRepository.findAll();
//     for (PersonaFisica pf : listaPF) {
//         if (pf.getHuesped() == null) continue; // seguridad

//         String nombreCompleto = (pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido())
//                 .toLowerCase();

//         boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null
//                 || nombreCompleto.contains(filtroRazonSocial);

//         boolean coincideCuitPF = sinFiltros || filtroCuit == null
//                 || (pf.getCuit() != null 
//                     && pf.getCuit().replace("-", "").contains(filtroCuit));

//         if (coincideRazonSocialPF && coincideCuitPF) {
//             resultados.add(pf);
//         }
//     }

//     return resultados;
// }



    //    public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {
    //     List<ResponsableDePago> resultados = new ArrayList<>();

    //     // Buscar PJ
    //     resultados.addAll(personaJuridicaRepository.buscarPorFiltros(razonSocial, cuit));

    //     // Buscar PF
    //     resultados.addAll(personaFisicaRepository.buscarPorFiltros(razonSocial, cuit));

    //    return resultados;
    // }

//     public List<ResponsableDePago> buscarResponsableDePago(String razonSocial, String cuit) {

//         // --- Paso 2: preparación de filtros ---
//         // String filtroRazonSocial = (razonSocial != null && !razonSocial.isBlank()) ? razonSocial.toUpperCase() : null; // 3
//         // String filtroCuit = (cuit != null && !cuit.isBlank()) ? cuit.toUpperCase() : null; // 3

//         String filtroRazonSocial = (razonSocial != null && !razonSocial.isBlank())
//         ? razonSocial.toLowerCase().trim()
//         : null;

//         String filtroCuit = (cuit != null && !cuit.isBlank())
//         ? cuit.toLowerCase().trim()
//         : null;

        
//         // --- Paso 4: determinar si no hay filtros ---
//         boolean sinFiltros = (filtroRazonSocial == null && filtroCuit == null); // 4

//         // --- Lista donde guardaremos todos los resultados ---
//         List<ResponsableDePago> resultados = new ArrayList<>();

//         // --- Paso 4: Buscar Persona Jurídica ---
//         List<PersonaJuridica> listaPJ = personaJuridicaRepository.findAll(); // 4
//         for (PersonaJuridica pj : listaPJ) {
//             // boolean coincideRazonSocial = sinFiltros || filtroRazonSocial == null
//             //         || pj.getNombreRazonSocial().startsWith(filtroRazonSocial); // 4
//             // boolean coincideCuit = sinFiltros || filtroCuit == null
//             //         || pj.getCuit().startsWith(filtroCuit); // 4

//             boolean coincideRazonSocial = sinFiltros || filtroRazonSocial == null|| (pj.getNombreRazonSocial() != null && pj.getNombreRazonSocial().toLowerCase().contains(filtroRazonSocial));
//             boolean coincideCuit = sinFiltros || filtroCuit == null || (pj.getCuit() != null && pj.getCuit().toLowerCase().contains(filtroCuit));


//             if (coincideRazonSocial && coincideCuit) {
//                 resultados.add(pj); // 4
//             }
//         }

//         // --- Paso 4: Buscar Persona Física ---
//         List<PersonaFisica> listaPF = personaFisicaRepository.findAll(); // 4
//         // for (PersonaFisica pf : listaPF) {
//         //     String nombreCompleto = pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido(); // 4
//         //     boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null
//         //             || nombreCompleto.startsWith(filtroRazonSocial); // 4
//         //     boolean coincideCuitPF = sinFiltros || filtroCuit == null
//         //             || pf.getCuit().startsWith(filtroCuit); // 4

//         //     if (coincideRazonSocialPF && coincideCuitPF) {
//         //         resultados.add(pf); // 4
//         //     }
//         // }

//         for (PersonaFisica pf : listaPF) {

//             // 🔴 ESTO ES LO QUE FALTABA
//             if (pf.getHuesped() == null) {
//                 continue;
//             }

//             // String nombreCompleto = pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido();

//             // boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null || nombreCompleto.startsWith(filtroRazonSocial);

//             // boolean coincideCuitPF = sinFiltros || filtroCuit == null || pf.getCuit().startsWith(filtroCuit);

//             String nombreCompleto = (pf.getHuesped().getNombre() + " " + pf.getHuesped().getApellido()).toLowerCase();
//             boolean coincideRazonSocialPF = sinFiltros || filtroRazonSocial == null || nombreCompleto.contains(filtroRazonSocial); 
//             boolean coincideCuitPF = sinFiltros || filtroCuit == null || (pf.getCuit() != null && pf.getCuit().toLowerCase().contains(filtroCuit));

//             if (coincideRazonSocialPF && coincideCuitPF) {
//                 resultados.add(pf);
//             }
// }


//         // --- Paso 4.A: No existen coincidencias ---
//         // El controller decidirá si se invoca CU12 “Dar alta de Responsable de Pago”
//         return resultados; // 4.A.2 y 5
//     }

    public ResponsableDePago darAltaResponsableDePago(AltaResponsableDePagoRequest request) {

    // ==================================================
    // Paso 1 – Validar campos obligatorios
    // ==================================================
    List<String> errores = new ArrayList<>();

    if (request.getTipoPersona() == null)
        errores.add("Tipo de Persona");

    if (request.getCuit() == null || request.getCuit().isBlank())
        errores.add("CUIT");

    if (request.getTelefono() == null || request.getTelefono().isBlank())
        errores.add("Teléfono");

    if (request.getTipoPersona() == TipoPersona.JURIDICA) {
        // Razón social obligatoria para PJ
        if (request.getRazonSocial() == null || request.getRazonSocial().isBlank())
            errores.add("Razón Social");
        // Dirección obligatoria
        if (request.getDireccion() == null) {
            errores.add("Dirección");
        } else {
            if (request.getDireccion().getCalle() == null || request.getDireccion().getCalle().isBlank())
                errores.add("Calle");
            if (request.getDireccion().getNumero() <= 0)
                errores.add("Número");
            if (request.getDireccion().getCodigoPostal() == null || request.getDireccion().getCodigoPostal().isBlank())
                errores.add("Código Postal");
            if (request.getDireccion().getCiudad() == null || request.getDireccion().getCiudad().isBlank())
                errores.add("Ciudad");
            if (request.getDireccion().getProvincia() == null || request.getDireccion().getProvincia().isBlank())
                errores.add("Provincia");
            if (request.getDireccion().getPais() == null || request.getDireccion().getPais().isBlank())
                errores.add("País");
        }
    } else {
        // PF requiere huespedId existente
        if (request.getHuespedId() == null)
            errores.add("Huésped");
    }

    if (!errores.isEmpty()) {
        throw new RuntimeException(
            "Faltan los siguientes datos obligatorios: " + String.join(", ", errores)
        );
    }

    // ==================================================
    // Paso 2 – Verificar CUIT duplicado
    // ==================================================
    if (personaFisicaRepository.existsByCuit(request.getCuit())
        || personaJuridicaRepository.existsByCuit(request.getCuit())) {

        throw new RuntimeException("¡CUIDADO! El CUIT ya existe en el sistema");
    }

    // ==================================================
    // Paso 3 – Crear Responsable de Pago
    // ==================================================
    if (request.getTipoPersona() == TipoPersona.JURIDICA) {
        // Persona Jurídica
        PersonaJuridica pj = PersonaJuridica.builder()
            .cuit(request.getCuit())
            .nombreRazonSocial(request.getRazonSocial().toUpperCase())
            .telefono(request.getTelefono())
            .build();

        Direccion direccion = Direccion.builder()
            .calle(request.getDireccion().getCalle().toUpperCase())
            .numero(request.getDireccion().getNumero())
            .piso(request.getDireccion().getPiso())
            .departamento(request.getDireccion().getDepartamento())
            .codigoPostal(request.getDireccion().getCodigoPostal().toUpperCase())
            .ciudad(request.getDireccion().getCiudad().toUpperCase())
            .provincia(request.getDireccion().getProvincia().toUpperCase())
            .pais(request.getDireccion().getPais().toUpperCase())
            .personaJuridica(pj)
            .build();

        pj.setDireccion(direccion);

        personaJuridicaRepository.save(pj);
        return pj;

    } else {
        // Persona Física
        Huesped huesped = huespedRepository.findById(request.getHuespedId())
            .orElseThrow(() -> new RuntimeException("Huésped no encontrado"));

        PersonaFisica pf = PersonaFisica.builder()
            .huesped(huesped)
            .cuit(request.getCuit())
            .telefono(request.getTelefono())
            //.razonSocial((huesped.getNombre() + " " + huesped.getApellido()).toUpperCase())
            .build();

            // Luego seteamos la razón social
            pf.setNombreRazonSocial((huesped.getNombre() + " " + huesped.getApellido()).toUpperCase());

        personaFisicaRepository.save(pf);
        return pf;
    }
}


//     public ResponsableDePago darAltaResponsableDePago(AltaResponsableDePagoRequest request) {

//     // ==================================================
//     // Paso 2.A – Verificar que estén TODOS los datos
//     // ==================================================
//     List<String> errores = new ArrayList<>();

//     if (request.getTipoPersona() == null)
//         errores.add("Tipo de Persona");

//     if (request.getRazonSocial() == null || request.getRazonSocial().isBlank())
//         errores.add("Razón Social");

//     if (request.getCuit() == null || request.getCuit().isBlank())
//         errores.add("CUIT");

//     if (request.getTelefono() == null || request.getTelefono().isBlank())
//         errores.add("Teléfono");

//     if (request.getDireccion() == null) {
//         errores.add("Dirección");
//     } else {
//         if (request.getDireccion().getCalle() == null || request.getDireccion().getCalle().isBlank())
//             errores.add("Calle");

//         if (request.getDireccion().getNumero() <= 0)
//             errores.add("Número");

//         if (request.getDireccion().getCodigoPostal() == null || request.getDireccion().getCodigoPostal().isBlank())
//             errores.add("Código Postal");

//         if (request.getDireccion().getCiudad() == null || request.getDireccion().getCiudad().isBlank())
//             errores.add("Ciudad");

//         if (request.getDireccion().getProvincia() == null || request.getDireccion().getProvincia().isBlank())
//             errores.add("Provincia");

//         if (request.getDireccion().getPais() == null || request.getDireccion().getPais().isBlank())
//             errores.add("País");
//         // piso y departamento son opcionales → NO se validan
//     }

//     if (!errores.isEmpty()) {
//         throw new RuntimeException(
//             "Faltan los siguientes datos obligatorios: " + String.join(", ", errores)
//         );
//     }

//     // ==================================================
//     // Paso 2.B – Verificar CUIT duplicado
//     // ==================================================
//     if (personaFisicaRepository.existsByCuit(request.getCuit())
//         || personaJuridicaRepository.existsByCuit(request.getCuit())) {

//         throw new RuntimeException("¡CUIDADO! El CUIT ya existe en el sistema");
//     }

//     // ==================================================
//     // Paso 3 – Alta del Responsable de Pago
//     // ==================================================
//     if (request.getTipoPersona() == TipoPersona.JURIDICA) {

//         PersonaJuridica pj = PersonaJuridica.builder()
//             .cuit(request.getCuit())
//             .nombreRazonSocial(request.getRazonSocial().toUpperCase())
//             .telefono(request.getTelefono())
//             .build();

//         Direccion direccion = Direccion.builder()
//             .calle(request.getDireccion().getCalle().toUpperCase())
//             .numero(request.getDireccion().getNumero())
//             .piso(request.getDireccion().getPiso())
//             .departamento(request.getDireccion().getDepartamento())
//             .codigoPostal(request.getDireccion().getCodigoPostal().toUpperCase())
//             .ciudad(request.getDireccion().getCiudad().toUpperCase())
//             .provincia(request.getDireccion().getProvincia().toUpperCase())
//             .pais(request.getDireccion().getPais().toUpperCase())
//             .personaJuridica(pj)
//             .build();

//         pj.setDireccion(direccion);

//         personaJuridicaRepository.save(pj);
//         return pj;

//     } else {


//         PersonaFisica pf = personaFisicaRepository
//         .findByCuit(request.getCuit())
//         .orElseThrow(() ->
//             new RuntimeException(
//                 "Una persona física responsable de pago debe ser un huésped existente"
//             )
//         );

//     return pf;

       
//     }
//   }

  public void modificarResponsableDePago(Long id, ModificarResponsableDePagoRequest request) {

    ResponsableDePago responsable = buscarPorId(id);

    ModificarResponsableDePagoStrategy strategy;

    if (responsable instanceof PersonaJuridica) {
        strategy = modificarPersonaJuridicaStrategy;
    } else {
        strategy = modificarPersonaFisicaStrategy;
    }

    strategy.modificar(responsable, request);

    guardar(responsable);
}


  private ResponsableDePago buscarPorId(Long id) {
    return personaJuridicaRepository.findById(id)
            .map(pj -> (ResponsableDePago) pj)
            .orElseGet(() ->
                personaFisicaRepository.findById(id)
                    .map(pf -> (ResponsableDePago) pf)
                    .orElseThrow(() -> new RuntimeException(
                        "No se encontró el Responsable de Pago con id " + id
                    ))
            );
   }


   private void guardar(ResponsableDePago responsable) {
    switch (responsable) {
        case PersonaJuridica pj -> personaJuridicaRepository.save(pj);
        case PersonaFisica pf -> personaFisicaRepository.save(pf);
        default -> throw new RuntimeException("Tipo de Responsable de Pago desconocido");
    }



}
    public void darBajaResponsableDePago(Long id) {
        ResponsableDePago responsable = buscarPorId(id);

        // Validación: si ya tiene facturas emitidas
        if (responsable.getFacturas() != null && !responsable.getFacturas().isEmpty()) {
            throw new RuntimeException(
                "La firma no puede ser eliminada pues ya se le ha confeccionado una factura en el Hotel en alguna oportunidad. PRESIONE CUALQUIER TECLA PARA CONTINUAR..."
            );
        }

        // Seleccionar estrategia según tipo
        DarBajaResponsableStrategy strategy;
        if (responsable instanceof PersonaJuridica) {
            strategy = darBajaPersonaJuridicaStrategy;
        } else if (responsable instanceof PersonaFisica) {
            strategy = darBajaPersonaFisicaStrategy;
        } else {
            throw new RuntimeException("Tipo de Responsable de Pago desconocido");
        }

        // Ejecutar la baja
        strategy.darBaja(responsable);
    }


}

