package com.gestionhotelera.gestion_hotelera.repository;
//import com.gestionhotelera.gestion_hotelera.*;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.Huesped;

@Repository
public interface HuespedRepository extends JpaRepository<Huesped, Long> {


    //busqueda realizada por tipo y numero de documento
    Optional <Huesped> findByTipoDocumentoAndDocumento(String tipoDocumento, String documento);
    
    //busqueda realizada por nombre y apellido (ya lo dejo para el CU2 buscar huesped)
    List <Huesped> findByApellidoContainingIgnoreCaseAndNombreContainingIgnoreCase(String apellido, String nombre);

    // Consulta personalizada para filtros combinados
//     @Query("""
//     SELECT h FROM Huesped h
//     WHERE (:apellido IS NULL OR LOWER(h.apellido) LIKE LOWER(CAST(CONCAT(:apellido, '%') AS string)))
//     AND (:nombre IS NULL OR LOWER(h.nombre) LIKE LOWER(CAST(CONCAT(:nombre, '%') AS string)))
//     AND (:tipoDocumento IS NULL OR h.tipoDocumento = CAST(:tipoDocumento AS string))
//     AND (:documento IS NULL OR h.documento = CAST(:documento AS string))
// """)

//     List <Huesped> buscarFiltrado(String apellido, String nombre, String tipoDocumento, String documento);

        // @Query("""
        //     SELECT h FROM Huesped h
        //     WHERE (:apellido IS NULL OR LOWER(h.apellido) LIKE LOWER(CONCAT('%', :apellido, '%')))
        //     AND (:nombre IS NULL OR LOWER(h.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
        //     AND (:tipoDocumento IS NULL OR h.tipoDocumento = :tipoDocumento)
        //     AND (:documento IS NULL OR h.documento = :documento)
        // """)
        // List<Huesped> buscarFiltrado(
        //         String apellido,
        //         String nombre,
        //         String tipoDocumento,
        //         String documento
        // );
       
        @Query("""
            SELECT h FROM Huesped h
            WHERE (:apellido IS NULL OR LOWER(h.apellido) LIKE LOWER(CONCAT(CAST(:apellido AS string), '%')))
            AND (:nombre IS NULL OR LOWER(h.nombre) LIKE LOWER(CONCAT(CAST(:nombre AS string), '%')))
            AND (:tipoDocumento IS NULL OR h.tipoDocumento = CAST(:tipoDocumento AS string))
            AND (:documento IS NULL OR h.documento = CAST(:documento AS string))
        """)
List<Huesped> buscarFiltrado(
        String apellido,
        String nombre,
        String tipoDocumento,
        String documento
);





    boolean existsByTipoDocumentoAndDocumento(String tipoDocumento, String documento);

    

    


}
