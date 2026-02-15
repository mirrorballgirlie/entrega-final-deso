package com.gestionhotelera.gestion_hotelera.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;                                       //agregado luego del analisis de claude

import java.util.List;

@Repository
public interface ResponsableDePagoRepository extends JpaRepository<ResponsableDePago, Long> {

    Optional<ResponsableDePago> findByCuit(String cuit);        //agregado luego del analisis de claude

    // Buscar responsables por CUIT ignorando guiones
    // @Query("""
    //     SELECT r FROM ResponsableDePago r
    //     WHERE FUNCTION('REPLACE', r.cuit, '-', '') LIKE CONCAT('%', REPLACE(:cuit, '-', ''), '%')
    // """)
    // List<ResponsableDePago> buscarPorCuit(String cuit);

    // Nueva consulta para encontrar al responsable asociado al huésped
    @Query("SELECT r FROM ResponsableDePago r WHERE r.huesped.id = :huespedId")
    Optional<ResponsableDePago> findByHuespedId(@Param("huespedId") Long huespedId);

      @Query("SELECT r FROM ResponsableDePago r " +
            "LEFT JOIN PersonaJuridica pj ON r.id = pj.id " +
            "LEFT JOIN PersonaFisica pf ON r.id = pf.id " +
            "WHERE (:razonSocial IS NULL OR :razonSocial = '' OR UPPER(pj.nombreRazonSocial) LIKE UPPER(CONCAT('%', :razonSocial, '%'))) " +
            "AND (:cuit IS NULL OR :cuit = '' OR r.cuit LIKE CONCAT('%', :cuit, '%'))")
    List<ResponsableDePago> buscarPorCriterios(@Param("razonSocial") String razonSocial, @Param("cuit") String cuit);
    
}


 