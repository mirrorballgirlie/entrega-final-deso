package com.gestionhotelera.gestion_hotelera.dao;

import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import java.util.List;
import java.util.Optional;

public interface HuespedDAO {

    void guardar(Huesped h);
    Optional<Huesped> buscarPorId(Long id);
    Optional<Huesped> buscarPorDocumento(String tipoDoc, String numero);
    List<Huesped> buscarTodos();

}
