package com.gestionhotelera.gestion_hotelera.repository;

import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Repository
public interface ConsumoRepository extends JpaRepository<Consumo, Long> {

    @Query("SELECT c FROM Consumo c WHERE c.estadia.id = :estadiaId AND c.facturado = false")
        List<Consumo> findPendientesByEstadiaId(@Param("estadiaId") Long estadiaId);

}