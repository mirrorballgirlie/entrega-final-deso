package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestionhotelera.gestion_hotelera.dto.HabitacionOcupacionDTO;
import com.gestionhotelera.gestion_hotelera.dto.OcuparRequest;
import com.gestionhotelera.gestion_hotelera.dto.OcuparResponse;
import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionRequest;
import com.gestionhotelera.gestion_hotelera.dto.ValidarOcupacionResponse;
import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HabitacionRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
class GestorEstadiaTest {

    @Mock
    private HabitacionRepository habitacionRepository;
    @Mock
    private ReservaRepository reservaRepository;
    @Mock
    private EstadiaRepository estadiaRepository;
    @Mock
    private HuespedRepository huespedRepository;

    @InjectMocks
    private GestorEstadia gestorEstadia;

    private Habitacion habitacion;
    private HabitacionOcupacionDTO habitacionDTO;

    @BeforeEach
    void setup() {
        habitacion = new Habitacion();
        habitacion.setId(1L);
        habitacion.setNumero(101);
        habitacion.setEstado("DISPONIBLE");

        habitacionDTO = new HabitacionOcupacionDTO();
        habitacionDTO.setHabitacionId(1L);
        habitacionDTO.setFechaDesde(LocalDate.now());
        habitacionDTO.setFechaHasta(LocalDate.now().plusDays(2));
    }

    // =========================
    // VALIDAR OCUPACION
    // =========================

    @Test
    void validarOcupacion_ok() {
        when(habitacionRepository.findById(1L)).thenReturn(Optional.of(habitacion));
        when(estadiaRepository.findEstadiasQueSolapan(any(), any())).thenReturn(List.of());
        when(estadiaRepository.existeEstadiaEnDia(anyLong(), any())).thenReturn(false);
        when(reservaRepository.verificarDisponibilidad(
                anyLong(), any(), any(), eq(EstadoReserva.ACTIVA)))
                .thenReturn(List.of());

        ValidarOcupacionRequest req = new ValidarOcupacionRequest(List.of(habitacionDTO));

        ValidarOcupacionResponse resp = gestorEstadia.validarOcupacion(req);

        assertEquals(1, resp.getHabitacionIdsValidas().size());
        assertTrue(resp.getErrores().isEmpty());
        assertTrue(resp.getConflictos().isEmpty());
    }

    @Test
    void validarOcupacion_habitacionEnMantenimiento() {
        habitacion.setEstado("MANTENIMIENTO");
        when(habitacionRepository.findById(1L)).thenReturn(Optional.of(habitacion));

        ValidarOcupacionRequest req = new ValidarOcupacionRequest(List.of(habitacionDTO));
        ValidarOcupacionResponse resp = gestorEstadia.validarOcupacion(req);

        assertTrue(resp.getHabitacionIdsValidas().isEmpty());
        assertFalse(resp.getErrores().isEmpty());
    }

    @Test
    void validarOcupacion_conReserva() {
        when(habitacionRepository.findById(1L)).thenReturn(Optional.of(habitacion));
        when(estadiaRepository.findEstadiasQueSolapan(any(), any())).thenReturn(List.of());
        when(estadiaRepository.existeEstadiaEnDia(anyLong(), any())).thenReturn(false);

        Reserva r = new Reserva();
        r.setId(10L);
        r.setNombre("Juan");
        r.setApellido("Perez");
        r.setFechaDesde(LocalDate.now());
        r.setFechaHasta(LocalDate.now().plusDays(1));

        when(reservaRepository.verificarDisponibilidad(
                anyLong(), any(), any(), eq(EstadoReserva.ACTIVA)))
                .thenReturn(List.of(r));

        ValidarOcupacionResponse resp = gestorEstadia
                .validarOcupacion(new ValidarOcupacionRequest(List.of(habitacionDTO)));

        assertTrue(resp.getHabitacionIdsValidas().isEmpty());
        assertEquals(1, resp.getConflictos().size());
    }

    // =========================
    // OCUPAR HABITACIONES
    // =========================

    @Test
    void ocuparHabitaciones_ok() {
        Huesped h = new Huesped();
        h.setId(1L);

        when(huespedRepository.findAllById(List.of(1L))).thenReturn(List.of(h));
        when(habitacionRepository.findById(1L)).thenReturn(Optional.of(habitacion));
        when(estadiaRepository.findEstadiasQueSolapan(any(), any())).thenReturn(List.of());
        when(reservaRepository.verificarDisponibilidad(
                anyLong(), any(), any(), eq(EstadoReserva.ACTIVA)))
                .thenReturn(List.of());
        when(estadiaRepository.save(any())).thenAnswer(i -> {
            Estadia e = i.getArgument(0);
            e.setId(99L);
            return e;
        });

        OcuparRequest req = new OcuparRequest();
        req.setHabitaciones(List.of(habitacionDTO));
        req.setHuespedIds(List.of(1L));
        req.setOpcionOcuparIgual(false);

        OcuparResponse resp = gestorEstadia.ocuparHabitaciones(req);

        assertEquals(1, resp.getEstadiaIds().size());
    }

    @Test
    void ocuparHabitaciones_huespedInexistente() {
        when(huespedRepository.findAllById(List.of(1L))).thenReturn(List.of());

        OcuparRequest req = new OcuparRequest();
        req.setHabitaciones(List.of(habitacionDTO));
        req.setHuespedIds(List.of(1L));

        assertThrows(ResourceNotFoundException.class,
                () -> gestorEstadia.ocuparHabitaciones(req));
    }

    @Test
    void ocuparHabitaciones_habitacionEnMantenimiento() {
        habitacion.setEstado("MANTENIMIENTO");

        //when(huespedRepository.findAllById(List.of(1L))).thenReturn(List.of(new Huesped(1L)));

        Huesped h = new Huesped();
        h.setId(1L);
        
        when(huespedRepository.findAllById(List.of(1L))).thenReturn(List.of(h));


        when(habitacionRepository.findById(1L)).thenReturn(Optional.of(habitacion));

        OcuparRequest req = new OcuparRequest();
        req.setHabitaciones(List.of(habitacionDTO));
        req.setHuespedIds(List.of(1L));

        assertThrows(BadRequestException.class,
                () -> gestorEstadia.ocuparHabitaciones(req));
    }
}
