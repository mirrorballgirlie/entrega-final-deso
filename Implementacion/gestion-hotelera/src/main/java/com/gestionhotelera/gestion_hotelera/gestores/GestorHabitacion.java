// package com.gestionhotelera.gestion_hotelera.gestores;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.stream.Collectors;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.gestionhotelera.gestion_hotelera.dto.EstadoDiarioDTO;
// import com.gestionhotelera.gestion_hotelera.dto.EstadoHabitacionesResponse;
// import com.gestionhotelera.gestion_hotelera.dto.HabitacionEstadoDTO;
// import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
// import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
// import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
// import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
// import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
// import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
// import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

// import lombok.RequiredArgsConstructor;




// @Service
// @RequiredArgsConstructor
// @Transactional

// public class GestorHabitacion {

//     private final HabitacionRepository habitacionRepository;
//     private final ReservaRepository reservaRepository;
//     private final EstadiaRepository estadiaRepository;

//     public List<Habitacion> mostrarEstadoEntreFechas(LocalDate desde, LocalDate hasta) {
//         if (desde == null || hasta == null) {
//             throw new IllegalArgumentException("Las fechas 'desde' y 'hasta' no pueden ser nulas");
//         }

//         if (hasta.isBefore(desde)) {
//             throw new IllegalArgumentException("La fecha 'hasta' no puede ser anterior a 'desde'");
//         }

//         //obtener todas las habitaciones
//         List<Habitacion> habitaciones = habitacionRepository.findAll();

//         //obtener reservas y estadias que se solapen con el rango
//         List<Reserva> reservas = reservaRepository.findByFechaDesdeBetween(hasta, desde);
//         List<Estadia> estadias = estadiaRepository.findByFechaIngresoLessThanEqualAndFechaEgresoGreaterThanEqual(hasta, desde);

//         //determinar estado de cada habitacion dentro del rango
//         return habitaciones.stream().peek(h -> {
//             boolean ocupada = estadias.stream()
//                     .anyMatch(e -> e.getHabitacion().getId().equals(h.getId()));

//             boolean reservada = reservas.stream()
//                     .anyMatch(r -> r.getHabitacion().getId().equals(h.getId()));

//             if (ocupada) {
//                 h.setEstado("OCUPADA");
//             } else if (reservada) {
//                 h.setEstado("RESERVADA");
//             } else {
//                 h.setEstado("DISPONIBLE");
//             }
//         }).collect(Collectors.toList());
//     }

//     public List<Habitacion> buscarDisponibles(LocalDate desde, LocalDate hasta) {
//         List<Habitacion> todas = mostrarEstadoEntreFechas(desde, hasta);
//         return todas.stream()
//                 .filter(h -> h.getEstado().equalsIgnoreCase("DISPONIBLE"))
//                 .collect(Collectors.toList());
//     }

//     public Habitacion actualizarEstado(Long idHabitacion, String nuevoEstado) {
//         Habitacion hab = habitacionRepository.findById(idHabitacion)
//                 .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + idHabitacion));

//         hab.setEstado(nuevoEstado);
//         return habitacionRepository.save(hab);
//     }

//     public EstadoHabitacionesResponse obtenerEstadoHabitaciones(LocalDate desde, LocalDate hasta) {

//         if (desde == null || hasta == null) {
//             throw new IllegalArgumentException("Las fechas no pueden ser nulas.");
//         }

//         if (hasta.isBefore(desde)) {
//             throw new IllegalArgumentException("La fecha 'hasta' no puede ser anterior a 'desde'.");
//         }

//         //generar lista de días (columnas del front)
//         List<LocalDate> dias = desde.datesUntil(hasta.plusDays(1))
//                 .collect(Collectors.toList());

//         //obtener todas las habitaciones
//         List<Habitacion> habitaciones = habitacionRepository.findAll();

//         //generar respuesta por habitación
//         List<HabitacionEstadoDTO> result = habitaciones.stream()
//                 .map(h -> mapHabitacionConEstados(h, dias))
//                 .collect(Collectors.toList());

//         return new EstadoHabitacionesResponse(result, dias);
//     }

//     //metodos auxiliares internos

//     private HabitacionEstadoDTO mapHabitacionConEstados(Habitacion hab, List<LocalDate> dias) {

//         HabitacionEstadoDTO dto = new HabitacionEstadoDTO();
//         dto.setId(hab.getId());
//         dto.setNumero(hab.getNumero());
//         dto.setTipo(hab.getTipo().name());
//         dto.setCapacidad(hab.getCapacidad());
//         dto.setPrecio(hab.getPrecio());
//         dto.setDescripcion(hab.getDescripcion());

//         //estado actual
//         dto.setEstadoActual(hab.getEstado());

//         //estados por día
//         List<EstadoDiarioDTO> estadoDiario = dias.stream()
//                 .map(dia -> new EstadoDiarioDTO(dia, calcularEstadoEnDia(hab, dia)))
//                 .collect(Collectors.toList());

//         dto.setEstadosPorDia(estadoDiario);

//         return dto;
//     }

//     //determinar el estado de una habitacion en particular en un dia en particular
//     private String calcularEstadoEnDia(Habitacion hab, LocalDate dia) {

//         boolean ocupada = estadiaRepository.existeEstadiaEnDia(hab.getId(), dia);
//         if (ocupada) return "OCUPADA";

//         boolean reservada = reservaRepository.existeReservaEnDia(hab.getId(), dia);
//         if (reservada) return "RESERVADA";

//         return "DISPONIBLE";
//     }


// }
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
//import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
//import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;

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

        List<Habitacion> habitaciones = habitacionRepository.findAll();

        // Para cada habitación, determinamos si en algún día del rango hay estadía/reserva
        List<LocalDate> dias = desde.datesUntil(hasta.plusDays(1)).collect(Collectors.toList());

        return habitaciones.stream().peek(h -> {
            boolean ocupada = dias.stream().anyMatch(d -> safeBoolean(estadiaRepository.existeEstadiaEnDia(h.getId(), d)));
            boolean reservada = dias.stream().anyMatch(d -> safeBoolean(reservaRepository.existeReservaEnDia(h.getId(), d)));

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
                .filter(h -> "DISPONIBLE".equalsIgnoreCase(h.getEstado()))
                .collect(Collectors.toList());
    }

    public Habitacion actualizarEstado(Long idHabitacion, String nuevoEstado) {
        Habitacion hab = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + idHabitacion));

        hab.setEstado(nuevoEstado);
        return habitacionRepository.save(hab);
    }

    public EstadoHabitacionesResponse obtenerEstadoHabitaciones(LocalDate desde, LocalDate hasta) {

        if (desde == null || hasta == null) {
            throw new IllegalArgumentException("Las fechas no pueden ser nulas.");
        }
        if (hasta.isBefore(desde)) {
            throw new IllegalArgumentException("La fecha 'hasta' no puede ser anterior a 'desde'.");
        }

        // generar lista de días
        List<LocalDate> dias = new ArrayList<>();
        LocalDate iter = desde;
        while (!iter.isAfter(hasta)) {
            dias.add(iter);
            iter = iter.plusDays(1);
        }

        // obtener todas las habitaciones
        List<Habitacion> habitaciones = habitacionRepository.findAll();

        // generar respuesta por habitación: garantiza que para cada dia exista un EstadoDiarioDTO
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

        dto.setEstadoActual(hab.getEstado());

        List<EstadoDiarioDTO> estadoDiario = dias.stream()
                .map(dia -> new EstadoDiarioDTO(dia, calcularEstadoEnDia(hab, dia)))
                .collect(Collectors.toList());

        dto.setEstadosPorDia(estadoDiario);

        return dto;
    }

    private String calcularEstadoEnDia(Habitacion hab, LocalDate dia) {
        boolean ocupada = safeBoolean(estadiaRepository.existeEstadiaEnDia(hab.getId(), dia));
        if (ocupada) return "OCUPADA";

        boolean reservada = safeBoolean(reservaRepository.existeReservaEnDia(hab.getId(), dia));
        if (reservada) return "RESERVADA";

        return "DISPONIBLE";
    }

    private Boolean safeBoolean(Boolean b) {
        return b != null && b;
    }
}
