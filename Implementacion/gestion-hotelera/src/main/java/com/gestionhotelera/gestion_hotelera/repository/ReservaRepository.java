package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("""
        SELECT r FROM Reserva r
        WHERE (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
    """)

    List <Reserva> findReservasSolapadas(LocalDate fechaDesde, LocalDate fechaHasta);

    //buscar reservas por rango de fechas
    List<Reserva> findByFechaDesdeBetween(LocalDate fechaDesde, LocalDate fechaHasta);

    // Verificar si hay reservas en conflicto (CU4)
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.habitacion.id = :idHabitacion
        AND (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
    """)
    List<Reserva> verificarDisponibilidad(Long idHabitacion, LocalDate fechaDesde, LocalDate fechaHasta);

    @Query("""
    SELECT COUNT(r) > 0 FROM Reserva r
    WHERE r.habitacion.id = :idHabitacion
    AND r.fechaDesde <= :dia
    AND r.fechaHasta >= :dia
    """)
    boolean existeReservaEnDia(Long idHabitacion, LocalDate dia);


    
}
