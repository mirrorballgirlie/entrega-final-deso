package com.gestionhotelera.gestion_hotelera.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia_Huesped;

public interface Estadia_HuespedRepository extends JpaRepository<Estadia_Huesped, Long> {
    Boolean existsByHuespedId(Long id);
}
