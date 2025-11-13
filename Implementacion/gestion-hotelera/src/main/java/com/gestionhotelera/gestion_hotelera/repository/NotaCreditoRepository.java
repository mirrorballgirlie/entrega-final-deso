package com.gestionhotelera.gestion_hotelera.repository;
import com.gestionhotelera.gestion_hotelera.modelo.NotaCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaCreditoRepository extends JpaRepository<NotaCredito, Long> {

}
