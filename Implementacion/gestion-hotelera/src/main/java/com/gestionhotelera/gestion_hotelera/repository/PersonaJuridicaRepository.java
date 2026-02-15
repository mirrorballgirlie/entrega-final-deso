package com.gestionhotelera.gestion_hotelera.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;

import java.util.List;

@Repository
public interface PersonaJuridicaRepository extends JpaRepository<PersonaJuridica, Long> {

    @Query("SELECT p FROM PersonaJuridica p WHERE " +
            "(:nombre IS NULL OR :nombre = '' OR UPPER(p.nombreRazonSocial) LIKE UPPER(CONCAT('%', :nombre, '%'))) AND " +
            "(:cuit IS NULL OR :cuit = '' OR p.cuit LIKE CONCAT('%', :cuit, '%'))")

    List<PersonaJuridica> buscarPorNombreRazonSocialYCuit(@Param("nombre") String nombre, @Param("cuit") String cuit);
    boolean existsByCuit(String cuit);

}
