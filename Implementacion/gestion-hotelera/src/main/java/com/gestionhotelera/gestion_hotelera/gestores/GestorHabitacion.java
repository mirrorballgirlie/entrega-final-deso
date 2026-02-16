package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.EstadoDiarioDTO;
import com.gestionhotelera.gestion_hotelera.dto.EstadoHabitacionesResponse;
import com.gestionhotelera.gestion_hotelera.dto.HabitacionEstadoDTO;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva; // Importante
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoHabitacion;

import lombok.RequiredArgsConstructor;
import lombok.*;

@Service
@RequiredArgsConstructor
@Transactional
public class GestorHabitacion {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final EstadiaRepository estadiaRepository;

    public List<Habitacion> mostrarEstadoEntreFechas(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) throw new IllegalArgumentException("Las fechas no pueden ser nulas");
        if (hasta.isBefore(desde)) throw new IllegalArgumentException("Fecha hasta no puede ser anterior a desde");

        List<Habitacion> habitaciones = habitacionRepository.findAll();
        // Generamos la lista de días para evaluar
        List<LocalDate> dias = desde.datesUntil(hasta.plusDays(1)).collect(Collectors.toList());

        return habitaciones.stream().peek(h -> {
            // 1. PRIORIDAD: MANTENIMIENTO (Leemos directo de la DB)
            EstadoHabitacion estadoFisico = h.getEstado();
            
            // CORRECCIÓN 1: Limpieza de estados no usados
            if (estadoFisico == EstadoHabitacion.MANTENIMIENTO) {
                h.setEstado(EstadoHabitacion.MANTENIMIENTO);
                return; // Si está en mantenimiento, no buscamos reservas ni estadías
            }

            // 2. PRIORIDAD: OCUPADA (Calculado)
            boolean ocupada = dias.stream().anyMatch(d -> safeBoolean(estadiaRepository.existeEstadiaEnDia(h.getId(), d)));
            if (ocupada) {
                h.setEstado(EstadoHabitacion.OCUPADA);
                return;
            }

            // 3. PRIORIDAD: RESERVADA (Calculado)
            // CORRECCIÓN 2: Agregamos EstadoReserva.ACTIVA para que coincida con el Repository
            boolean reservada = dias.stream().anyMatch(d -> safeBoolean(reservaRepository.existeReservaEnDia(h.getId(), d, EstadoReserva.ACTIVA)));
            if (reservada) {
                h.setEstado(EstadoHabitacion.RESERVADA);
                return;
            }

            // 4. DEFECTO: DISPONIBLE
            h.setEstado(EstadoHabitacion.DISPONIBLE);

        }).collect(Collectors.toList());
    }

    public List<Habitacion> buscarDisponibles(LocalDate desde, LocalDate hasta) {
        // Reutilizamos la lógica anterior
        return mostrarEstadoEntreFechas(desde, hasta).stream()
                .filter(h -> h.getEstado() == EstadoHabitacion.DISPONIBLE)
                .collect(Collectors.toList());
    }

    public Habitacion actualizarEstado(Long idHabitacion, String nuevoEstado) {
        Habitacion hab = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + idHabitacion));
        
        // Aquí solo deberíamos permitir poner "DISPONIBLE" o "MANTENIMIENTO"
        hab.setEstado(EstadoHabitacion.valueOf(nuevoEstado)); 
        return habitacionRepository.save(hab);
    }

    public EstadoHabitacionesResponse obtenerEstadoHabitaciones(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) throw new IllegalArgumentException("Las fechas no pueden ser nulas.");
        if (hasta.isBefore(desde)) throw new IllegalArgumentException("La fecha 'hasta' no puede ser anterior a 'desde'.");

        List<LocalDate> dias = desde.datesUntil(hasta.plusDays(1)).collect(Collectors.toList());
        List<Habitacion> habitaciones = habitacionRepository.findAll();

        List<HabitacionEstadoDTO> result = habitaciones.stream()
                .map(h -> mapHabitacionConEstados(h, dias))
                .collect(Collectors.toList());

        return new EstadoHabitacionesResponse(result, dias);
    }

    private HabitacionEstadoDTO mapHabitacionConEstados(Habitacion hab, List<LocalDate> dias) {
        HabitacionEstadoDTO dto = new HabitacionEstadoDTO();
        dto.setId(hab.getId());
        dto.setNumero(hab.getNumero());
        dto.setTipo(hab.getTipo() != null ? hab.getTipo().name() : null);
        dto.setCapacidad(hab.getCapacidad());
        dto.setPrecio(hab.getPrecio());
        dto.setDescripcion(hab.getDescripcion());
        
        // Estado base (físico)
        dto.setEstadoActual(hab.getEstado());

        List<EstadoDiarioDTO> estadoDiario = dias.stream()
                .map(dia -> obtenerDetalleEstadoEnDia(hab, dia))
                .collect(Collectors.toList());

        dto.setEstadosPorDia(estadoDiario);
        return dto;
    }

    // --- LÓGICA CORE DE PRIORIDADES ---
    private EstadoDiarioDTO obtenerDetalleEstadoEnDia(Habitacion hab, LocalDate dia) {
        EstadoDiarioDTO detalle = new EstadoDiarioDTO();
        detalle.setFecha(dia);

        // 1. PRIORIDAD: MANTENIMIENTO (Estado Físico en BD)
        // Solo verificamos "MANTENIMIENTO". Ignoramos cualquier otro estado antiguo.
        EstadoHabitacion estadoFisico = hab.getEstado();
        
        if (estadoFisico == EstadoHabitacion.MANTENIMIENTO) {
            detalle.setEstado(EstadoHabitacion.MANTENIMIENTO);
            detalle.setReservadoPor("Mantenimiento"); 
            return detalle;
        }

        // 2. PRIORIDAD: OCUPADA (Estadía Activa - Calculado)
        List<Estadia> estadias = estadiaRepository.encontrarEstadiasEnDia(hab.getId(), dia, EstadoEstadia.ACTIVA);
        if (!estadias.isEmpty()) {
            Estadia est = estadias.get(0);
            detalle.setEstado(EstadoHabitacion.OCUPADA);
            
            // Lógica para mostrar quién ocupa
            if (est.getReserva() != null) {
                // Si viene de reserva, mostramos nombre de la reserva
                detalle.setReservadoPor(est.getReserva().getNombre() + " " + est.getReserva().getApellido());
            } else if (!est.getHuespedes().isEmpty()) {
                // Si es walk-in, mostramos el primer huésped
                var huesped = est.getHuespedes().get(0);
                detalle.setReservadoPor(huesped.getNombre() + " " + huesped.getApellido());
            } else {
                detalle.setReservadoPor("Ocupado"); 
            }
            return detalle;
        }

        // 3. PRIORIDAD: RESERVADA (Reserva Activa - Calculado)
        // CORRECCIÓN 3: Uso correcto del Enum EstadoReserva.ACTIVA
        List<Reserva> reservas = reservaRepository.encontrarReservasEnDia(hab.getId(), dia, EstadoReserva.ACTIVA);
        if (!reservas.isEmpty()) {
            Reserva res = reservas.get(0);
            detalle.setEstado(EstadoHabitacion.RESERVADA);
            
            // Lógica para mostrar quién reservó
            detalle.setReservadoPor(res.getNombre() + " " + res.getApellido());
            detalle.setReservaId(res.getId());
            
            if (res.getCliente() != null) {
                detalle.setClienteId(res.getCliente().getId());
            }
            return detalle;
        }

        // 4. DISPONIBLE (Defecto)
        detalle.setEstado(EstadoHabitacion.DISPONIBLE);
        return detalle;
    }

    private Boolean safeBoolean(Boolean b) {
        return b != null && b;
    }

    public void liberarHabitacion(int numeroHabitacion) {
        Habitacion hab = habitacionRepository.findByNumero(numeroHabitacion)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con número: " + numeroHabitacion));
        
        // Solo liberamos si está ocupada
        if (hab.getEstado() == EstadoHabitacion.OCUPADA) {
            hab.setEstado(EstadoHabitacion.DISPONIBLE);
            habitacionRepository.save(hab);
        } else {
            throw new IllegalArgumentException("La habitación no está ocupada ni reservada, no se puede liberar.");
        }
    }
}