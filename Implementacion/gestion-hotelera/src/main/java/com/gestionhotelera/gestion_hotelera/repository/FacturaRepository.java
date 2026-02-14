package com.gestionhotelera.gestion_hotelera.repository;

import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import java.util.List;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    @Query("SELECT f FROM Factura f JOIN f.estadia e WHERE e.habitacion.numero = :nroHabitacion AND f.estado = :estado")
    List<Factura> findFacturasPendientesByNroHabitacionyEstado(@Param("nroHabitacion") Integer nroHabitacion, @Param("estado") EstadoFactura estado);

    List<Factura> findAllByCuit(String cuit);

}

