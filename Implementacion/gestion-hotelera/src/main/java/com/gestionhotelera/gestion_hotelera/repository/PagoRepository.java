package com.gestionhotelera.gestion_hotelera.repository;
import com.gestionhotelera.gestion_hotelera.modelo.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long>{

}
