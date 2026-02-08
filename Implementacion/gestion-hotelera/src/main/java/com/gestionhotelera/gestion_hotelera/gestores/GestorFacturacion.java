/*

package com.gestionhotelera.gestion_hotelera.gestores;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.modelo.*;
import com.gestionhotelera.gestion_hotelera.repository.*;
import com.gestionhotelera.gestion_hotelera.exception.*;

@Service
public class GestorFacturacion {

    @Autowired
    private GestorPersona gestorPersona; 
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    @Autowired
    private EstadiaRepository estadiaRepository;

    // Record para recibir la petición del frontend
    public record FacturacionRequest(
        Long estadiaId,
        Long responsableId,
        String tipoFactura
    ) {}

    @Transactional
    public Factura generarFactura(FacturacionRequest req) {
        // 1. Buscar la estadía activa
        Estadia estadia = estadiaRepository.findById(req.estadiaId())
            .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

        // 2. Validar edad del responsable
        validarEdadResponsable(req.responsableId());

        // 3. Crear el objeto Factura con IVA
        double neto = estadia.calcularTotal();
        double iva = neto * 0.21;

        Factura nuevaFactura = new Factura();
        nuevaFactura.setTotal(neto + iva);
        nuevaFactura.setTipo(req.tipoFactura());
        nuevaFactura.setFechaEmision(LocalDateTime.now());
        nuevaFactura.setEstadia(estadia);

        // 4. Liberar la habitación: de OCUPADA a DISPONIBLE
        estadia.getHabitacion().setEstado("DISPONIBLE");

        return facturaRepository.save(nuevaFactura);
    }

    public List<Persona> buscarResponsables(String query) {
        // Aquí llamas al método que ya existe en el otro gestor
        return gestorPersona.buscarPorCriterios(query);
    }

    private void validarEdadResponsable(Long responsableId) {
        Persona responsable = gestorPersona.buscarPorId(responsableId);
        // Regla de negocio: No se puede facturar a menores
        if (responsable.getEdad() < 18) {
            throw new BadRequestException("La persona seleccionada es menor de edad. Por favor elija otra.");
        }
    }

    // Para el CU 03: Alta de responsable si no existe
    @Transactional
    public Persona darAltaResponsableRapida(Persona nuevaPersona) {
        // Requisito del hotel: Todo en MAYÚSCULAS
        nuevaPersona.setNombre(nuevaPersona.getNombre().toUpperCase());
        nuevaPersona.setApellido(nuevaPersona.getApellido().toUpperCase());
        return gestorPersona.guardar(nuevaPersona);
    }
}

*/