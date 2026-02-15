
package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia;
import com.gestionhotelera.gestion_hotelera.dto.EstadiaDTO; 
import com.gestionhotelera.gestion_hotelera.modelo.Estadia; 
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion; 
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.modelo.Habitacion;



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
        WHERE e.fechaIngreso < :hasta 
        AND e.fechaEgreso > :desde
        AND CAST(e.estado as integer) <> 2
    """)
    List<Estadia> findEstadiasQueSolapan(@Param("desde") LocalDate desde, @Param("hasta") LocalDate hasta);

    // metodos para obtener estadias con fucha de egreso y numero de habitacion
    @Query("""
        SELECT e FROM Estadia e
        JOIN e.habitacion h
        WHERE h.numero = :numero
        AND e.fechaEgreso = :fechaEgreso
        AND h.estado = EstadoHabitacion.OCUPADA
        AND e.estado = EstadoEstadia.ACTIVA
    """)
    List<Estadia> buscarEstadiaPorHabitacionYSalida(@Param("numero") Integer numero, @Param("fechaEgreso") LocalDate fechaEgreso);
    
    @Query("""
        SELECT e FROM Estadia e
        JOIN e.habitacion h
        WHERE h.numero = :numero
        AND e.fechaEgreso = :fechaEgreso
        AND e.estado = EstadoEstadia.ACTIVA
    """)
    Optional<Estadia> findByHabitacionAndEstado(Habitacion habitacion, EstadoEstadia estado);
 
    @Query("SELECT e FROM Estadia e JOIN FETCH e.huespedes WHERE e.habitacion.numero = :numero AND e.fechaEgreso = :fechaEgreso AND e.estado = EstadoEstadia.ACTIVA")
    Optional<Estadia> buscarActivaPorHabitacionYFecha(@Param("numero") Integer numero, @Param("fechaEgreso") LocalDate fechaEgreso);
    
    

    Optional<Estadia> findByHabitacionNumeroAndEstado(Integer numeroHabitacion, Integer estado);

    @Query("""
    SELECT e FROM Estadia e
    WHERE e.habitacion.numero = :numero
    AND e.estado = com.gestionhotelera.gestion_hotelera.modelo.EstadoEstadia.OCUPADA
    """)
    List<Estadia> buscarEstadiaOcupadaPorHabitacion(Integer numero);



}