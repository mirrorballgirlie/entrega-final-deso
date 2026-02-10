package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
import com.gestionhotelera.gestion_hotelera.modelo.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // --- 1. MÉTODO QUE FALTABA (Corrige el error en GestorReserva) ---
    // Busca el número más alto de reserva para generar el siguiente (autonumérico lógico)
    // NOTA: Asegúrate de que tu entidad Reserva tenga un campo llamado 'numero'.
    @Query("SELECT MAX(r.numero) FROM Reserva r")
    Integer obtenerMaximoNumero();


    // --- 2. VALIDACIÓN DE DISPONIBILIDAD (Corrige el error 500) ---
    // Ahora acepta 'EstadoReserva estado' como 4to parámetro
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.habitacion.id = :habitacionId
        AND r.estado = :estado
        AND (
            (r.fechaDesde < :hasta AND r.fechaHasta > :desde)
        )
    """)
    List<Reserva> verificarDisponibilidad(
        @Param("habitacionId") Long habitacionId,
        @Param("desde") LocalDate desde,
        @Param("hasta") LocalDate hasta,
        @Param("estado") EstadoReserva estado
    );


    // --- 3. MÉTODOS PARA EL CALENDARIO (GestorHabitacion) ---

    // Obtener objeto Reserva completo en un día específico
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.habitacion.id = :habitacionId
        AND :dia BETWEEN r.fechaDesde AND r.fechaHasta
        AND r.estado = :estado
    """)
    List<Reserva> encontrarReservasEnDia(
        @Param("habitacionId") Long habitacionId, 
        @Param("dia") LocalDate dia, 
        @Param("estado") EstadoReserva estado
    );

    // Booleano rápido para pintar el calendario
    @Query("""
        SELECT COUNT(r) > 0 FROM Reserva r
        WHERE r.habitacion.id = :habitacionId
        AND :dia BETWEEN r.fechaDesde AND r.fechaHasta
        AND r.estado = :estado
    """)
    boolean existeReservaEnDia(
        @Param("habitacionId") Long habitacionId, 
        @Param("dia") LocalDate dia, 
        @Param("estado") EstadoReserva estado
    );
     
    // Buscar listas grandes de reservas activas en rango (para optimización)
    @Query("""
        SELECT r FROM Reserva r
        WHERE r.estado = :estadoActiva
        AND (
            (r.fechaDesde <= :hasta AND r.fechaHasta >= :desde)
        )
    """)
    List<Reserva> findReservasQueSolapan(
        @Param("desde") LocalDate desde, 
        @Param("hasta") LocalDate hasta,
        @Param("estadoActiva") EstadoReserva estadoActiva
    );

    // --- 4. BÚSQUEDA POR TITULAR (ReservaController) ---
    @Query("""
        SELECT r FROM Reserva r 
        WHERE LOWER(r.cliente.apellido) = LOWER(:apellido) 
        AND (:nombre IS NULL OR :nombre = '' OR LOWER(r.cliente.nombre) = LOWER(:nombre))
        AND r.estado = :estado
    """)
    List<Reserva> findByClienteNombreAndClienteApellidoAndEstado(
        @Param("nombre") String nombre, 
        @Param("apellido") String apellido, 
        @Param("estado") EstadoReserva estado
    );


}