package com.gestionhotelera.gestion_hotelera.repository;
import com.gestionhotelera.gestion_hotelera.modelo.TransferenciaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferenciaBancariaRepository extends JpaRepository<TransferenciaBancaria, Long> {

}
