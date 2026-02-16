package com.gestionhotelera.gestion_hotelera.gestores;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.BusquedaFacturaRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.CrearNotaCreditoRequestDTO;
import com.gestionhotelera.gestion_hotelera.dto.FacturaPendienteResponseDTO;
import com.gestionhotelera.gestion_hotelera.dto.NotaCreditoDetalleResponseDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.modelo.NotaCredito;
import com.gestionhotelera.gestion_hotelera.repository.ConsumoRepository;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import com.gestionhotelera.gestion_hotelera.repository.NotaCreditoRepository;

import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class GestorNotaCredito {
//     private static final Logger log = LoggerFactory.getLogger(GestorNotaCredito.class);
    
//     private final FacturaRepository facturaRepository;
//     private final ConsumoRepository consumoRepository;

//     public List<FacturaPendienteResponseDTO> buscarFacturasParaNC(BusquedaFacturaRequestDTO filtros) {
//         log.info("Iniciando búsqueda robusta de facturas para NC");
//         List<Factura> resultados;
        
//         // El CU pide facturas que puedan ser anuladas (usualmente las PAGADAS o NO_PAGO)
//         // Ajustamos según tu lógica contable
//         EstadoFactura estadoBuscado = EstadoFactura.PAGADO; 

//         if (filtros.getCuit() != null && !filtros.getCuit().isBlank()) {
//             // Normalización para búsqueda "Google": quitamos todo lo que no sea letra o número
//             String cleanCuit = filtros.getCuit().replaceAll("[^a-zA-Z0-9]", "");
//             resultados = facturaRepository.findByCuitRobust(cleanCuit, estadoBuscado);
//         } else {
//             String cleanDoc = filtros.getNroDoc().replaceAll("[^a-zA-Z0-9]", "");
//             resultados = facturaRepository.findByDocRobust(filtros.getTipoDoc(), cleanDoc, estadoBuscado);
//         }

//         return resultados.stream().map(f -> FacturaPendienteResponseDTO.builder()
//                 .id(f.getId())
//                 .nroFactura(f.getNombre())
//                 .fecha(f.getFechaEmision().toLocalDate())
//                 .importeNeto(BigDecimal.valueOf(f.getMonto()))
//                 .iva(BigDecimal.valueOf(f.getIva()))
//                 .importeTotal(BigDecimal.valueOf(f.getTotal()))
//                 .build()).collect(Collectors.toList());
//     }

//     @Transactional
//     public NotaCreditoDetalleResponseDTO procesarNotaCredito(CrearNotaCreditoRequestDTO request) {
//         log.info("Generando Nota de Crédito para {} facturas", request.getFacturaIds().size());
        
//         List<Factura> facturas = facturaRepository.findAllById(request.getFacturaIds());
        
//         // PASO 9: Lógica de anulación y reactivación de deuda
//         for (Factura f : facturas) {
//             f.setEstado(EstadoFactura.ANULADA);
            
//             // Reactivamos los consumos para que vuelvan a estar "pendientes de pago"
//             // Esto es lo que pide el CU: "vuelve a dejar la deuda asociada como pendiente"
//             if (f.getEstadia() != null) {
//                 List<Consumo> consumos = f.getEstadia().getConsumos();
//                 consumos.forEach(c -> c.setFacturado(false));
//                 consumoRepository.saveAll(consumos);
//             }
//         }
        
//         facturaRepository.saveAll(facturas);
        
//         // Aquí construirías el DTO de respuesta para el Step 3 del Front
//         return NotaCreditoDetalleResponseDTO.builder()
//                 .nroNotaCredito("NC-19-" + System.currentTimeMillis() % 10000)
//                 .importeTotal(BigDecimal.valueOf(facturas.stream().mapToDouble(Factura::getTotal).sum()))
//                 .fechaEmision(LocalDate.now())
//                 .build();
//     }
// }

@Service
@RequiredArgsConstructor
public class GestorNotaCredito {
    private static final Logger log = LoggerFactory.getLogger(GestorNotaCredito.class);
    
    private final FacturaRepository facturaRepository;
    private final ConsumoRepository consumoRepository;
    private final NotaCreditoRepository notaCreditoRepository; // Agregado para persistir

    public List<FacturaPendienteResponseDTO> buscarFacturasParaNC(BusquedaFacturaRequestDTO filtros) {
        log.info("Buscando facturas para NC - Filtros: {}", filtros);
        List<Factura> resultados;
        
        // El CU pide facturas "pendientes de pago" (Precondición)
        // Usamos PAGADO porque son las que se pueden anular para revertir
        EstadoFactura estadoBuscado = EstadoFactura.PAGADO; 

        // if (filtros.getCuit() != null && !filtros.getCuit().isBlank()) {
        //     String cleanCuit = filtros.getCuit().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        //     resultados = facturaRepository.findByCuitRobust(cleanCuit, estadoBuscado);
        // } else {
        //     String cleanDoc = filtros.getNroDoc().replaceAll("[^a-zA-Z0-9]", "");
        //     resultados = facturaRepository.findByDocRobust(filtros.getTipoDoc(), cleanDoc, estadoBuscado);
        // }
        if (filtros.getCuit() != null && !filtros.getCuit().isBlank()) {
            // 1. Limpiamos y pasamos a MAYÚSCULAS el CUIT
            String cleanCuit = filtros.getCuit().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
            resultados = facturaRepository.findByCuitRobust(cleanCuit, estadoBuscado);
        } else {
            // 2. Limpiamos y pasamos a MAYÚSCULAS el Nro de Doc y el Tipo
            String cleanDoc = filtros.getNroDoc().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
            String tipoDoc = filtros.getTipoDoc().toUpperCase(); // Normalizamos también el tipo (dni -> DNI)
            
            resultados = facturaRepository.findByDocRobust(tipoDoc, cleanDoc, estadoBuscado);
        }

        return resultados.stream().map(f -> FacturaPendienteResponseDTO.builder()
                .id(f.getId())
                .nroFactura(f.getNombre())
                .fecha(f.getFechaEmision().toLocalDate())
                .importeNeto(BigDecimal.valueOf(f.getMonto()))
                .iva(BigDecimal.valueOf(f.getIva()))
                .importeTotal(BigDecimal.valueOf(f.getTotal()))
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public NotaCreditoDetalleResponseDTO procesarNotaCredito(CrearNotaCreditoRequestDTO request) {
        log.info("Iniciando Paso 7: Generar NC para IDs: {}", request.getFacturaIds());
        
        List<Factura> facturas = facturaRepository.findAllById(request.getFacturaIds());
        if (facturas.isEmpty()) throw new RuntimeException("No se seleccionaron facturas válidas.");

        // 1. Calcular totales reales para la Entidad NotaCredito
        double totalNeto = facturas.stream().mapToDouble(Factura::getMonto).sum();
        double totalIva = facturas.stream().mapToDouble(Factura::getIva).sum();
        double totalFinal = facturas.stream().mapToDouble(Factura::getTotal).sum();

        // 2. Crear y persistir la Nota de Crédito (Paso 7)
        NotaCredito nc = NotaCredito.builder()
                .numero(19) // O lógica de numeración correlativa
                .monto(totalNeto)
                .iva(totalIva)
                .total(totalFinal)
                .fechaPago(LocalDate.now())
                .build();
        
        nc = notaCreditoRepository.save(nc);

        // 3. Actualizar Facturas y Consumos (Paso 9)
        for (Factura f : facturas) {
            f.setEstado(EstadoFactura.ANULADA); // Postcondición: Factura anulada
            f.setNotaCredito(nc); // Vinculación para auditoría
            
            // Reactivación de deuda: Deja la deuda como pendiente
            if (f.getEstadia() != null) {
                List<Consumo> consumos = f.getEstadia().getConsumos();
                consumos.forEach(c -> c.setFacturado(false)); // Vuelve a ser deuda
                consumoRepository.saveAll(consumos);
            }
        }
        
        facturaRepository.saveAll(facturas);

        // 4. Detalle de respuesta (Paso 8)
        return NotaCreditoDetalleResponseDTO.builder()
                .nroNotaCredito("NC-0019-" + nc.getId())
                .responsablePago(facturas.get(0).getResponsableDePago().getNombreRazonSocial()) // Agregado
                .importeNeto(BigDecimal.valueOf(totalNeto))
                .iva(BigDecimal.valueOf(totalIva))
                .importeTotal(BigDecimal.valueOf(totalFinal))
                .fechaEmision(LocalDate.now())
                .build();
    }
}
