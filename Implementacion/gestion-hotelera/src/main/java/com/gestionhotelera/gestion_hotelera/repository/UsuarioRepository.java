package com.gestionhotelera.gestion_hotelera.repository;
import com.gestionhotelera.gestion_hotelera.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
