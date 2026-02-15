package com.gestionhotelera.gestion_hotelera.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;

@Repository
public interface PersonaFisicaRepository extends JpaRepository<PersonaFisica, Long> {

    boolean existsByCuit(String cuit);
    Optional<PersonaFisica> findByCuit(String cuit);
    Optional<PersonaFisica> findByHuespedId(Long huespedId);
    boolean existsByHuespedId(Long huespedId);

    @Query("SELECT pf FROM PersonaFisica pf JOIN pf.huesped h WHERE " +
            "(LOWER(h.nombre) LIKE LOWER(CONCAT('%', :txt, '%')) OR " +
            "LOWER(h.apellido) LIKE LOWER(CONCAT('%', :txt, '%'))) " +
            "AND pf.cuit LIKE CONCAT('%', :cuit, '%')")
    List<PersonaFisica> buscarPorNombreOApellidoYCuit(@Param("txt") String texto, @Param("cuit") String cuit);

}

