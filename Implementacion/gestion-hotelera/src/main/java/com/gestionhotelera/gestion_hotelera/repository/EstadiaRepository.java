package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.Estadia;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {


     // buscar estadías que intersecten el rango
    @Query("""
        SELECT e FROM Estadia e
        WHERE e.fechaIngreso <= :fechaHasta AND e.fechaEgreso >= :fechaDesde
    """)
    List<Estadia> findEstadiasQueSolapan(LocalDate fechaDesde, LocalDate fechaHasta);

    @Query("""
    SELECT COUNT(e) > 0 FROM Estadia e
    WHERE e.habitacion.id = :idHabitacion
    AND e.fechaIngreso <= :dia
    AND e.fechaEgreso >= :dia
    """)
    boolean existeEstadiaEnDia(Long idHabitacion, LocalDate dia);


    //recordar que aca se puede llegar a implemntar alg para el cu15

    List<Estadia> findByFechaIngresoLessThanEqualAndFechaEgresoGreaterThanEqual(LocalDate hasta, LocalDate desde);
}

