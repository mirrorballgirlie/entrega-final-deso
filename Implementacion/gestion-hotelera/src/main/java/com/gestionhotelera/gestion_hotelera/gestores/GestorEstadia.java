package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final EstadiaRepository estadiaRepository;
    private final HuespedRepository huespedRepository;

    /**
     * Valida la selección de habitaciones a ocupar (por rangos por habitación).
     * Devuelve qué habitaciones son válidas, errores y conflictos con reservas existentes.
     */
    public ValidarOcupacionResponse validarOcupacion(ValidarOcupacionRequest req) {
        if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
            throw new BadRequestException("Debe indicar al menos una habitación con su rango para validar.");
        }

        List<Long> validas = new ArrayList<>();
        List<String> errores = new ArrayList<>();
        List<ConflictoReservaDTO> conflictos = new ArrayList<>();

        for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
            Long idHabitacion = dto.getHabitacionId();
            LocalDate desde = dto.getFechaDesde();
            LocalDate hasta = dto.getFechaHasta();

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

            // Estado actual debe ser DISPONIBLE o RESERVADA (según CU)
            String estado = h.getEstado();
            if (estado == null) estado = "DESCONOCIDO";
            if (!"DISPONIBLE".equalsIgnoreCase(estado) && !"RESERVADA".equalsIgnoreCase(estado)) {
                errores.add("Habitación " + h.getNumero() + " no está en estado válido para ocupar (actual=" + estado + ").");
                continue;
            }

            // 1) verificar si existe Estadia (ocupada) en algún día del rango
            boolean existeEstadia = estadiaRepository.existeEstadiaEnDia(idHabitacion, desde)
                    || estadiaRepository.existeEstadiaEnDia(idHabitacion, hasta)
                    || estadiaRepository.findEstadiasQueSolapan(desde, hasta).stream()
                        .anyMatch(e -> e.getHabitacion() != null && e.getHabitacion().getId().equals(idHabitacion));

            if (existeEstadia) {
                errores.add("Habitación " + h.getNumero() + " ya está ocupada en el rango indicado.");
                continue;
            }

            // 2) verificar reservas solapadas (para informar quien reservó)
            List<Reserva> reservas = reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta);
            if (reservas != null && !reservas.isEmpty()) {
                // armar conflictos para mostrar en UI (CU3.D)
                for (Reserva r : reservas) {
                    ConflictoReservaDTO c = new ConflictoReservaDTO();
                    c.setHabitacionId(idHabitacion);
                    c.setReservaId(r.getId());
                    c.setNombreReserva((r.getNombre() == null ? "" : r.getNombre()) + " " + (r.getApellido() == null ? "" : r.getApellido()));
                    c.setFechaDesde(r.getFechaDesde());
                    c.setFechaHasta(r.getFechaHasta());
                    conflictos.add(c);
                }
                // no agregamos a validas: UI deberá mostrar y decidir "OCUPAR_IGUAL" o "VOLVER"
                continue;
            }

            // si pasó todo, válida
            validas.add(idHabitacion);
        }

        return new ValidarOcupacionResponse(validas, errores, conflictos);
    }

     /**
     * Ejecuta el check-in (ocupar habitaciones). Si opcionOcuparIgual == true permite
     * sobreescribir reservas y crear estadía igualmente (CU 3.D.2.1).
     *
     * Devuelve lista de ids de estadías creadas.
     */
    @Transactional
    public OcuparResponse ocuparHabitaciones(OcuparRequest req) {
        if (req == null || req.getHabitaciones() == null || req.getHabitaciones().isEmpty()) {
            throw new BadRequestException("Debe indicar habitaciones para ocupar.");
        }
        if (req.getHuespedIds() == null || req.getHuespedIds().isEmpty()) {
            throw new BadRequestException("Debe indicar el huésped responsable (y acompañantes) antes de ocupar.");
        }

        // cargar huespedes
        List<Huesped> huespedes = huespedRepository.findAllById(req.getHuespedIds());
        if (huespedes.size() != req.getHuespedIds().size()) {
            // detectar ids inexistentes
            Set<Long> encontrados = huespedes.stream().map(Huesped::getId).collect(Collectors.toSet());
            List<Long> faltantes = req.getHuespedIds().stream().filter(id -> !encontrados.contains(id)).collect(Collectors.toList());
            throw new ResourceNotFoundException("No se encontraron los siguientes huespedes: " + faltantes);
        }

        List<Long> estadiaIds = new ArrayList<>();

        for (HabitacionOcupacionDTO dto : req.getHabitaciones()) {
            Long idHabitacion = dto.getHabitacionId();
            LocalDate desde = dto.getFechaDesde();
            LocalDate hasta = dto.getFechaHasta();

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

            // 1) Verificar estadía existente
            boolean existeEstadia = estadiaRepository.findEstadiasQueSolapan(desde, hasta).stream()
                .anyMatch(e -> e.getHabitacion() != null && e.getHabitacion().getId().equals(idHabitacion));

            if (existeEstadia) {
                throw new BadRequestException("La habitación " + h.getNumero() + " ya está ocupada en el rango solicitado.");
            }

            // 2) Verificar reservas solapadas
            List<Reserva> reservas = reservaRepository.verificarDisponibilidad(idHabitacion, desde, hasta);

            if (reservas != null && !reservas.isEmpty() && !req.isOpcionOcuparIgual()) {
                // si hay reservas y NO se permite ocupar igual -> error con info
                throw new BadRequestException("La habitación " + h.getNumero() + " tiene reservas solapadas. Use opcionOcuparIgual=true para forzar.");
            }

            // Si llegamos acá: podemos crear la estadía.
            Estadia est = Estadia.builder()
                    .estado("ACTIVA")
                    .fechaIngreso(desde)
                    .fechaEgreso(hasta)
                    .habitacion(h)
                    .huespedes(new ArrayList<>())
                    .build();

            // linkear huespedes
            for (Huesped hu : huespedes) {
                est.getHuespedes().add(hu);
            }

            Estadia saved = estadiaRepository.save(est);
            estadiaIds.add(saved.getId());

            // Si ocupamos igual y había reservas solapadas: opcionalmente actualizar esas reservas (por ejemplo, marcarlas CANCELADA)
            if (reservas != null && !reservas.isEmpty() && req.isOpcionOcuparIgual()) {
                for (Reserva r : reservas) {
                    r.setEstado(null); // o CANCELADA/NOTIFICAR según reglas; aquí las dejamos intactas o podrías marcarlas
                    reservaRepository.save(r);
                }
            }

            // actualizar estado de habitación a OCUPADA
            h.setEstado("OCUPADA");
            habitacionRepository.save(h);
        }

        return new OcuparResponse(estadiaIds, "Estadías creadas correctamente");
    }

}
