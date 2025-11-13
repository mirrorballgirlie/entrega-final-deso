package com.gestionhotelera.gestion_hotelera.gestores;

import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional

public class GestorHabitacion {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final EstadiaRepository estadiaRepository;

    public List<Habitacion> mostrarEstadoEntreFechas(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) {
            throw new IllegalArgumentException("Las fechas 'desde' y 'hasta' no pueden ser nulas");
        }

        if (hasta.isBefore(desde)) {
            throw new IllegalArgumentException("La fecha 'hasta' no puede ser anterior a 'desde'");
        }

        // Obtener todas las habitaciones
        List<Habitacion> habitaciones = habitacionRepository.findAll();

        // Obtener reservas y estadías que se solapen con el rango
        List<Reserva> reservas = reservaRepository.findByFechaDesdeBetween(hasta, desde);
        List<Estadia> estadias = estadiaRepository.findByFechaIngresoLessThanEqualAndFechaEgresoGreaterThanEqual(hasta, desde);

        // Determinar estado de cada habitación dentro del rango
        return habitaciones.stream().peek(h -> {
            boolean ocupada = estadias.stream()
                    .anyMatch(e -> e.getHabitacion().getId().equals(h.getId()));

            boolean reservada = reservas.stream()
                    .anyMatch(r -> r.getHabitacion().getId().equals(h.getId()));

            if (ocupada) {
                h.setEstado("OCUPADA");
            } else if (reservada) {
                h.setEstado("RESERVADA");
            } else {
                h.setEstado("DISPONIBLE");
            }
        }).collect(Collectors.toList());
    }

    public List<Habitacion> buscarDisponibles(LocalDate desde, LocalDate hasta) {
        List<Habitacion> todas = mostrarEstadoEntreFechas(desde, hasta);
        return todas.stream()
                .filter(h -> h.getEstado().equalsIgnoreCase("DISPONIBLE"))
                .collect(Collectors.toList());
    }

    public Habitacion actualizarEstado(Long idHabitacion, String nuevoEstado) {
        Habitacion hab = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + idHabitacion));

        hab.setEstado(nuevoEstado);
        return habitacionRepository.save(hab);
    }

}
