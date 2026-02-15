package com.gestionhotelera.gestion_hotelera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;

import java.util.List;

@Repository
public interface ResponsableDePagoRepository extends JpaRepository<ResponsableDePago, Long> {

    @Query("SELECT r FROM ResponsableDePago r " +
            "LEFT JOIN PersonaJuridica pj ON r.id = pj.id " +
            "LEFT JOIN PersonaFisica pf ON r.id = pf.id " +
            "WHERE (:razon IS NULL OR :razon = '' OR UPPER(pj.nombreRazonSocial) LIKE UPPER(CONCAT('%', :razon, '%'))) " +
            "AND (:cuit IS NULL OR :cuit = '' OR r.cuit LIKE CONCAT('%', :cuit, '%'))")
    List<ResponsableDePago> buscarPorCriterios(@Param("razon") String razon, @Param("cuit") String cuit);
}


