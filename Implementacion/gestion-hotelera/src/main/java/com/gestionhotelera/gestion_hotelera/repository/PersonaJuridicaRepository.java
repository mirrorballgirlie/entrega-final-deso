package com.gestionhotelera.gestion_hotelera.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;

@Repository
public interface PersonaJuridicaRepository extends JpaRepository<PersonaJuridica, Long> {

    boolean existsByCuit(String cuit);

//     @Query("""
//     SELECT pj FROM PersonaJuridica pj
//     WHERE (:razonSocial IS NULL OR UPPER(pj.nombreRazonSocial) LIKE CONCAT('%', UPPER(:razonSocial), '%'))
//     AND (:cuit IS NULL OR pj.cuit IS NOT NULL AND REPLACE(pj.cuit, '-', '') LIKE CONCAT('%', REPLACE(:cuit, '-', ''), '%'))
// """)
// List<PersonaJuridica> buscarPorFiltros(@Param("razonSocial") String razonSocial, @Param("cuit") String cuit);

//     @Query(value = """
//     SELECT * FROM persona_fisica pf
//     JOIN huesped h ON pf.huesped_id = h.id
//     WHERE (:razonSocial IS NULL OR UPPER(h.nombre || ' ' || h.apellido) LIKE '%' || UPPER(:razonSocial) || '%')
//     AND (:cuit IS NULL OR REPLACE(pf.cuit, '-', '') LIKE '%' || REPLACE(:cuit, '-', '') || '%')
// """, nativeQuery = true)
// List<PersonaFisica> buscarPorFiltros(@Param("razonSocial") String razonSocial, @Param("cuit") String cuit);

//    @Query("""
//         SELECT pj FROM PersonaJuridica pj
//         WHERE (:razonSocial IS NULL OR UPPER(pj.razonSocial) LIKE CONCAT('%', UPPER(:razonSocial), '%'))
//     """)
//     List<PersonaJuridica> buscarPorRazonSocial(@Param("razonSocial") String razonSocial);


    
}
