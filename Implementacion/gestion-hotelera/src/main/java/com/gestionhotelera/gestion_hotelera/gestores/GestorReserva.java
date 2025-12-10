// package com.gestionhotelera.gestion_hotelera.gestores;

// import java.time.LocalDate;
// import java.util.ArrayList;
// import java.util.List;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaRequest;
// import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaResponse;
// import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionRequest;
// import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionResponse;
// import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
// import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
// import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
// import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
// import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
// import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
// import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor

// public class GestorReserva {

//     private final HabitacionRepository habitacionRepository;
//     private final ReservaRepository reservaRepository;

//     //se validan que las fechas tengan un formato correcto (que no sean nulas y que desde sea anterior a hasta)
//     private void validarFechas(LocalDate desde, LocalDate hasta) {
//         if (desde == null || hasta == null) {
//             throw new BadRequestException("Las fechas 'desde' y 'hasta' no pueden ser nulas.");
//         }
//         if (hasta.isBefore(desde)) {
//             throw new BadRequestException("La fecha 'hasta' no puede ser anterior a 'desde'.");
//         }
//     }

//     //se validan las habitaciones solicitadas para un cierto rango de fechas dado

//     public ValidarSeleccionResponse validarSeleccion(ValidarSeleccionRequest req){
//         validarFechas(req.getFechaDesde(), req.getFechaHasta());

//         if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) {
//             throw new BadRequestException("Debe indicar al menos una habitación a seleccionar.");
//         }

//         List<Long>validas = new ArrayList<>();
//         List<String>errores = new ArrayList<>();

//         for (long idHabitacion : req.getHabitacionIds()){
//             Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);
//             // ---------- FIX 1: habitación inexistente ----------
        
//             if (h == null) {
//             errores.add("Habitación con id = " + idHabitacion + " no existe.");
//             continue; // <-- evita NullPointerException
//         }

//         // ---------- FIX 2: estado null o no DISPONIBLE ----------
//         String estado = h.getEstado();
        
//         if (estado == null || !estado.equalsIgnoreCase("DISPONIBLE")) {
//             errores.add("Habitación " + h.getNumero() +
//                         " no está DISPONIBLE (estado actual = " + estado + ").");
//             continue;
//         }

//         // ---------- FIX 3: evitar NPE si verificarDisponibilidad retorna null ----------
//         List<Reserva> solapadas =
//                 reservaRepository.verificarDisponibilidad(idHabitacion,
//                         req.getFechaDesde(), req.getFechaHasta());

//         if (solapadas != null && !solapadas.isEmpty()) {
//             errores.add("Habitación " + h.getNumero() +
//                         " tiene reservas solapadas en el rango indicado.");
//             continue;
//         }

//         validas.add(idHabitacion);
//         }
            

//         return new ValidarSeleccionResponse(validas, errores);

       

//     }

    
//     //confirma las reservas: vuelve a validar creando una reserva por cada habitación solicitada. es transaccional para que todo se guarde o todo haga rollback por si algo falla
//     @Transactional
//     public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
//         validarFechas(req.getFechaDesde(), req.getFechaHasta());

//         if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) {
//             throw new BadRequestException("No se recibieron habitaciones para reservar.");
//         }
//         if (req.getNombre() == null || req.getNombre().isBlank()
//                 || req.getApellido() == null || req.getApellido().isBlank()
//                 || req.getTelefono() == null || req.getTelefono().isBlank()) {
//             throw new BadRequestException("Faltan completar datos obligatorios del huésped (nombre/apellido/telefono).");
//         }

//         //pasar a mayus
//         String nombre = req.getNombre().toUpperCase();
//         String apellido = req.getApellido().toUpperCase();
//         String telefono = req.getTelefono();

//         List<Long> reservasCreadas = new ArrayList<>();

//         for (Long idHabitacion : req.getHabitacionIds()) {
//             Habitacion h = habitacionRepository.findById(idHabitacion)
//                     .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + idHabitacion));

//             //validar estado actual
//             if (!"DISPONIBLE".equalsIgnoreCase(h.getEstado())) {
//                 throw new BadRequestException("La habitación " + h.getNumero() + " ya no está DISPONIBLE (estado=" + h.getEstado() + ").");
//             }

//             //revalidar solapamientos
//             List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(idHabitacion, req.getFechaDesde(), req.getFechaHasta());
//             if (!solapadas.isEmpty()) {
//                 throw new BadRequestException("La habitación " + h.getNumero() + " tiene conflicto de reservas en el rango.");
//             }

//             //crear reserva (una por habitación)
//             Reserva r = Reserva.builder()
//                     .numero(generarNumeroReserva())
//                     .estado(EstadoReserva.ACTIVA)
//                     .fechaDesde(req.getFechaDesde())
//                     .fechaHasta(req.getFechaHasta())
//                     .nombre(nombre)
//                     .apellido(apellido)
//                     .telefono(telefono)
//                     .habitacion(h)
//                     .build();

//             Reserva saved = reservaRepository.save(r);
//             reservasCreadas.add(saved.getId());

//             //persistir cambio de estado a RESERVADA
//             h.setEstado("RESERVADA");
//             habitacionRepository.save(h);
//         }

//         return new ConfirmarReservaResponse(reservasCreadas, "Reservas creadas con éxito");
//     }


//     //generar nro de reserva
//     private int generarNumeroReserva() {
//         long count = reservaRepository.count();
//         return (int) (count + 1);
//     }

// }
package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaRequest;
import com.gestionhotelera.gestion_hotelera.dto.ConfirmarReservaResponse;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionRequest;
import com.gestionhotelera.gestion_hotelera.dto.ValidarSeleccionResponse;
import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GestorReserva {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;

    private void validarFechas(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) {
            throw new BadRequestException("Las fechas 'desde' y 'hasta' no pueden ser nulas.");
        }
        if (hasta.isBefore(desde)) {
            throw new BadRequestException("La fecha 'hasta' no puede ser anterior a 'desde'.");
        }
    }

    public ValidarSeleccionResponse validarSeleccion(ValidarSeleccionRequest req){
        validarFechas(req.getFechaDesde(), req.getFechaHasta());

        if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) {
            throw new BadRequestException("Debe indicar al menos una habitación a seleccionar.");
        }

        List<Long> validas = new ArrayList<>();
        List<String> errores = new ArrayList<>();

        for (long idHabitacion : req.getHabitacionIds()){
            Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);

            if (h == null) {
                errores.add("Habitación con id = " + idHabitacion + " no existe.");
                continue;
            }

            String estado = h.getEstado();
            if (estado == null || !estado.equalsIgnoreCase("DISPONIBLE")) {
                errores.add("Habitación " + h.getNumero() +
                        " no está DISPONIBLE (estado actual = " + estado + ").");
                continue;
            }

            List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(idHabitacion,
                    req.getFechaDesde(), req.getFechaHasta());

            if (solapadas != null && !solapadas.isEmpty()) {
                errores.add("Habitación " + h.getNumero() +
                        " tiene reservas solapadas en el rango indicado.");
                continue;
            }

            validas.add(idHabitacion);
        }

        return new ValidarSeleccionResponse(validas, errores);
    }

    @Transactional
    public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
        validarFechas(req.getFechaDesde(), req.getFechaHasta());

        if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) {
            throw new BadRequestException("No se recibieron habitaciones para reservar.");
        }
        if (req.getNombre() == null || req.getNombre().isBlank()
                || req.getApellido() == null || req.getApellido().isBlank()
                || req.getTelefono() == null || req.getTelefono().isBlank()) {
            throw new BadRequestException("Faltan completar datos obligatorios del huésped (nombre/apellido/telefono).");
        }

        String nombre = req.getNombre().toUpperCase();
        String apellido = req.getApellido().toUpperCase();
        String telefono = req.getTelefono();

        List<Long> reservasCreadas = new ArrayList<>();

        for (Long idHabitacion : req.getHabitacionIds()) {
            Habitacion h = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + idHabitacion));

            if (!"DISPONIBLE".equalsIgnoreCase(h.getEstado())) {
                throw new BadRequestException("La habitación " + h.getNumero() + " ya no está DISPONIBLE (estado=" + h.getEstado() + ").");
            }

            List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(idHabitacion, req.getFechaDesde(), req.getFechaHasta());
            if (solapadas != null && !solapadas.isEmpty()) {
                throw new BadRequestException("La habitación " + h.getNumero() + " tiene conflicto de reservas en el rango.");
            }

            Reserva r = Reserva.builder()
                    .numero(generarNumeroReserva())
                    .estado(EstadoReserva.ACTIVA)
                    .fechaDesde(req.getFechaDesde())
                    .fechaHasta(req.getFechaHasta())
                    .nombre(nombre)
                    .apellido(apellido)
                    .telefono(telefono)
                    .habitacion(h)
                    .build();

            Reserva saved = reservaRepository.save(r);
            reservasCreadas.add(saved.getId());

            // actualizar estado de la habitación a RESERVADA
            h.setEstado("RESERVADA");
            habitacionRepository.save(h);
        }

        return new ConfirmarReservaResponse(reservasCreadas, "Reservas creadas con éxito");
    }

    private int generarNumeroReserva() {
        long count = reservaRepository.count();
        return (int) (count + 1);
    }
}
