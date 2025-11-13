package com.gestionhotelera.gestion_hotelera.repository;

import com.gestionhotelera.gestion_hotelera.modelo.Estadia;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {


    //recordar que aca se puede llegar a implemntar alg para el cu15

    List<Estadia> findByFechaIngresoLessThanEqualAndFechaEgresoGreaterThanEqual(LocalDate hasta, LocalDate desde);
}

