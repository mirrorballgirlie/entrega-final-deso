
package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;
import java.util.Optional;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia;
import com.gestionhotelera.gestion_hotelera.dto.EstadiaDTO; // Importa tu DTO para usarlo en el método de consulta
import com.gestionhotelera.gestion_hotelera.modelo.Estadia; // Importa tu entidad para usarla en el método de consulta
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion; // Importa tu entidad para usarla en el método de consulta



@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {

    // Método para obtener el objeto Estadía completo
    @Query("""
        SELECT e FROM Estadia e 
        WHERE e.habitacion.id = :habitacionId 
        AND :dia BETWEEN e.fechaIngreso AND e.fechaEgreso 
        AND e.estado = :estado
    """)
    List<Estadia> encontrarEstadiasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") EstadoEstadia estado);

    // Método simple booleano
    @Query("""
        SELECT COUNT(e) > 0 FROM Estadia e
        WHERE e.habitacion.id = :idHabitacion
        AND e.fechaIngreso <= :dia
        AND e.fechaEgreso >= :dia
        AND e.estado = EstadoEstadia.ACTIVA
    """)
    boolean existeEstadiaEnDia(@Param("idHabitacion") Long idHabitacion, @Param("dia") LocalDate dia);
    
    // Método para detectar solapamientos al crear nueva estadía (importante para tu validación anterior)
    @Query("""
        SELECT e FROM Estadia e
        WHERE e.fechaIngreso < :fechaHasta 
        AND e.fechaEgreso > :fechaDesde
        AND e.estado != EstadoEstadia.CANCELADA
    """)
    List<Estadia> findEstadiasQueSolapan(@Param("fechaDesde") LocalDate fechaDesde, @Param("fechaHasta") LocalDate fechaHasta);

    // metodos para obtener estadias con fucha de egreso y numero de habitacion
    @Query("""
        SELECT e FROM Estadia e
        JOIN e.habitacion h
        WHERE h.numero = :numero
        AND e.fechaEgreso = :fechaEgreso
        AND h.estado = 'OCUPADA'
        AND e.estado = EstadoEstadia.ACTIVA
    """)
    List<Estadia> buscarEstadiaPorHabitacionYSalida(@Param("numero") Integer numero, @Param("fechaEgreso") LocalDate fechaEgreso);
    
    Optional<Estadia> findByHabitacionAndEstado(Habitacion habitacion, EstadoEstadia estado);

}