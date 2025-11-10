package com.gestionhotelera.gestion_hotelera.daoimp;
import com.gestionhotelera.gestion_hotelera.dao.HuespedDAO;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional

public class HuespedDAOImp implements HuespedDAO {

       @PersistenceContext
    private EntityManager em;

    @Override
    public void guardar(Huesped h) {
        em.persist(h);
    }

    @Override
    public Optional<Huesped> buscarPorId(Long id) {
        return Optional.ofNullable(em.find(Huesped.class, id));
    }

    @Override
    public Optional<Huesped> buscarPorDocumento(String tipoDoc, String numero) {
        String jpql = """
                SELECT h FROM Huesped h
                WHERE h.tipoDoc = :tipoDoc AND h.nroDoc = :numero
                """;

        List<Huesped> res = em.createQuery(jpql, Huesped.class)
                .setParameter("tipoDoc", tipoDoc)
                .setParameter("numero", numero)
                .getResultList();

        return res.stream().findFirst();
    }

    @Override
    public List<Huesped> buscarTodos() {
        return em.createQuery("SELECT h FROM Huesped h", Huesped.class).getResultList();
    }

}
