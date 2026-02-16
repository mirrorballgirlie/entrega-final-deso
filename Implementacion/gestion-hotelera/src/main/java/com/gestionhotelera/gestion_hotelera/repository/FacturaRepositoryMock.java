package com.gestionhotelera.gestion_hotelera.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;
import org.springframework.stereotype.Repository;

import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import com.gestionhotelera.gestion_hotelera.modelo.TipoRazonSocial;

@Primary
// TODO: COMENTAR EL PRIMARY CUANDO SE PRUEBE CON LA BDD REAL. YO LO TENGO ASI PORQUE SE ME MURIO POSTGRE JAJA
@Repository
public class FacturaRepositoryMock implements FacturaRepository {

    private final List<Factura> baseDeDatosFicticia = new ArrayList<>();

    public FacturaRepositoryMock() {
        // --- CARGA DE DATOS EXTENSA (CU09 y CU13) ---

        // 1. MARIA PEREZ - DNI
        Huesped h1 = createHuesped(1L, "MARIA", "PEREZ", "DNI", "33.444.555");
        PersonaFisica pf1 = createPersonaFisica(1L, "27-33444555-2", "MARIA PEREZ", "123456", h1);
        
        // 2. JUAN LOPEZ - PASAPORTE
        Huesped h2 = createHuesped(2L, "JUAN", "LOPEZ", "PASAPORTE", "ARG123456");
        PersonaFisica pf2 = createPersonaFisica(2L, "20-12345678-9", "JUAN LOPEZ", "4556677", h2);

        // 3. CARLOS GARCIA - LE (Libreta de Enrolamiento)
        Huesped h3 = createHuesped(3L, "CARLOS", "GARCIA", "LE", "8.123.456");
        PersonaFisica pf3 = createPersonaFisica(3L, "20-08123456-2", "CARLOS GARCIA", "4889900", h3);

        // 4. ANA MARTINEZ - LC (Libreta Cívica)
        Huesped h4 = createHuesped(4L, "ANA", "MARTINEZ", "LC", "5.999.888");
        PersonaFisica pf4 = createPersonaFisica(4L, "27-05999888-3", "ANA MARTINEZ", "4112233", h4);

        // 5. HOTEL S.A. - Persona Jurídica (CU13)
        PersonaJuridica pj = new PersonaJuridica();
        pj.setId(5L);
        pj.setCuit("30123456789");
        pj.setNombreRazonSocial("HOTEL S.A.");
        pj.setTelefono("444555");
        pj.setRazonSocial(TipoRazonSocial.RESPONSABLE_INSCRIPTO);

        // Agregar facturas iniciales con estado PAGADO para que el buscador las encuentre
        baseDeDatosFicticia.add(createFactura(101L, "FAC-001", pf1.getCuit(), 1000.0, pf1));
        baseDeDatosFicticia.add(createFactura(102L, "FAC-002", pf2.getCuit(), 2500.0, pf2));
        baseDeDatosFicticia.add(createFactura(103L, "FAC-003", pf3.getCuit(), 1500.0, pf3));
        baseDeDatosFicticia.add(createFactura(104L, "FAC-004", pf4.getCuit(), 3000.0, pf4));
        baseDeDatosFicticia.add(createFactura(105L, "FAC-005", pj.getCuit(), 5000.0, pj));

        // 6. Otra factura para MARIA PEREZ (Ya tenía la 101)
        // Sirve para probar la suma de montos en Persona Física
        baseDeDatosFicticia.add(createFactura(106L, "FAC-006", pf1.getCuit(), 3000.0, pf1));

        // 7. Otra factura para HOTEL S.A. (Ya tenía la 105)
        // Ideal para probar anulaciones masivas de empresas
        baseDeDatosFicticia.add(createFactura(107L, "FAC-007", pj.getCuit(), 15000.0, pj));

        // 8. Una factura extra para CARLOS GARCIA (Ya tenía la 103)
        // Para probar multiselección con documentos tipo LE
        baseDeDatosFicticia.add(createFactura(108L, "FAC-008", pf3.getCuit(), 2200.0, pf3));
    }

    // --- MÉTODOS DE BÚSQUEDA ROBUSTA ---

    @Override
    public List<Factura> findByCuitRobust(String cuitNormalizado, EstadoFactura estado) {
        return baseDeDatosFicticia.stream()
                .filter(f -> f.getEstado() == estado)
                .filter(f -> f.getCuit() != null && f.getCuit().replaceAll("[^a-zA-Z0-9]", "").equals(cuitNormalizado))
                .collect(Collectors.toList());
    }

    @Override
    public List<Factura> findByDocRobust(String tipoDoc, String nroDocNormalizado, EstadoFactura estado) {
        return baseDeDatosFicticia.stream()
                .filter(f -> f.getEstado() == estado)
                .filter(f -> {
                    ResponsableDePago resp = f.getResponsableDePago();
                    if (resp instanceof PersonaFisica pf && pf.getHuesped() != null) {
                        Huesped h = pf.getHuesped();
                        boolean mismoTipo = h.getTipoDocumento() != null && h.getTipoDocumento().equalsIgnoreCase(tipoDoc);
                        String docLimpio = h.getDocumento() != null ? h.getDocumento().replaceAll("[^a-zA-Z0-9]", "") : "";
                        return mismoTipo && docLimpio.equals(nroDocNormalizado);
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Factura> findFacturasPendientesByNroHabitacionyEstado(Integer nro, EstadoFactura est) {
        return baseDeDatosFicticia.stream().filter(f -> f.getEstado() == est).collect(Collectors.toList());
    }

    // --- IMPLEMENTACIÓN JPA ---
    @Override public <S extends Factura> S save(S entity) { baseDeDatosFicticia.add(entity); return entity; }
    @Override public Optional<Factura> findById(Long id) { return baseDeDatosFicticia.stream().filter(f -> f.getId().equals(id)).findFirst(); }
    @Override public List<Factura> findAll() { return baseDeDatosFicticia; }
    @Override public long count() { return baseDeDatosFicticia.size(); }
    @Override public boolean existsById(Long id) { return baseDeDatosFicticia.stream().anyMatch(f -> f.getId().equals(id)); }
    @Override public List<Factura> findAllById(Iterable<Long> ids) {
        List<Long> targetIds = new ArrayList<>(); ids.forEach(targetIds::add);
        return baseDeDatosFicticia.stream().filter(f -> targetIds.contains(f.getId())).collect(Collectors.toList());
    }

    // --- STUBS ---
    @Override public List<Factura> findAll(Sort sort) { return baseDeDatosFicticia; }
    @Override public Page<Factura> findAll(Pageable pageable) { return new PageImpl<>(baseDeDatosFicticia); }
    @Override public void deleteById(Long id) { baseDeDatosFicticia.removeIf(f -> f.getId().equals(id)); }
    @Override public void delete(Factura entity) { baseDeDatosFicticia.remove(entity); }
    @Override public void deleteAllById(Iterable<? extends Long> ids) {}
    @Override public void deleteAll(Iterable<? extends Factura> entities) {}
    @Override public void deleteAll() { baseDeDatosFicticia.clear(); }
    @Override public void flush() {}
    @Override public <S extends Factura> S saveAndFlush(S entity) { return save(entity); }
    @Override public <S extends Factura> List<S> saveAll(Iterable<S> entities) { entities.forEach(this::save); return (List<S>) baseDeDatosFicticia; }
    @Override public void deleteInBatch(Iterable<Factura> entities) {}
    @Override public void deleteAllInBatch(Iterable<Factura> entities) {}
    @Override public void deleteAllByIdInBatch(Iterable<Long> ids) {}
    @Override public void deleteAllInBatch() {}
    @Override public Factura getOne(Long id) { return findById(id).orElse(null); }
    @Override public Factura getById(Long id) { return findById(id).orElse(null); }
    @Override public Factura getReferenceById(Long id) { return findById(id).orElse(null); }
    @Override public <S extends Factura> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
    @Override public <S extends Factura> List<S> findAll(Example<S> example) { return new ArrayList<>(); }
    @Override public <S extends Factura> List<S> findAll(Example<S> example, Sort sort) { return new ArrayList<>(); }
    @Override public <S extends Factura> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
    @Override public <S extends Factura> long count(Example<S> example) { return 0; }
    @Override public <S extends Factura> boolean exists(Example<S> example) { return false; }
    @Override public <S extends Factura, R> R findBy(Example<S> example, Function<FetchableFluentQuery<S>, R> queryFunction) { return null; }
    @Override public <S extends Factura> List<S> saveAllAndFlush(Iterable<S> entities) { return saveAll(entities); }

    // --- MÉTODOS AUXILIARES (PÉGALOS AQUÍ) ---

    private Huesped createHuesped(Long id, String nom, String ape, String tipo, String doc) {
        Huesped h = new Huesped();
        h.setId(id); h.setNombre(nom); h.setApellido(ape); h.setTipoDocumento(tipo); h.setDocumento(doc);
        return h;
    }

    private PersonaFisica createPersonaFisica(Long id, String cuit, String nom, String tel, Huesped h) {
        PersonaFisica pf = new PersonaFisica();
        pf.setId(id); pf.setCuit(cuit); pf.setNombreRazonSocial(nom); pf.setTelefono(tel); pf.setHuesped(h);
        return pf;
    }

    private Factura createFactura(Long id, String nro, String cuit, Double monto, ResponsableDePago resp) {
        return Factura.builder()
                .id(id).nombre(nro).cuit(cuit).monto(monto).iva(monto * 0.21).total(monto * 1.21)
                .estado(EstadoFactura.PAGADO).fechaEmision(LocalDateTime.now()).responsableDePago(resp)
                .estadia(Estadia.builder().id(id).consumos(new ArrayList<>()).build())
                .build();
    }
}