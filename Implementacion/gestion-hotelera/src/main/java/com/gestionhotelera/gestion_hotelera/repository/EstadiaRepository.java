// package com.gestionhotelera.gestion_hotelera.repository;

// import java.time.LocalDate;
// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import com.gestionhotelera.gestion_hotelera.modelo.Estadia;

// @Repository
// public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

//     @Query("""
//         SELECT e FROM Estadia e
//         WHERE e.fechaIngreso <= :fechaHasta AND e.fechaEgreso >= :fechaDesde
//     """)
//     List<Estadia> findEstadiasQueSolapan(LocalDate fechaDesde, LocalDate fechaHasta);

//     @Query("""
//     SELECT COUNT(e) > 0 FROM Estadia e
//     WHERE e.habitacion.id = :idHabitacion
//     AND e.fechaIngreso <= :dia
//     AND e.fechaEgreso >= :dia
//     """)
//     boolean existeEstadiaEnDia(Long idHabitacion, LocalDate dia);

//     List<Estadia> findByFechaIngresoLessThanEqualAndFechaEgresoGreaterThanEqual(LocalDate hasta, LocalDate desde);

//     // --- CORRECCIÓN AQUÍ ---
//     // Quitamos el "= 0" y ponemos "= :estado" para comparar String con String
//     @Query("""
//         SELECT e FROM Estadia e 
//         WHERE e.habitacion.id = :habitacionId 
//         AND :dia BETWEEN e.fechaIngreso AND e.fechaEgreso 
//         AND e.estado = :estado
//         """)
//     List<Estadia> encontrarEstadiasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") String estado);

// }

package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

    // Método para obtener el objeto Estadía completo
    @Query("""
        SELECT e FROM Estadia e 
        WHERE e.habitacion.id = :habitacionId 
        AND :dia BETWEEN e.fechaIngreso AND e.fechaEgreso 
        AND e.estado = :estado
    """)
    List<Estadia> encontrarEstadiasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") String estado);

    // Método simple booleano
    @Query("""
        SELECT COUNT(e) > 0 FROM Estadia e
        WHERE e.habitacion.id = :idHabitacion
        AND e.fechaIngreso <= :dia
        AND e.fechaEgreso >= :dia
        AND e.estado = 'ACTIVA'
    """)
    boolean existeEstadiaEnDia(@Param("idHabitacion") Long idHabitacion, @Param("dia") LocalDate dia);
    
    // Método para detectar solapamientos al crear nueva estadía (importante para tu validación anterior)
    @Query("""
        SELECT e FROM Estadia e
        WHERE e.fechaIngreso < :fechaHasta 
        AND e.fechaEgreso > :fechaDesde
        AND e.estado != 'CANCELADA'
    """)
    List<Estadia> findEstadiasQueSolapan(@Param("fechaDesde") LocalDate fechaDesde, @Param("fechaHasta") LocalDate fechaHasta);

}