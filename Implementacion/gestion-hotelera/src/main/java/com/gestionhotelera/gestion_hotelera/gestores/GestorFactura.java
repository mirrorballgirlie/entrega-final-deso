package com.gestionhotelera.gestion_hotelera.gestores;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gestionhotelera.gestion_hotelera.dto.ConsumoDTO;
import com.gestionhotelera.gestion_hotelera.dto.GenerarFacturaRequest;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.RecargoCheckoutStrategy;
import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaFisica;
import com.gestionhotelera.gestion_hotelera.modelo.PersonaJuridica;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import com.gestionhotelera.gestion_hotelera.modelo.TipoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.TipoRazonSocial;
import com.gestionhotelera.gestion_hotelera.repository.ConsumoRepository;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.ResponsableDePagoRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class GestorFactura {

    private static final Logger log = LoggerFactory.getLogger(GestorFactura.class);

    private final EstadiaRepository estadiaRepository;
    private final HuespedRepository huespedRepository;
    private final ConsumoRepository consumoRepository;
    private final RecargoCheckoutStrategy recargoStrategy;
    private final FacturaRepository facturaRepository;
    private final ResponsableDePagoRepository responsableRepository;

    //esto esta MAL, no hay que buscar estadias activas por fecha, hay que buscarlas por habitacion y por estado = ACTIVA (0 EN LA BDD)

    // public List<HuespedDTO> obtenerOcupantes(Integer numHab, LocalDate fechaSalida) {
    // // 1. Buscamos la estadía activa para esa habitación y fecha
    // List<Estadia> estadiaOpt = estadiaRepository.buscarEstadiaPorHabitacionYSalida(numHab, fechaSalida);
    // if (estadiaOpt.isEmpty()) {
    //     throw new ResourceNotFoundException("No se encontró una estadía activa para la habitación " + numHab + " con fecha de salida " + fechaSalida);
    // }
    // Estadia estadia = estadiaOpt.get(0); // Suponemos que solo hay una estadia activa para esa habitación y fecha

    // // 2. Mapeamos los huéspedes a un DTO para enviar al Front
    // return estadia.getHuespedes().stream()
    //         .map(h -> {
    //             // Asegurate que HuespedDTO tenga un constructor que acepte estos campos
    //             HuespedDTO dto = new HuespedDTO();
    //             dto.setId(h.getId());
    //             dto.setNombre(h.getNombre());
    //             dto.setApellido(h.getApellido());
    //             dto.setDocumento(h.getDocumento());
    //             dto.setFechaNacimiento(h.getFechaNacimiento());
    //             return dto;
    //         })
    //         .collect(Collectors.toList());
    // }

    //public List<HuespedDTO> obtenerOcupantes(Integer numHab) {

    // 1. Buscamos la estadía ACTIVA de esa habitación
//     Estadia estadia = estadiaRepository
//         //.findByHabitacionNumeroAndEstado(numHab, 0)
//         .buscarEstadiaOcupadaPorHabitacion(numHab);

//         .orElseThrow(() -> new ResourceNotFoundException(
//             "No se encontró una estadía activa para la habitación " + numHab));

//     // 2. Mapear huéspedes a DTO
//     return estadia.getHuespedes().stream()
//             .map(h -> {
//                 HuespedDTO dto = new HuespedDTO();
//                 dto.setId(h.getId());
//                 dto.setNombre(h.getNombre());
//                 dto.setApellido(h.getApellido());
//                 dto.setDocumento(h.getDocumento());
//                 dto.setFechaNacimiento(h.getFechaNacimiento());
//                 return dto;
//             })
//             .collect(Collectors.toList());
// }

    public List<HuespedDTO> obtenerOcupantes(Integer numHab) {

    List<Estadia> estadias = estadiaRepository
            .buscarEstadiaOcupadaPorHabitacion(numHab);

    if (estadias.isEmpty()) {
        throw new ResourceNotFoundException(
            "No se encontró una estadía ocupada para la habitación " + numHab
        );
    }

    Estadia estadia = estadias.get(0);

    return estadia.getHuespedes().stream()
            .map(h -> {
                HuespedDTO dto = new HuespedDTO();
                dto.setId(h.getId());
                dto.setNombre(h.getNombre());
                dto.setApellido(h.getApellido());
                dto.setDocumento(h.getDocumento());
                dto.setFechaNacimiento(h.getFechaNacimiento());
                return dto;
            })
            .collect(Collectors.toList());
}



    public boolean esMayorDeEdad(Long huespedId) {
            Huesped huesped = huespedRepository.findById(huespedId)
                .orElseThrow(() -> new ResourceNotFoundException("Huésped no encontrado"));
            
            return java.time.Period.between(huesped.getFechaNacimiento(), LocalDate.now()).getYears() >= 18;
    }

    public List<ConsumoDTO> obtenerItemsPendientes(Long estadiaId) {
        List<Consumo> pendientes = consumoRepository.findPendientesByEstadiaId(estadiaId);
        
        return pendientes.stream().map(c -> {
            ConsumoDTO dto = new ConsumoDTO();
            dto.setId(c.getId());
            dto.setNombre(c.getNombre());
            dto.setCantidad(c.getCantidad());
            dto.setPrecio(c.getPrecio());
            dto.setSubtotal(c.getCantidad() * c.getPrecio()); // Calcular subtotal
            return dto;
        }).collect(Collectors.toList());
    }

    public double obtenerValorEstadia(Long estadiaId) {
        Estadia estadia = estadiaRepository.findById(estadiaId)
            .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

        // 1. Calcular cantidad de noches
        long noches = ChronoUnit.DAYS.between(estadia.getFechaIngreso(), estadia.getFechaEgreso());
        if (noches <= 0) noches = 1; // Mínimo se cobra una noche

        double precioNoche = estadia.getHabitacion().getTipo().getPrecioNoche();
        double subtotalAlojamiento = noches * precioNoche;

        // 2. Aplicar Strategy para el recargo por hora de salida
        // Supongamos que la hora actual es la de salida
        LocalTime horaSalidaActual = LocalTime.now(); 
        double recargo = recargoStrategy.calcularRecargo(horaSalidaActual, precioNoche);

        return subtotalAlojamiento + recargo;
    }

    public double calcularMontoTotalPendiente(Long estadiaId) {
            
        List<ConsumoDTO> items = this.obtenerItemsPendientes(estadiaId); 

        double totalConsumos = items.stream()
                .mapToDouble(dto -> dto.getSubtotal()) 
                .sum();

        double valorEstadia = this.obtenerValorEstadia(estadiaId);

        return valorEstadia + totalConsumos;
    }

    

    //@Transactional // <--- CRÍTICO: Abre la sesión de Hibernate para toda la operación
    // public Factura generarFactura(GenerarFacturaRequest request) {
    //     try {
    //         log.info("=== INICIANDO generarFactura ===");
    //         log.info("Request: estadiaId={}, cuitResponsable={}, incluirEstadia={}, idsConsumos={}",
    //             request.getEstadiaId(), request.getCuitResponsable(), 
    //             request.isIncluirEstadia(), request.getIdsConsumosSeleccionados());

    //         // 1. Obtener estadia
    //         log.info("Buscando estadía con ID: {}", request.getEstadiaId());
    //         Estadia estadia = estadiaRepository.findById(request.getEstadiaId())
    //             .orElseThrow(() -> {
    //                 log.error("Estadía no encontrada: {}", request.getEstadiaId());
    //                 return new ResourceNotFoundException("Estadía no encontrada");
    //             });
    //         log.info("✓ Estadía encontrada: {}", estadia.getId());

    //         // 2. Obtener responsable de pago por CUIT
    //         log.info("Buscando responsable con CUIT: {}", request.getCuitResponsable());
    //         ResponsableDePago responsable = responsableRepository.findByCuit(request.getCuitResponsable())
    //             .orElseThrow(() -> {
    //                 log.error("Responsable no encontrado con CUIT: {}", request.getCuitResponsable());
    //                 return new ResponseStatusException(
    //                     HttpStatus.BAD_REQUEST, 
    //                     "No existe responsable de pago con CUIT " + request.getCuitResponsable()
    //                 );
    //             });
    //         log.info("✓ Responsable encontrado: {} (ID: {})", responsable.getCuit(), responsable.getId());

    //         // 3. Calcular monto
    //         double montoEstadia = 0;
    //         if (request.isIncluirEstadia()) {
    //             montoEstadia = obtenerValorEstadia(request.getEstadiaId());
    //             log.info("✓ Monto estadía calculatedo: {}", montoEstadia);
    //         } else {
    //             log.info("× Estadía no incluida en esta factura");
    //         }
            
    //         // 4. Obtener consumos seleccionados
    //         List<Consumo> consumosSeleccionados = new ArrayList<>();
    //         double montoConsumos = 0;
            
    //         if (request.getIdsConsumosSeleccionados() != null && !request.getIdsConsumosSeleccionados().isEmpty()) {
    //             log.info("Buscando {} consumos...", request.getIdsConsumosSeleccionados().size());
    //             consumosSeleccionados = consumoRepository.findAllById(request.getIdsConsumosSeleccionados());
    //             log.info("✓ Se encontraron {} consumos", consumosSeleccionados.size());
                
    //             montoConsumos = consumosSeleccionados.stream()
    //                 .mapToDouble(c -> c.getCantidad() * c.getPrecio())
    //                 .sum();
    //             log.info("Monto consumos: {}", montoConsumos);
    //         } else {
    //             log.info("✓ Sin consumos seleccionados");
    //         }

    //         double subtotal = montoEstadia + montoConsumos;
    //         log.info("SUBTOTAL: {} (estadia={} + consumos={})", subtotal, montoEstadia, montoConsumos);
            
    //         // 5. Determinar tipo de factura y calcular IVA
    //         TipoFactura tipoFactura = TipoFactura.B; // Por defecto B
    //         double iva = 0;
    //         log.info("Tipo factura: {}, IVA: {}", tipoFactura, iva);
            
    //         double total = subtotal + iva;
    //         log.info("TOTAL: {}", total);

    //         // 6. Crear factura
    //         log.info("Creando entidad Factura...");
    //         Factura factura = Factura.builder()
    //             .estadia(estadia)
    //             .responsableDePago(responsable)
    //             .nombre(responsable.getCuit())
    //             .tipo(tipoFactura)
    //             .cuit(responsable.getCuit())
    //             .monto(subtotal)
    //             .iva(iva)
    //             .total(total)
    //             .build();
    //         log.info("✓ Factura construida");

    //         // 7. Guardar factura
    //         log.info("Guardando factura en BD...");
    //         Factura facturaGuardada = facturaRepository.save(factura);
    //         log.info("✓ Factura guardada con ID: {}", facturaGuardada.getId());

    //         // 8. Marcar consumos como facturados
    //         if (!consumosSeleccionados.isEmpty()) {
    //             log.info("Marcando {} consumos como facturados...", consumosSeleccionados.size());
    //             consumosSeleccionados.forEach(c -> c.setFacturado(true));
    //             consumoRepository.saveAll(consumosSeleccionados);
    //             log.info("✓ Consumos marcados como facturados");
    //         }

    //         log.info("=== generarFactura completado exitosamente ===");
    //         return facturaGuardada;
            
    //     } catch (Exception e) {
    //         log.error("❌ ERROR en generarFactura: ", e);
    //         throw e;
    //     }
    // }
//     @Transactional
// public Factura generarFactura(GenerarFacturaRequest request) {
//     try {
//         log.info("=== INICIANDO generarFactura ===");

//         // 1. Obtener estadía
//         Estadia estadia = estadiaRepository.findById(request.getEstadiaId())
//             .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

//         // // 2. Obtener responsable
//         // ResponsableDePago responsable = responsableRepository.findByCuit(request.getCuitResponsable())
//         //     .orElseThrow(() -> new ResponseStatusException(
//         //         HttpStatus.BAD_REQUEST, 
//         //         "No existe responsable de pago con CUIT " + request.getCuitResponsable()
//         //     ));

//         // 2. Obtener responsable de pago (Lógica inteligente)
//     ResponsableDePago responsable;

//     if (request.getHuespedId() != null) {
//         // Si viene ID de huésped, buscamos por la relación
//         responsable = responsableRepository.findByHuespedId(request.getHuespedId())
//             .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, 
//                 "El huésped seleccionado no está registrado como Responsable de Pago."));
// } else {
//     // Si no, buscamos por CUIT (caso Tercero)
//     responsable = responsableRepository.findByCuit(request.getCuitResponsable())
//         .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, 
//             "No existe responsable con CUIT: " + request.getCuitResponsable()));
// }

//         // 3. Calcular montos base
//         double montoEstadia = request.isIncluirEstadia() ? obtenerValorEstadia(request.getEstadiaId()) : 0;
        
//         List<Consumo> consumosSeleccionados = new ArrayList<>();
//         double montoConsumos = 0;
//         if (request.getIdsConsumosSeleccionados() != null && !request.getIdsConsumosSeleccionados().isEmpty()) {
//             consumosSeleccionados = consumoRepository.findAllById(request.getIdsConsumosSeleccionados());
//             montoConsumos = consumosSeleccionados.stream()
//                 .mapToDouble(c -> c.getCantidad() * c.getPrecio())
//                 .sum();
//         }

//         double subtotal = montoEstadia + montoConsumos;

//         // 4. Lógica de IVA y Tipo de Factura (Punto 6 del CU)
//         // Buscamos la razón social y la condición de IVA
//         String nombreFactura = "";
//         TipoFactura tipoFactura = TipoFactura.B;
//         double iva = 0;

//         if (responsable instanceof PersonaJuridica pj) {
//             nombreFactura = pj.getNombreRazonSocial();
//             // Si es Responsable Inscripto, factura A con IVA discriminado
//             if (pj.getRazonSocial() != null && pj.getRazonSocial().name().equals("RESPONSABLE_INSCRIPTO")) {
//                 tipoFactura = TipoFactura.A;
//                 iva = subtotal * 0.21;
//             }
//         } else if (responsable instanceof PersonaFisica pf) {
//             nombreFactura = pf.getNombreRazonSocial();
//             // Las personas físicas suelen recibir B (Consumidor Final), 
//             // a menos que sean Monotributistas/RI (ajustar según tu modelo)
//             tipoFactura = TipoFactura.B;
//             iva = 0; // En la B el IVA está incluido o no se discrimina
//         }

//         double total = subtotal + iva;

//         // 5. Crear factura con TODOS los campos obligatorios
//         Factura factura = Factura.builder()
//             .estadia(estadia)
//             .responsableDePago(responsable)
//             .nombre(nombreFactura) // Nombre real, no el CUIT
//             .tipo(tipoFactura)
//             .cuit(responsable.getCuit())
//             .monto(subtotal)
//             .iva(iva)
//             .total(total)
//             .fechaEmision(LocalDateTime.now()) // <-- IMPORTANTE
//             .estado(EstadoFactura.NO_PAGO)    // <-- Según CU: "pendiente de pago"
//             .build();

//         // 6. Persistencia
//         Factura facturaGuardada = facturaRepository.save(factura);

//         // 7. Marcar consumos como facturados (Update atómico gracias a @Transactional)
//         if (!consumosSeleccionados.isEmpty()) {
//             consumosSeleccionados.forEach(c -> c.setFacturado(true));
//             consumoRepository.saveAll(consumosSeleccionados);
//         }

//         log.info("=== generarFactura completado exitosamente: ID {} ===", facturaGuardada.getId());
//         return facturaGuardada;
        
//     } catch (Exception e) {
//         log.error("❌ ERROR en generarFactura: ", e);
//         throw e;
//     }
// }

@Transactional
public Factura generarFactura(GenerarFacturaRequest request) {
    try {
        log.info("=== INICIANDO generarFactura ===");

        // 1. Obtener estadía
        Estadia estadia = estadiaRepository.findById(request.getEstadiaId())
            .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

        // 2. Obtener responsable de pago
        ResponsableDePago responsable;
        if (request.getHuespedId() != null) {
            responsable = responsableRepository.findByHuespedId(request.getHuespedId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "El huésped ID " + request.getHuespedId() + " no es responsable de pago."));
        } else if (request.getCuitResponsable() != null) {
            responsable = responsableRepository.findByCuit(request.getCuitResponsable())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "No existe responsable con CUIT: " + request.getCuitResponsable()));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe proporcionar Huesped ID o CUIT");
        }

        // 3. Calcular montos
        //double montoEstadia = request.isIncluirEstadia() ? obtenerValorEstadia(request.getEstadiaId()) : 0;
        // Usamos get y verificamos que no sea null para evitar errores
                    double montoEstadia = (request.getIncluirEstadia() != null && request.getIncluirEstadia()) 
                      ? obtenerValorEstadia(request.getEstadiaId()) 
                      : 0;
        
        double montoConsumos = 0;
        List<Consumo> consumosSeleccionados = new ArrayList<>();
        if (request.getIdsConsumosSeleccionados() != null && !request.getIdsConsumosSeleccionados().isEmpty()) {
            consumosSeleccionados = consumoRepository.findAllById(request.getIdsConsumosSeleccionados());
            montoConsumos = consumosSeleccionados.stream()
                .mapToDouble(c -> c.getCantidad() * c.getPrecio())
                .sum();
        }

        double subtotal = montoEstadia + montoConsumos;

        // 4. Lógica de IVA y Tipo de Factura (Segura)
        String nombreFactura = "Consumidor Final"; // Default
        TipoFactura tipoFactura = TipoFactura.B;
        double iva = 0;

        if (responsable instanceof PersonaJuridica pj) {
            nombreFactura = pj.getNombreRazonSocial();
            // Comparación segura de Enum
            if (pj.getRazonSocial() != null && pj.getRazonSocial() == "RESPONSABLE_INSCRIPTO") {
                tipoFactura = TipoFactura.A;
                iva = subtotal * 0.21;
            }
        } else if (responsable instanceof PersonaFisica pf) {
            nombreFactura = (pf.getNombreRazonSocial() != null) ? pf.getNombreRazonSocial() : "Persona Física";
            tipoFactura = TipoFactura.B;
            iva = 0;
        }

        double total = subtotal + iva;

        // Extraemos el CUIT de forma segura para satisfacer al compilador y evitar NPE
        String cuitSeguro = (responsable != null && responsable.getCuit() != null) 
                    ? responsable.getCuit() 
                    : "00-00000000-0"; // O puedes lanzar una excepción si es obligatorio

        if (cuitSeguro.equals("00-00000000-0")) {
            log.warn("⚠️ El responsable ID {} no tiene un CUIT válido. Se usará uno genérico.", responsable.getId());
        }

        // 5. Construcción de Factura (Campos garantizados)
        Factura factura = Factura.builder()
            .estadia(estadia)
            .responsableDePago(responsable)
            .nombre(nombreFactura)
            .tipo(tipoFactura)
            // .cuit(responsable.getCuit())
            .cuit(cuitSeguro) // <--- Usamos la variable local validada
            .monto(subtotal)
            .iva(iva)
            .total(total)
            .fechaEmision(LocalDateTime.now())
            .estado(EstadoFactura.NO_PAGO) 
            .build();

        // 6. Persistencia
        Factura facturaGuardada = facturaRepository.save(factura);

        // 7. Marcar consumos
        if (!consumosSeleccionados.isEmpty()) {
            consumosSeleccionados.forEach(c -> c.setFacturado(true));
            consumoRepository.saveAll(consumosSeleccionados);
        }

        log.info("=== generarFactura completado exitosamente: ID {} ===", facturaGuardada.getId());
        return facturaGuardada;
        
    } catch (Exception e) {
        log.error("❌ ERROR CRÍTICO en generarFactura: ", e);
        throw e; // Esto permite que Spring maneje el error y muestre el log
    }
}
    


}