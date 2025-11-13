package com.gestionhotelera.gestion_hotelera.repository;

import com.gestionhotelera.gestion_hotelera.modelo.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    //buscar reservas por rango de fechas
    List<Reserva> findByFechaDesdeBetween(LocalDate fechaDesde, LocalDate fechaHasta);

    // Verificar si hay reservas en conflicto (CU4)
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.habitacion.id = :idHabitacion
        AND (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
    """)
    List<Reserva> verificarDisponibilidad(Long idHabitacion, LocalDate fechaDesde, LocalDate fechaHasta);
}
