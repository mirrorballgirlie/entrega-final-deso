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

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    @Query("SELECT e FROM Estadia e " +
       "JOIN e.habitacion h " +
       "WHERE h.numero = :numero " +
       "AND e.fechaEgreso = :fechaEgreso " +
       "AND e.estado = com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia.ACTIVA") // <--- PAQUETE COMPLETO
Optional<Estadia> buscarEstadiaPorHabitacionYSalida(
    @Param("numero") Integer numero, 
    @Param("fechaEgreso") LocalDate fechaEgreso
);

    List<Factura> findAllByCuit(String cuit);

}

