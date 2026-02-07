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
        List<String> mensajes = new ArrayList<>();

        for (Long idHabitacion : req.getHabitacionIds()) {
            Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);
            if (h == null) {
                mensajes.add("Habitación ID " + idHabitacion + " no encontrada.");
                continue;
            }
            if ("MANTENIMIENTO".equalsIgnoreCase(h.getEstado()) || "FUERA_SERVICIO".equalsIgnoreCase(h.getEstado())) {
                mensajes.add("La habitación " + h.getNumero() + " no está disponible para reserva.");
                continue;
            }
            List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(
                idHabitacion, 
                req.getFechaDesde(), 
                req.getFechaHasta(), 
                EstadoReserva.ACTIVA
            );
            if (!solapadas.isEmpty()) {
                mensajes.add("La habitación " + h.getNumero() + " se ocupó recientemente en esas fechas.");
            }
        }

        boolean esValida = mensajes.isEmpty();
        String mensajeGeneral = esValida ? "Selección válida." : String.join(" ", mensajes);
        return new ValidarSeleccionResponse(esValida, mensajeGeneral);
    } // HASTA ACA LO AUTOCOMPLETO EL VISUA, TODO LO OTRO ES COPY PASTE DE GEMINI


   @Transactional
public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
    // 1. PASO CRÍTICO: Validar coherencia temporal
    // Aquí es donde se lanza el error si la web tiene las fechas trocadas
    validarFechas(req.getFechaDesde(), req.getFechaHasta());

    // 2. Vincular con el Cliente/Huésped
    Huesped clienteEncontrado = null;
    if (req.getClienteId() != null) {
        clienteEncontrado = huespedRepository.findById(req.getClienteId()).orElse(null);
    }

    List<Long> reservasCreadas = new ArrayList<>();

    // 3. Procesar cada habitación seleccionada
    for (Long idHabitacion : req.getHabitacionIds()) {
        // Búsqueda segura para evitar Error 500
        Habitacion h = habitacionRepository.findById(idHabitacion)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada: " + idHabitacion));

        // Validar estado de la habitación
        if ("MANTENIMIENTO".equalsIgnoreCase(h.getEstado()) || "FUERA_SERVICIO".equalsIgnoreCase(h.getEstado())) {
            throw new BadRequestException("La habitación " + h.getNumero() + " no está disponible para reserva.");
        }

        // 4. Doble chequeo de disponibilidad (Concurrency check)
        List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(
            idHabitacion, 
            req.getFechaDesde(), 
            req.getFechaHasta(), 
            EstadoReserva.ACTIVA
        );

        if (!solapadas.isEmpty()) {
            throw new BadRequestException("La habitación " + h.getNumero() + " se ocupó recientemente en esas fechas.");
        }

        // 5. Creación de la entidad mediante Builder
        Reserva nuevaReserva = Reserva.builder()
                .numero(generarNumeroReserva()) // Genera el próximo número secuencial
                .estado(EstadoReserva.ACTIVA)
                .fechaDesde(req.getFechaDesde())
                .fechaHasta(req.getFechaHasta())
                .nombre(req.getNombre().toUpperCase())
                .apellido(req.getApellido().toUpperCase())
                .telefono(req.getTelefono())
                .habitacion(h)
                .cliente(clienteEncontrado)
                .build();

        // 6. Persistencia en PostgreSQL
        Reserva guardada = reservaRepository.save(nuevaReserva);
        reservasCreadas.add(guardada.getId());
    }

    return new ConfirmarReservaResponse(reservasCreadas, "Reserva confirmada con éxito");
}

    // --- MÉTODO 2: CONFIRMAR RESERVAS ---
    @Transactional
    public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
        validarFechas(req.getFechaDesde(), req.getFechaHasta());
        return new ConfirmarReservaResponse(new ArrayList<>(), "Éxito");
    }

    // --- MÉTODO 3: CANCELAR (CU06 con Strategy) ---
    @Transactional
    public double cancelarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva ID " + idReserva + " no encontrada."));

        LocalTime ahora = LocalTime.now(); // Uso de java.time solicitado
        EstrategiaCancelacion estrategia;

        // Lógica de recargos del Hotel Premier
        if (ahora.isBefore(LocalTime.of(11, 0))) {
            estrategia = new EstrategiaSinRecargo();
        } else if (ahora.isBefore(LocalTime.of(18, 0))) {
            estrategia = new EstrategiaMediaEstadia();
        } else {
            estrategia = new EstrategiaEstadiaCompleta();
        }

        // Una vez que se defina 'getCostoNoche' en Habitacion se descomentan estas lineas:
        // double recargo = estrategia.calcularRecargo(reserva.getHabitacion().getCostoNoche());
        // reserva.setEstado(EstadoReserva.CANCELADA);
        // reservaRepository.save(reserva);
        // return recargo;
        
        return 0.0; 
    }
}