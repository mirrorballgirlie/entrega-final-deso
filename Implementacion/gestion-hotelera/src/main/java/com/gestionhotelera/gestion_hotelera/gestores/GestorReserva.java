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

    // --- MÉTODO 1: VALIDAR SELECCIÓN (Agregalo devuelta!) ---
    public ValidarSeleccionResponse validarSeleccion(ValidarSeleccionRequest req){
        validarFechas(req.getFechaDesde(), req.getFechaHasta());
        if (req.getHabitacionIds() == null || req.getHabitacionIds().isEmpty()) 
            throw new BadRequestException("Sin habitaciones.");

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
                idHabitacion, req.getFechaDesde(), req.getFechaHasta(), EstadoReserva.ACTIVA
            );

            if (!solapadas.isEmpty()) {
                errores.add("Habitación " + h.getNumero() + " ocupada en esas fechas.");
                continue;
            }
            validas.add(idHabitacion);
        }
        return new ValidarSeleccionResponse(validas, errores);
    }

    // --- MÉTODO 2: CONFIRMAR RESERVAS ---
    @Transactional
    public ConfirmarReservaResponse confirmarReservas(ConfirmarReservaRequest req) {
        // ... (Mantené tu lógica de confirmación aquí)
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