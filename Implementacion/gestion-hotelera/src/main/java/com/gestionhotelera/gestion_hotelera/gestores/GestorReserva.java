package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.time.LocalTime; 
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.gestionhotelera.gestion_hotelera.dto.*;
import com.gestionhotelera.gestion_hotelera.exception.*;
import com.gestionhotelera.gestion_hotelera.modelo.*;
import com.gestionhotelera.gestion_hotelera.repository.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GestorReserva {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final HuespedRepository huespedRepository; 

    private void validarFechas(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) throw new BadRequestException("Fechas nulas.");
        if (hasta.isBefore(desde)) throw new BadRequestException("Fecha hasta anterior a desde.");
    }
// METODO 1 VALIDAR SELECCION DE HABITACIONES ANTES DE CONFIRMAR

public ValidarSeleccionResponse validarSeleccion(ValidarSeleccionRequest req) {
    // 1. Validamos fechas antes que nada
    validarFechas(req.getFechaDesde(), req.getFechaHasta());

    // 2. Creamos las dos listas que necesita el Response
    List<Long> validas = new ArrayList<>(); // <-- Faltaba crear esta lista
    List<String> mensajes = new ArrayList<>();

    for (Long idHabitacion : req.getHabitacionIds()) {
        Habitacion h = habitacionRepository.findByNumero(idHabitacion).orElse(null);
        
        if (h == null) {
            mensajes.add("Habitación ID " + idHabitacion + " no encontrada.");
            continue;
        }

        if ("MANTENIMIENTO".equalsIgnoreCase(h.getEstado()) || "FUERA_SERVICIO".equalsIgnoreCase(h.getEstado())) {
            mensajes.add("La habitación " + h.getNumero() + " no está disponible.");
            continue;
        }

        List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(
            idHabitacion, 
            req.getFechaDesde(), 
            req.getFechaHasta(), 
            EstadoReserva.ACTIVA
        );

        if (!solapadas.isEmpty()) {
            mensajes.add("La habitación " + h.getNumero() + " ya está ocupada.");
            continue;
        }

        // Si llegó acá, la habitación es apta: la agregamos a la lista de válidas
        validas.add(idHabitacion);
    }

    // 3. Enviamos las dos listas al constructor
    return new ValidarSeleccionResponse(validas, mensajes);
}

    // --- MÉTODO 2: CONFIRMAR RESERVAS ---
@Transactional
public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
     
    // 1. Validar fechas
    validarFechas(req.getFechaDesde(), req.getFechaHasta());
    
    List<Long> idsProcesados = new ArrayList<>();

    // 2. Iterar sobre cada habitación solicitada y aplicar la lógica de negocio
    for (Long habId : req.getHabitacionIds()) {
       
        
        // Buscar la habitación o lanzar error si no existe
        Habitacion hab = habitacionRepository.findByNumero(habId)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + habId));

        // Regla de negocio: Solo reservar si está disponible
        if (!hab.getEstado().equals("DISPONIBLE")) {
            throw new BadRequestException("La habitación " + hab.getNumero() + " no está disponible.");
        }

        // 3. Crear la entidad Reserva
        Reserva reserva = new Reserva();
        reserva.setHabitacion(hab);
        reserva.setFechaDesde(req.getFechaDesde());
        reserva.setFechaHasta(req.getFechaHasta());
        reserva.setEstado(EstadoReserva.ACTIVA);
        
        // 4. Cambiar el estado de la Habitación
        hab.setEstado("RESERVADA");

        // 5. Persistir cambios
        habitacionRepository.save(hab);
        Reserva guardada = reservaRepository.save(reserva);
        
        idsProcesados.add(guardada.getId());
    }

    // 6. Retornar respuesta con todos los IDs de reserva generados
    return new ConfirmarReservaResponse(idsProcesados, "Se confirmaron " + idsProcesados.size() + " habitaciones con éxito.");
}

    // --- MÉTODO 3: CANCELAR ---
    @Transactional
    public String cancelarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con id: " + idReserva));
        if (reserva.getEstado() == EstadoReserva.CANCELADA) {
            throw new BadRequestException("La reserva ya está cancelada.");
        }
        reserva.setEstado(EstadoReserva.CANCELADA);
        reservaRepository.save(reserva);
        return "Reserva cancelada correctamente. La habitación ahora está disponible.";
     }
}