package com.gestionhotelera.gestion_hotelera.repository;

import com.gestionhotelera.gestion_hotelera.modelo.Consumo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface ConsumoRepository extends JpaRepository<Consumo, Long> {

    /*@Query("SELECT c FROM Consumo c WHERE c.estadia.id = :estadiaId AND c.factura IS NULL")
    List<Consumo> findPendientesByEstadiaId(@Param("estadiaId") Long estadiaId);*/

    /*@Modifying //avisa que va a hacer un update no un select
    @Transactional //la hace atomica
    @Query("UPDATE Consumo c SET c.factura.id = :facturaId WHERE c.id IN :ids")
    void marcarComoFacturados(@Param("ids") List<Long> ids, @Param("facturaId") Long facturaId);*/

}
