package com.gestionhotelera.gestion_hotelera.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;

@Repository
public interface PersonaFisicaRepository extends JpaRepository<PersonaFisica, Long> {

    boolean existsByCuit(String cuit);

    Optional<PersonaFisica> findByCuit(String cuit);

    // @Query("""
    //     SELECT pf FROM PersonaFisica pf
    //     JOIN pf.huesped h
    //     WHERE (:razonSocial IS NULL OR UPPER(CONCAT(h.nombre, ' ', h.apellido)) LIKE CONCAT('%', UPPER(:razonSocial), '%'))
    //     AND (:cuit IS NULL OR FUNCTION('REPLACE', pf.cuit, '-', '') LIKE CONCAT('%', REPLACE(:cuit, '-', ''), '%'))
    // """)
    // List<PersonaFisica> buscarPorFiltros(@Param("razonSocial") String razonSocial, @Param("cuit") String cuit);

    // @Query("""
    //     SELECT pf FROM PersonaFisica pf
    //     JOIN pf.huesped h
    //     WHERE (:razonSocial IS NULL OR UPPER(CONCAT(h.nombre, ' ', h.apellido)) LIKE CONCAT('%', UPPER(:razonSocial), '%'))
    // """)
    // List<PersonaFisica> buscarPorRazonSocial(@Param("razonSocial") String razonSocial);
    
}

