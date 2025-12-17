// package com.gestionhotelera.gestion_hotelera.gestores;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;
// import java.util.Set;
// import java.util.stream.Collectors;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.dao.DataAccessException;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.gestionhotelera.gestion_hotelera.dto.ConflictoReservaDTO;
// import com.gestionhotelera.gestion_hotelera.dto.HabitacionOcupacionDTO;
// import com.gestionhotelera.gestion_hotelera.dto.OcuparRequest;
// import com.gestionhotelera.gestion_hotelera.dto.OcuparResponse;
// import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionRequest;
// import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionResponse;
// import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
// import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
// import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
// import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
// import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
// import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
// import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
// import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
// import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
// import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class GestorEstadia {

//     private static final Logger log = LoggerFactory.getLogger(GestorEstadia.class);

//     private final HabitacionRepository habitacionRepository;
//     private final ReservaRepository reservaRepository;
//     private final EstadiaRepository estadiaRepository;
//     private final HuespedRepository huespedRepository;

//     public ValidarOcupacionResponse validarOcupacion(ValidarOcupacionRequest req) {
//         log.debug("ValidarOcupacion request: {}", req);
//         if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
//             throw new BadRequestException("Debe indicar al menos una habitación con su rango para validar.");
//         }

//         List<Long> validas = new ArrayList<>();
//         List<String> errores = new ArrayList<>();
//         List<ConflictoReservaDTO> conflictos = new ArrayList<>();

//         try {
//             for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
//                 if (dto == null) {
//                     errores.add("Entrada de habitación nula en la lista.");
//                     continue;
//                 }

//                 Long idHabitacion = dto.getHabitacionId();
//                 LocalDate desde = dto.getFechaDesde();
//                 LocalDate hasta = dto.getFechaHasta();

//                 if (idHabitacion == null) {
//                     errores.add("Falta habitacionId en un elemento.");
//                     continue;
//                 }
//                 if (desde == null || hasta == null) {
//                     errores.add("Fechas inválidas para habitacionId=" + idHabitacion);
//                     continue;
//                 }
//                 if (hasta.isBefore(desde)) {
//                     errores.add("fechaHasta < fechaDesde para habitacionId=" + idHabitacion);
//                     continue;
//                 }

//                 Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);
//                 if (h == null) {
//                     errores.add("Habitación con id=" + idHabitacion + " no existe.");
//                     continue;
//                 }

//                 String estado = h.getEstado();
//                 if (estado == null) estado = "DESCONOCIDO";
//                 if (!"DISPONIBLE".equalsIgnoreCase(estado) && !"RESERVADA".equalsIgnoreCase(estado)) {
//                     errores.add("Habitación " + h.getNumero() + " no está en estado válido para ocupar (actual=" + estado + ").");
//                     continue;
//                 }

//                 // verificar estadías que solapan
//                 List<Estadia> estadiasSolap = safeList(estadiaRepository.findEstadiasQueSolapan(desde, hasta));
//                 boolean existeEstadia = estadiasSolap.stream()
//                         .anyMatch(e -> e.getHabitacion() != null && idHabitacion.equals(e.getHabitacion().getId()))
//                         || safeBoolean(existenciaEnDia(idHabitacion, desde))
//                         || safeBoolean(existenciaEnDia(idHabitacion, hasta));

//                 if (existeEstadia) {
//                     errores.add("Habitación " + h.getNumero() + " ya está ocupada en el rango indicado.");
//                     continue;
//                 }

//                 // verificar reservas solapadas
//                 List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta));
//                 if (reservas != null && !reservas.isEmpty()) {
//                     for (Reserva r : reservas) {
//                         ConflictoReservaDTO c = new ConflictoReservaDTO();
//                         c.setHabitacionId(idHabitacion);
//                         c.setReservaId(r.getId());
//                         c.setNombreReserva((r.getNombre() == null ? "" : r.getNombre()) + " " + (r.getApellido() == null ? "" : r.getApellido()));
//                         c.setFechaDesde(r.getFechaDesde());
//                         c.setFechaHasta(r.getFechaHasta());
//                         conflictos.add(c);
//                     }
//                     // no agregamos a validas
//                     continue;
//                 }

//                 validas.add(idHabitacion);
//             }
//         } catch (DataAccessException dae) {
//             log.error("Error de acceso a datos en validarOcupacion", dae);
//             throw dae; // deja que GlobalExceptionHandler convierta a 500
//         } catch (Exception ex) {
//             log.error("Error inesperado en validarOcupacion", ex);
//             throw ex;
//         }

//         return new ValidarOcupacionResponse(validas, errores, conflictos);
//     }

//     @Transactional
//     public OcuparResponse ocuparHabitaciones(OcuparRequest req) {
//         log.debug("OcuparHabitaciones request: {}", req);
//         if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
//             throw new BadRequestException("Debe indicar habitaciones para ocupar.");
//         }
//         if (req.getHuespedIds() == null || req.getHuespedIds().isEmpty()) {
//             throw new BadRequestException("Debe indicar el huésped responsable (y acompañantes) antes de ocupar.");
//         }

//         try {
//             // cargar huespedes
//             List<Huesped> huespedes = huespedRepository.findAllById(req.getHuespedIds());
//             if (huespedes.size() != req.getHuespedIds().size()) {
//                 Set<Long> encontrados = huespedes.stream().map(Huesped::getId).collect(Collectors.toSet());
//                 List<Long> faltantes = req.getHuespedIds().stream().filter(id -> !encontrados.contains(id)).collect(Collectors.toList());
//                 throw new ResourceNotFoundException("No se encontraron los siguientes huespedes: " + faltantes);
//             }

//             List<Long> estadiaIds = new ArrayList<>();

//             for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
//                 if (dto == null) throw new BadRequestException("Elemento habitacion nulo en request.");

//                 Long idHabitacion = dto.getHabitacionId();
//                 LocalDate desde = dto.getFechaDesde();
//                 LocalDate hasta = dto.getFechaHasta();

//                 if (idHabitacion == null) throw new BadRequestException("Falta habitacionId en request.");
//                 if (desde == null || hasta == null || hasta.isBefore(desde)) {
//                     throw new BadRequestException("Fechas inválidas para habitacionId=" + idHabitacion);
//                 }

//                 Habitacion h = habitacionRepository.findById(idHabitacion)
//                         .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + idHabitacion));

//                 String estado = h.getEstado();
//                 if (estado == null) estado = "DESCONOCIDO";
//                 if (!"DISPONIBLE".equalsIgnoreCase(estado) && !"RESERVADA".equalsIgnoreCase(estado)) {
//                     throw new BadRequestException("Habitación " + h.getNumero() + " no está en estado válido para ocupar (actual=" + estado + ").");
//                 }

//                 // verificar estadía existente
//                 boolean existeEstadia = safeList(estadiaRepository.findEstadiasQueSolapan(desde, hasta))
//                         .stream()
//                         .anyMatch(e -> e.getHabitacion() != null && idHabitacion.equals(e.getHabitacion().getId()));

//                 if (existeEstadia) {
//                     throw new BadRequestException("La habitación " + h.getNumero() + " ya está ocupada en el rango solicitado.");
//                 }

//                 // verificar reservas solapadas
//                 List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta));
//                 if (reservas != null && !reservas.isEmpty() && !req.isOpcionOcuparIgual()) {
//                     throw new BadRequestException("La habitación " + h.getNumero() + " tiene reservas solapadas. Use opcionOcuparIgual=true para forzar.");
//                 }

//                 Estadia est = Estadia.builder()
//                         .estado("ACTIVA")
//                         .fechaIngreso(desde)
//                         .fechaEgreso(hasta)
//                         .habitacion(h)
//                         .huespedes(new ArrayList<>())
//                         .build();

//                 // linkear huespedes
//                 for (Huesped hu : huespedes) {
//                     est.getHuespedes().add(hu);
//                 }

//                 Estadia saved = estadiaRepository.save(est);
//                 estadiaIds.add(saved.getId());

//                 if (reservas != null && !reservas.isEmpty() && req.isOpcionOcuparIgual()) {
//                     for (Reserva r : reservas) {
//                         // decide politica: aquí solo logueo y dejo la reserva como está (evita seteo a null que puede romper restricciones DB)
//                         log.info("Ocupando igual: conflicto con reserva id={} para habitacionId={}", r.getId(), idHabitacion);
//                         // si querés desactivar la reserva, hacelo con un estado válido (ej: CANCELADA) y con reglas de negocio
//                         // r.setEstado(EstadoReserva.CANCELADA); reservaRepository.save(r);
//                     }
//                 }

//                 // actualizar estado de habitación a OCUPADA
//                 h.setEstado("OCUPADA");
//                 habitacionRepository.save(h);
//             }

//             return new OcuparResponse(estadiaIds, "Estadías creadas correctamente");
//         } catch (DataAccessException dae) {
//             log.error("Error de acceso a datos en ocuparHabitaciones", dae);
//             throw dae;
//         } catch (Exception ex) {
//             log.error("Error inesperado en ocuparHabitaciones", ex);
//             throw ex;
//         }
//     }

//     // helpers
//     private <T> List<T> safeList(List<T> maybeNull) {
//         return maybeNull == null ? Collections.emptyList() : maybeNull;
//     }

//     private boolean safeBoolean(Boolean b) {
//         return b != null && b;
//     }

//     private Boolean existenciaEnDia(Long idHabitacion, LocalDate dia) {
//     try {
//         return estadiaRepository.existeEstadiaEnDia(idHabitacion, dia);
//     } catch (Exception e) {
//         return false; // fallback seguro
//     }
// }

// }

package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.ConflictoReservaDTO;
import com.gestionhotelera.gestion_hotelera.dto.HabitacionOcupacionDTO;
import com.gestionhotelera.gestion_hotelera.dto.OcuparRequest;
import com.gestionhotelera.gestion_hotelera.dto.OcuparResponse;
import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionRequest;
import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionResponse;
import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GestorEstadia {

    private static final Logger log = LoggerFactory.getLogger(GestorEstadia.class);

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final EstadiaRepository estadiaRepository;
    private final HuespedRepository huespedRepository;

    public ValidarOcupacionResponse validarOcupacion(ValidarOcupacionRequest req) {
        log.debug("ValidarOcupacion request: {}", req);
        if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
            throw new BadRequestException("Debe indicar al menos una habitación con su rango para validar.");
        }

        List<Long> validas = new ArrayList<>();
        List<String> errores = new ArrayList<>();
        List<ConflictoReservaDTO> conflictos = new ArrayList<>();

        try {
            for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
                if (dto == null) {
                    errores.add("Entrada de habitación nula en la lista.");
                    continue;
                }

                Long idHabitacion = dto.getHabitacionId();
                LocalDate desde = dto.getFechaDesde();
                LocalDate hasta = dto.getFechaHasta();

                if (idHabitacion == null) {
                    errores.add("Falta habitacionId en un elemento.");
                    continue;
                }
                if (desde == null || hasta == null) {
                    errores.add("Fechas inválidas para habitacionId=" + idHabitacion);
                    continue;
                }
                if (hasta.isBefore(desde)) {
                    errores.add("fechaHasta < fechaDesde para habitacionId=" + idHabitacion);
                    continue;
                }

                Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);
                if (h == null) {
                    errores.add("Habitación con id=" + idHabitacion + " no existe.");
                    continue;
                }

                String estado = h.getEstado();
                if (estado == null) estado = "DESCONOCIDO";
                if (!"DISPONIBLE".equalsIgnoreCase(estado) && !"RESERVADA".equalsIgnoreCase(estado)) {
                    errores.add("Habitación " + h.getNumero() + " no está en estado válido para ocupar (actual=" + estado + ").");
                    continue;
                }

                List<Estadia> estadiasSolap = safeList(estadiaRepository.findEstadiasQueSolapan(desde, hasta));
                boolean existeEstadia = estadiasSolap.stream()
                        .anyMatch(e -> e.getHabitacion() != null && idHabitacion.equals(e.getHabitacion().getId()))
                        || safeBoolean(existenciaEnDia(idHabitacion, desde))
                        || safeBoolean(existenciaEnDia(idHabitacion, hasta));

                if (existeEstadia) {
                    errores.add("Habitación " + h.getNumero() + " ya está ocupada en el rango indicado.");
                    continue;
                }

                // List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta));
                // if (reservas != null && !reservas.isEmpty()) {
                //     for (Reserva r : reservas) {
                //         ConflictoReservaDTO c = new ConflictoReservaDTO();
                //         c.setHabitacionId(idHabitacion);
                //         c.setReservaId(r.getId());
                //         c.setNombreReserva((r.getNombre() == null ? "" : r.getNombre()) + " " + (r.getApellido() == null ? "" : r.getApellido()));
                //         c.setFechaDesde(r.getFechaDesde());
                //         c.setFechaHasta(r.getFechaHasta());
                //         conflictos.add(c);
                //     }
                //     continue;
                // }

                // ... imports necesarios (EstadoReserva)

                // Llamada modificada: Se agrega EstadoReserva.ACTIVA
                List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(
                    idHabitacion, 
                    desde, 
                    hasta, 
                    EstadoReserva.ACTIVA
                ));

                if (reservas != null && !reservas.isEmpty()) {
                    for (Reserva r : reservas) {
                        ConflictoReservaDTO c = new ConflictoReservaDTO();
                        c.setHabitacionId(idHabitacion);
                        c.setReservaId(r.getId());
                        c.setNombreReserva((r.getNombre() == null ? "" : r.getNombre()) + " " + (r.getApellido() == null ? "" : r.getApellido()));
                        c.setFechaDesde(r.getFechaDesde());
                        c.setFechaHasta(r.getFechaHasta());
                        conflictos.add(c);
                    }
                    continue;
                }

                validas.add(idHabitacion);
            }
        } catch (DataAccessException dae) {
            log.error("Error de acceso a datos en validarOcupacion", dae);
            throw dae;
        } catch (Exception ex) {
            log.error("Error inesperado en validarOcupacion", ex);
            throw ex;
        }

        return new ValidarOcupacionResponse(validas, errores, conflictos);
    }

    @Transactional
    public OcuparResponse ocuparHabitaciones(OcuparRequest req) {
        log.debug("OcuparHabitaciones request: {}", req);
        if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
            throw new BadRequestException("Debe indicar habitaciones para ocupar.");
        }
        if (req.getHuespedIds() == null || req.getHuespedIds().isEmpty()) {
            throw new BadRequestException("Debe indicar el huésped responsable (y acompañantes) antes de ocupar.");
        }

        try {
            List<Huesped> huespedes = huespedRepository.findAllById(req.getHuespedIds());
            if (huespedes.size() != req.getHuespedIds().size()) {
                Set<Long> encontrados = huespedes.stream().map(Huesped::getId).collect(Collectors.toSet());
                List<Long> faltantes = req.getHuespedIds().stream().filter(id -> !encontrados.contains(id)).collect(Collectors.toList());
                throw new ResourceNotFoundException("No se encontraron los siguientes huespedes: " + faltantes);
            }

            List<Long> estadiaIds = new ArrayList<>();

            for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
                if (dto == null) throw new BadRequestException("Elemento habitacion nulo en request.");

                Long idHabitacion = dto.getHabitacionId();
                LocalDate desde = dto.getFechaDesde();
                LocalDate hasta = dto.getFechaHasta();

                if (idHabitacion == null) throw new BadRequestException("Falta habitacionId en request.");
                if (desde == null || hasta == null || hasta.isBefore(desde)) {
                    throw new BadRequestException("Fechas inválidas para habitacionId=" + idHabitacion);
                }

                Habitacion h = habitacionRepository.findById(idHabitacion)
                        .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + idHabitacion));

                String estado = h.getEstado();
                if (estado == null) estado = "DESCONOCIDO";
                if (!"DISPONIBLE".equalsIgnoreCase(estado) && !"RESERVADA".equalsIgnoreCase(estado)) {
                    throw new BadRequestException("Habitación " + h.getNumero() + " no está en estado válido para ocupar (actual=" + estado + ").");
                }

                boolean existeEstadia = safeList(estadiaRepository.findEstadiasQueSolapan(desde, hasta))
                        .stream()
                        .anyMatch(e -> e.getHabitacion() != null && idHabitacion.equals(e.getHabitacion().getId()));

                if (existeEstadia) {
                    throw new BadRequestException("La habitación " + h.getNumero() + " ya está ocupada en el rango solicitado.");
                }

                // List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta));
                // if (reservas != null && !reservas.isEmpty() && !req.isOpcionOcuparIgual()) {
                //     throw new BadRequestException("La habitación " + h.getNumero() + " tiene reservas solapadas. Use opcionOcuparIgual=true para forzar.");
                // }
                // Llamada modificada: Se agrega EstadoReserva.ACTIVA
                    List<Reserva> reservas = safeList(reservaRepository.verificarDisponibilidad(
                        idHabitacion, 
                        desde, 
                        hasta, 
                        EstadoReserva.ACTIVA
                    ));

                    if (reservas != null && !reservas.isEmpty() && !req.isOpcionOcuparIgual()) {
                        throw new BadRequestException("La habitación " + h.getNumero() + " tiene reservas solapadas. Use opcionOcuparIgual=true para forzar.");
                    }

                Estadia est = Estadia.builder()
                        .estado("ACTIVA")
                        .fechaIngreso(desde)
                        .fechaEgreso(hasta)
                        .habitacion(h)
                        .huespedes(new ArrayList<>())
                        .build();

                for (Huesped hu : huespedes) {
                    est.getHuespedes().add(hu);
                }

                Estadia saved = estadiaRepository.save(est);
                estadiaIds.add(saved.getId());

                if (reservas != null && !reservas.isEmpty() && req.isOpcionOcuparIgual()) {
                    for (Reserva r : reservas) {
                        log.info("Ocupando igual: conflicto con reserva id={} para habitacionId={}", r.getId(), idHabitacion);
                    }
                }

                h.setEstado("OCUPADA");
                habitacionRepository.save(h);
            }

            return new OcuparResponse(estadiaIds, "Estadías creadas correctamente");
        } catch (DataAccessException dae) {
            log.error("Error de acceso a datos en ocuparHabitaciones", dae);
            throw dae;
        } catch (Exception ex) {
            log.error("Error inesperado en ocuparHabitaciones", ex);
            throw ex;
        }
    }

    private <T> List<T> safeList(List<T> maybeNull) {
        return maybeNull == null ? Collections.emptyList() : maybeNull;
    }

    private boolean safeBoolean(Boolean b) {
        return b != null && b;
    }

    private Boolean existenciaEnDia(Long idHabitacion, LocalDate dia) {
        try {
            return estadiaRepository.existeEstadiaEnDia(idHabitacion, dia);
        } catch (Exception e) {
            return false;
        }
    }
}
