package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva; // Asegúrate de importar esto
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("""
        SELECT r FROM Reserva r
        WHERE (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
    """)
    List<Reserva> findReservasSolapadas(LocalDate fechaDesde, LocalDate fechaHasta);

    List<Reserva> findByFechaDesdeBetween(LocalDate fechaDesde, LocalDate fechaHasta);

    @Query("""
        SELECT r FROM Reserva r 
        WHERE r.habitacion.id = :idHabitacion 
        AND (r.fechaDesde <= :fechaHasta 
        AND r.fechaHasta >= :fechaDesde)
        AND r.estado = :estado
    """)
    List<Reserva> verificarDisponibilidad(@Param("idHabitacion") Long idHabitacion, @Param("fechaDesde") LocalDate fechaDesde, @Param("fechaHasta") LocalDate fechaHasta, @Param("estado") EstadoReserva estado);

    @Query("""
    SELECT COUNT(r) > 0 FROM Reserva r
    WHERE r.habitacion.id = :idHabitacion
    AND r.fechaDesde <= :dia
    AND r.fechaHasta >= :dia
    """)
    boolean existeReservaEnDia(Long idHabitacion, LocalDate dia);

    @Query("SELECT MAX(r.numero) FROM Reserva r")
    Integer obtenerMaximoNumero();

    // --- CORRECCIÓN AQUÍ ---
    // Quitamos el "= 0" hardcodeado y pasamos el Enum como parámetro ":estado"
    @Query("""
       SELECT r FROM Reserva r 
       WHERE r.habitacion.id = :habitacionId 
       AND :dia BETWEEN r.fechaDesde AND r.fechaHasta 
       AND r.estado = :estado
    """)
    List<Reserva> encontrarReservasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") EstadoReserva estado);

}