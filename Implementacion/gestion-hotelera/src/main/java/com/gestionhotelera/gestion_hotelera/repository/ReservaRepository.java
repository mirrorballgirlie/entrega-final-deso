// package com.gestionhotelera.gestion_hotelera.repository;

// import java.time.LocalDate;
// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva; // Asegúrate de importar esto
// import com.gestionhotelera.gestion_hotelera.modelo.Reserva;

// @Repository
// public interface ReservaRepository extends JpaRepository<Reserva, Long> {

//     @Query("""
//         SELECT r FROM Reserva r
//         WHERE (r.fechaDesde <= :fechaHasta AND r.fechaHasta >= :fechaDesde)
//     """)
//     List<Reserva> findReservasSolapadas(LocalDate fechaDesde, LocalDate fechaHasta);

//     List<Reserva> findByFechaDesdeBetween(LocalDate fechaDesde, LocalDate fechaHasta);

//     @Query("""
//         SELECT r FROM Reserva r 
//         WHERE r.habitacion.id = :idHabitacion 
//         AND (r.fechaDesde <= :fechaHasta 
//         AND r.fechaHasta >= :fechaDesde)
//         AND r.estado = :estado
//     """)
//     List<Reserva> verificarDisponibilidad(@Param("idHabitacion") Long idHabitacion, @Param("fechaDesde") LocalDate fechaDesde, @Param("fechaHasta") LocalDate fechaHasta, @Param("estado") EstadoReserva estado);

//     // @Query("""
//     // SELECT COUNT(r) > 0 FROM Reserva r
//     // WHERE r.habitacion.id = :idHabitacion
//     // AND r.fechaDesde <= :dia
//     // AND r.fechaHasta >= :dia
//     // """)
//     // boolean existeReservaEnDia(Long idHabitacion, LocalDate dia);
//     // Método para obtener el objeto Reserva completo en un día
//     @Query("""
//         SELECT r FROM Reserva r
//         WHERE r.habitacion.id = :habitacionId
//         AND :dia BETWEEN r.fechaDesde AND r.fechaHasta
//         AND r.estado = :estado
//     """)
//     List<Reserva> encontrarReservasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") EstadoReserva estado);

//     // Método simple booleano para listas rápidas
//     @Query("""
//         SELECT COUNT(r) > 0 FROM Reserva r
//         WHERE r.habitacion.id = :habitacionId
//         AND :dia BETWEEN r.fechaDesde AND r.fechaHasta
//         AND r.estado = :estado
//     """)
//     boolean existeReservaEnDia(
//         @Param("habitacionId") Long habitacionId, 
//         @Param("dia") LocalDate dia, 
//         @Param("estado") EstadoReserva estado // <--- Nuevo parámetro
//     );

//     @Query("SELECT MAX(r.numero) FROM Reserva r")
//     Integer obtenerMaximoNumero();

//     // --- CORRECCIÓN AQUÍ ---
//     // Quitamos el "= 0" hardcodeado y pasamos el Enum como parámetro ":estado"
//     // @Query("""
//     //    SELECT r FROM Reserva r 
//     //    WHERE r.habitacion.id = :habitacionId 
//     //    AND :dia BETWEEN r.fechaDesde AND r.fechaHasta 
//     //    AND r.estado = :estado
//     // """)
//     // List<Reserva> encontrarReservasEnDia(@Param("habitacionId") Long habitacionId, @Param("dia") LocalDate dia, @Param("estado") EstadoReserva estado);

// }

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
}