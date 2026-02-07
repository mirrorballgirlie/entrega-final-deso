package com.gestionhotelera.gestion_hotelera.gestores;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestionhotelera.gestion_hotelera.dto.DireccionDTO;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Direccion;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.repository.DireccionRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;



@ExtendWith(MockitoExtension.class)
class GestorHuespedTest {

    @Mock
    private HuespedRepository huespedRepository;
    @Mock
    private DireccionRepository direccionRepository;


    @InjectMocks
    private GestorHuesped gestorHuesped;

    // ---------- helpers ----------

    // private HuespedDTO crearHuespedDTO() {
    //     HuespedDTO dto = new HuespedDTO();
    //     dto.setNombre("Maria");
    //     dto.setApellido("Perez");
    //     dto.setDocumento("12345678");
    //     dto.setTipoDocumento("DNI");
    //     dto.setTelefono("123456");
    //     dto.setEmail("mail@mail.com");
    //     dto.setFechaNacimiento(LocalDate.of(2000, 1, 1));

    //     Direccion direccion = new Direccion();
    //     direccion.setCalle("Calle Falsa");
    //     direccion.setNumero(123);
    //     direccion.setCiudad("Ciudad");
    //     direccion.setProvincia("Provincia");

    //     dto.setDireccion(direccion);
    //     return dto;
    // }

    private HuespedDTO crearHuespedDTO() {
    HuespedDTO dto = new HuespedDTO();
    dto.setNombre("Maria");
    dto.setApellido("Perez");
    dto.setDocumento("12345678");
    dto.setTipoDocumento("DNI");
    dto.setTelefono("123456");
    dto.setEmail("mail@mail.com");
    dto.setFechaNacimiento(LocalDate.of(2000, 1, 1));

    DireccionDTO direccion = new DireccionDTO();
    direccion.setCalle("Calle Falsa");
    direccion.setNumero(123);
    direccion.setCiudad("Ciudad");
    direccion.setProvincia("Provincia");

    dto.setDireccion(direccion);
    return dto;
}


    private Huesped crearHuesped() {
        Huesped h = new Huesped();
        h.setId(1L);
        h.setNombre("Maria");
        h.setApellido("Perez");
        h.setDocumento("12345678");
        h.setTipoDocumento("DNI");
        h.setDireccion(new Direccion());
        return h;
    }

    // ---------- tests ----------

    @Test
    void altaHuesped_ok() {
        //when(huespedRepository.existsByTipoDocumentoAndDocumento("DNI", "12345678")).thenReturn(false);

        when(huespedRepository.findByTipoDocumentoAndDocumento("DNI", "12345678")).thenReturn(Optional.empty());

        when(direccionRepository.save(any(Direccion.class))).thenAnswer(inv -> inv.getArgument(0));

  
        when(huespedRepository.save(any(Huesped.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        //Huesped resultado = gestorHuesped.registrarHuesped(dto)Huesped(crearHuespedDTO());

        Huesped resultado = gestorHuesped.registrarHuesped(crearHuespedDTO());


        assertNotNull(resultado);
        verify(huespedRepository).save(any(Huesped.class));
    }

    @Test
    void altaHuesped_yaExiste_lanzaExcepcion() {
        // when(huespedRepository.existsByTipoDocumentoAndDocumento("DNI", "12345678"))
        //         .thenReturn(true);

        when(huespedRepository.findByTipoDocumentoAndDocumento("DNI", "12345678"))
        .thenReturn(Optional.of(new Huesped()));


        // assertThrows(
        //         RuntimeException.class,
        //         () -> gestorHuesped.registrarHuesped(dto)Huesped(crearHuespedDTO())
        // );

        //assertThrows(RuntimeException.class,() -> gestorHuesped.registrarHuesped(crearHuespedDTO()));
        assertThrows(IllegalArgumentException.class,() -> gestorHuesped.registrarHuesped(crearHuespedDTO()));


    }

    @Test
    void obtenerTodos_devuelveLista() {
        when(huespedRepository.findAll())
                .thenReturn(List.of(new Huesped()));

        List<Huesped> resultado = gestorHuesped.obtenerTodos();

        assertEquals(1, resultado.size());
    }

    @Test
    void buscarPorId_ok() {
        when(huespedRepository.findById(1L))
                .thenReturn(Optional.of(crearHuesped()));

        Huesped h = gestorHuesped.buscarPorId(1L);

        assertNotNull(h);
    }

    @Test
    void buscarPorId_noExiste_lanzaExcepcion() {
        when(huespedRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> gestorHuesped.buscarPorId(1L)
        );
    }

    @Test
    void actualizarHuesped_ok() {
        Huesped existente = crearHuesped();

        when(huespedRepository.findById(1L))
                .thenReturn(Optional.of(existente));

        when(huespedRepository.save(any(Huesped.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Huesped resultado =
                gestorHuesped.actualizarHuesped(1L, crearHuespedDTO());

        assertNotNull(resultado);
        verify(huespedRepository).save(existente);
    }

    @Test
    void actualizarHuesped_noExiste_lanzaExcepcion() {
        when(huespedRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> gestorHuesped.actualizarHuesped(1L, crearHuespedDTO())
        );
    }

    @Test
    void existsByTipoDocumentoAndDocumento_true() {
        when(huespedRepository.existsByTipoDocumentoAndDocumento("DNI", "123"))
                .thenReturn(true);

        boolean existe =
                gestorHuesped.existsByTipoDocumentoAndDocumento("DNI", "123");

        assertTrue(existe);
    }
}

