package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
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
    // --- 1. NUEVA DEPENDENCIA ---
    private final HuespedRepository huespedRepository; 

    private void validarFechas(LocalDate desde, LocalDate hasta) {
        if (desde == null || hasta == null) throw new BadRequestException("Fechas nulas.");
        if (hasta.isBefore(desde)) throw new BadRequestException("Fecha hasta anterior a desde.");
    }

    // --- MÉTODO 1: VALIDAR SELECCIÓN ---
    public ValidarSeleccionResponse validarSeleccion(ValidarSeleccionRequest req){
        validarFechas(req.getFechaDesde(), req.getFechaHasta());
        //validacion si no hay fechas
        if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) throw new BadRequestException("Sin habitaciones.");

        List<Long> validas = new ArrayList<>();
        List<String> errores = new ArrayList<>();

        for (long idHabitacion : req.getHabitacionIds()){
            Habitacion h = habitacionRepository.findById(idHabitacion).orElse(null);
            if (h == null) { errores.add("ID " + idHabitacion + " no existe."); continue; }

            String estado = h.getEstado();
            if ("MANTENIMIENTO".equalsIgnoreCase(estado) || "FUERA_SERVICIO".equalsIgnoreCase(estado)) {
                errores.add("Habitación " + h.getNumero() + " en " + estado);
                continue;
            }

            List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(
                idHabitacion, 
                req.getFechaDesde(), 
                req.getFechaHasta(), 
                EstadoReserva.ACTIVA
            );

            if (!solapadas.isEmpty()) {
                errores.add("Habitación " + h.getNumero() + " ocupada en esas fechas.");
                continue;
            }
            validas.add(idHabitacion);
        }
        return new ValidarSeleccionResponse(validas, errores);
    }

    // --- MÉTODO 2: CONFIRMAR (Guardar) ---
    @Transactional
    public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
        validarFechas(req.getFechaDesde(), req.getFechaHasta());

        // --- 2. LÓGICA DE VINCULACIÓN CON CLIENTE ---
        Huesped clienteEncontrado = null;
        if (req.getClienteId() != null) {
            // Buscamos el cliente por ID. Si no existe, lo dejamos null (o podrias lanzar error)
            clienteEncontrado = huespedRepository.findById(req.getClienteId()).orElse(null);
        }

        List<Long> reservasCreadas = new ArrayList<>();

        for (Long idHabitacion : req.getHabitacionIds()) {
            Habitacion h = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada"));

            if ("MANTENIMIENTO".equalsIgnoreCase(h.getEstado())) {
                throw new BadRequestException("Habitación en mantenimiento.");
            }

            List<Reserva> solapadas = reservaRepository.verificarDisponibilidad(
                idHabitacion, 
                req.getFechaDesde(), 
                req.getFechaHasta(), 
                EstadoReserva.ACTIVA
            );

            if (!solapadas.isEmpty()) {
                throw new BadRequestException("Habitación " + h.getNumero() + " ya ocupada en esas fechas.");
            }

            int nuevoNumero = generarNumeroReserva();

            Reserva r = Reserva.builder()
                    .numero(nuevoNumero)
                    .estado(EstadoReserva.ACTIVA)
                    .fechaDesde(req.getFechaDesde())
                    .fechaHasta(req.getFechaHasta())
                    .nombre(req.getNombre().toUpperCase())
                    .apellido(req.getApellido().toUpperCase())
                    .telefono(req.getTelefono())
                    .habitacion(h)
                    // --- 3. ASIGNAMOS EL CLIENTE ---
                    .cliente(clienteEncontrado) // Será un objeto Huesped o null
                    .build();

            Reserva saved = reservaRepository.save(r);
            reservasCreadas.add(saved.getId());
        }
        return new ConfirmarReservaResponse(reservasCreadas, "Éxito");
    }

    private int generarNumeroReserva() {
        Integer max = reservaRepository.obtenerMaximoNumero();
        return (max == null) ? 1 : max + 1;
    }
}