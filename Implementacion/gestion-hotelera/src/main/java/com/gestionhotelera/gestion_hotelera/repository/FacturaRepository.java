package com.gestionhotelera.gestion_hotelera.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    @Query("SELECT f FROM Factura f JOIN f.estadia e WHERE e.habitacion.numero = :nroHabitacion AND f.estado = :estado")
    List<Factura> findFacturasPendientesByNroHabitacionyEstado(@Param("nroHabitacion") Integer nroHabitacion, @Param("estado") EstadoFactura estado);

    @Query("SELECT f FROM Factura f WHERE " +
           "REPLACE(REPLACE(f.cuit, '-', ''), '.', '') = :cuitNormalizado " +
           "AND f.estado = :estado")
    List<Factura> findByCuitRobust(@Param("cuitNormalizado") String cuitNormalizado, @Param("estado") EstadoFactura estado);

//     // Búsqueda robusta por Tipo y Nro de Documento
// @Query("SELECT f FROM Factura f " +
//        "JOIN TREAT(f.responsableDePago AS PersonaFisica) pf " +
//        "JOIN pf.huesped h " +
//        "WHERE h.tipoDocumento = :tipoDoc " + // <--- ESTO FALTABA
//        "AND REPLACE(REPLACE(h.documento, '.', ''), ' ', '') = :nroDocNormalizado " +
//        "AND f.estado = :estado")
// List<Factura> findByDocRobust(
//     @Param("tipoDoc") String tipoDoc, 
//     @Param("nroDocNormalizado") String nroDocNormalizado, 
//     @Param("estado") EstadoFactura estado

    @Query("SELECT f FROM Factura f " +
       "JOIN TREAT(f.responsableDePago AS PersonaFisica) pf " +
       "JOIN pf.huesped h " +
       "WHERE UPPER(h.tipoDocumento) = UPPER(:tipoDoc) " + 
       "AND UPPER(REPLACE(REPLACE(REPLACE(h.documento, '.', ''), ' ', ''), '-', '')) = :nroDocNormalizado " +
       "AND f.estado = :estado")
    List<Factura> findByDocRobust(
        @Param("tipoDoc") String tipoDoc, 
        @Param("nroDocNormalizado") String nroDocNormalizado, 
        @Param("estado") EstadoFactura estado
);



}


