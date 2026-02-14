    package com.gestionhotelera.gestion_hotelera.repository;

    import java.time.LocalDate;
    import java.util.List;

    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.stereotype.Repository;

    import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
    import com.gestionhotelera.gestion_hotelera.modelo.TipoHabitacion;
    import java.util.Optional;
    import com.gestionhotelera.gestion_hotelera.modelo.EstadoHabitacion;

    @Repository
    public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {

        //busqueda de habitaciones por tipo o estado
        List <Habitacion> findByTipoOrEstado(TipoHabitacion tipo, EstadoHabitacion estado);

        Optional<Habitacion> findByNumero(Long numero);


        // buscar todas las habitaciones disponibles entre ciertas fechas dadas (para CU4 y CU5)
        @Query("""
            SELECT h FROM Habitacion h
            WHERE h.estado = EstadoHabitacion.DISPONIBLE
            AND (NOT EXISTS (
                SELECT r FROM Reserva r
                WHERE r.habitacion = h
                AND (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
            ))
        """)
        
        List<Habitacion> findHabitacionesDisponibles(LocalDate fechaDesde, LocalDate fechaHasta);
        Optional<Habitacion> findByNumero(Integer numero);
    }
