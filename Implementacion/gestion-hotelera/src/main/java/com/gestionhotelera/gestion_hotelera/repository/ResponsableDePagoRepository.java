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
            "WHERE (:razonSocial IS NULL OR :razonSocial = '' OR UPPER(pj.nombreRazonSocial) LIKE UPPER(CONCAT('%', :razonSocial, '%'))) " +
            "AND (:cuit IS NULL OR :cuit = '' OR r.cuit LIKE CONCAT('%', :cuit, '%'))")
    List<ResponsableDePago> buscarPorCriterios(@Param("razonSocial") String razonSocial, @Param("cuit") String cuit);
}


 