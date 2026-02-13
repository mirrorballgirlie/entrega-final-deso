package com.gestionhotelera.gestion_hotelera.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;                                       //agregado luego del analisis de claude

@Repository
public interface ResponsableDePagoRepository extends JpaRepository<ResponsableDePago, Long> {

    Optional<ResponsableDePago> findByCuit(String cuit);        //agregado luego del analisis de claude

    // Buscar responsables por CUIT ignorando guiones
    // @Query("""
    //     SELECT r FROM ResponsableDePago r
    //     WHERE FUNCTION('REPLACE', r.cuit, '-', '') LIKE CONCAT('%', REPLACE(:cuit, '-', ''), '%')
    // """)
    // List<ResponsableDePago> buscarPorCuit(String cuit);
}


