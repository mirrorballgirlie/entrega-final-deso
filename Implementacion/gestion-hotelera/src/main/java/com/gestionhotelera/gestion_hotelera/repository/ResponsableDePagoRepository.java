package com.gestionhotelera.gestion_hotelera.repository;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsableDePagoRepository extends JpaRepository<ResponsableDePago, Long> {

}
