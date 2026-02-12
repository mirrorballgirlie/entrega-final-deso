package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.time.LocalTime; 
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
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import lombok.*;


@Service
@RequiredArgsConstructor
public class GestorReserva {

    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final HuespedRepository huespedRepository; 
    private final GestorHuesped gestorHuesped; // Para reutilizar lógica de búsqueda de huéspedes

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

        Integer maxNumero = reservaRepository.obtenerMaximoNumero();
        int proximoNumero = (maxNumero != null) ? maxNumero + 1 : 1;

        // 2. Ahora creamos la entidad usando el Builder
        Reserva reserva = Reserva.builder()
            .apellido(req.getApellido())
            .nombre(req.getNombre())
            .telefono(req.getTelefono())
            .fechaDesde(req.getFechaDesde())
            .fechaHasta(req.getFechaHasta())
            .estado(EstadoReserva.ACTIVA)
            .numero(proximoNumero) // <--- Usamos la variable que calculamos arriba
            .habitacion(hab) 
            .cliente(huespedRepository.findById(req.getClienteId()).orElse(null))
            .build();

        
        
        
        // 4. Cambiar el estado de la Habitación
        hab.setEstado("RESERVADA"); //DESCOMENTAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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

<<<<<<< HEAD
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

    //para CU6 cancelar reserva, vamos a reciclar el metodo que tenemos en gestor huesped

    public List<Reserva> buscarReservasPorApellidoYNombre(String apellido, String nombre) {
    if (apellido == null || apellido.isBlank()) {
        throw new BadRequestException("El campo apellido no puede estar vacío");
    }

    // Reutilizamos GestorHuesped 
    List<Huesped> huespedes = gestorHuesped.buscarFiltrado(apellido.toUpperCase(), nombre != null ? nombre.toUpperCase() : null, null, null);

    if (huespedes.isEmpty()) return List.of(); // No hay resultados

    // Ahora buscamos reservas activas de esos huéspedes
    List<Reserva> reservas = new ArrayList<>();
    for (Huesped h : huespedes) {
        List<Reserva> res = reservaRepository.findAll().stream()
                .filter(r -> r.getCliente() != null && r.getCliente().getId().equals(h.getId()))
                .filter(r -> r.getEstado() == EstadoReserva.ACTIVA)
                .toList();
        reservas.addAll(res);
    }

    return reservas;
}

=======
     // --- MÉTODO 4: BUSCAR RESERVAS ACTIVAS POR TITULAR ---
        public List<ReservaDTO> buscarReservasActivas(String nombre, String apellido) {
        List<Reserva> reservas = reservaRepository.findByClienteNombreAndClienteApellidoAndEstado(
            nombre, 
            apellido, 
            EstadoReserva.ACTIVA
        );
        return reservas.stream().map(reserva -> {
            return ReservaDTO.builder()
                .id(reserva.getId())
                .fechaDesde(reserva.getFechaDesde())
                .fechaHasta(reserva.getFechaHasta())
                .numero(reserva.getHabitacion() != null ? reserva.getHabitacion().getNumero() : null)
                .nombre(reserva.getNombre())
                .apellido(reserva.getApellido())
                .tipoHabitacion(reserva.getHabitacion() != null ? reserva.getHabitacion().getTipo().name() : null)
                .build();
        }).collect(Collectors.toList());
    }    
>>>>>>> develop-thiago
}