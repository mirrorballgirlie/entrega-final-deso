package com.gestionhotelera.gestion_hotelera.gestores;
import org.springframework.beans.factory.annotation.Autowired;
import com.gestionhotelera.gestion_hotelera.repository.Estadia_HuespedRepository;

public class GestorEstadia_Huesped {

private Estadia_HuespedRepository estadiaHuespedRepository;

    public Boolean verificarHuespedPrevio(Long id) {
       return estadiaHuespedRepository.existsByHuespedId(id);
    }
}
