package com.gestionhotelera.gestion_hotelera.gestores;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.gestionhotelera.gestion_hotelera.dto.LoginRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.UsuarioDTO;
import com.gestionhotelera.gestion_hotelera.exception.BadRequestException;
import com.gestionhotelera.gestion_hotelera.modelo.Usuario;
import com.gestionhotelera.gestion_hotelera.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class GestorUsuarioTest {

    @InjectMocks
    private GestorUsuario gestorUsuario;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Test
    void autenticar_ok() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsuario("admin");
        request.setContrasenia("1234");

        Usuario usuario = new Usuario();
        usuario.setUsuario("admin");
        usuario.setContrasenia("1234");

        when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuario));

        // Act
        UsuarioDTO resultado = gestorUsuario.autenticar(request);

        // Assert
        assertEquals("admin", resultado.getUsuario());
        verify(usuarioRepository).findByUsuario("admin");
    }

    @Test
    void autenticar_usuarioNoExiste_lanzaExcepcion() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsuario("admin");
        request.setContrasenia("1234");

        when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(
                BadRequestException.class,
                () -> gestorUsuario.autenticar(request)
        );

        verify(usuarioRepository).findByUsuario("admin");
    }

    @Test
    void autenticar_contraseniaIncorrecta_lanzaExcepcion() {
        // Arrange
        LoginRequestDTO request = new LoginRequestDTO();
        request.setUsuario("admin");
        request.setContrasenia("incorrecta");

        Usuario usuario = new Usuario();
        usuario.setUsuario("admin");
        usuario.setContrasenia("1234");

        when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuario));

        // Act + Assert
        assertThrows(
                BadRequestException.class,
                () -> gestorUsuario.autenticar(request)
        );

        verify(usuarioRepository).findByUsuario("admin");
    }
}

