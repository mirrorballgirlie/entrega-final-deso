    package com.gestionhotelera.gestion_hotelera.gestores;
    import java.util.List;
    import java.util.stream.Collectors;
    import com.gestionhotelera.gestion_hotelera.dto.FacturaDTO;
    import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
    import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
    import org.springframework.stereotype.Service;
    import lombok.RequiredArgsConstructor;
    import lombok.*;
    import com.gestionhotelera.gestion_hotelera.modelo.Factura;
    import com.gestionhotelera.gestion_hotelera.dto.NotaCreditoDTO;
    import java.util.Collections;
import java.time.LocalDateTime;
import com.gestionhotelera.gestion_hotelera.modelo.NotaCredito;
import com.gestionhotelera.gestion_hotelera.repository.NotaCreditoRepository;
// Asegúrate de que este también esté bien:
import com.gestionhotelera.gestion_hotelera.dto.NotaCreditoDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
    @Service
    @RequiredArgsConstructor


    public class GestorPago {
        private final FacturaRepository facturaRepository;
        private final NotaCreditoRepository notaCreditoRepository;
        private final HuespedRepository huespedRepository;

        public List<FacturaDTO> obtenerFacturasPendientes(Integer nroHabitacion) {
            
            return facturaRepository.findFacturasPendientesByNroHabitacionyEstado(nroHabitacion, EstadoFactura.NO_PAGO)
                    .stream()
                    .map(f -> {
                            FacturaDTO dto = new FacturaDTO(); 
                            dto.setId(f.getId());
                            dto.setCuit(f.getCuit());
                            dto.setIva(f.getIva());
                            dto.setNombre(f.getNombre());
                            dto.setEstadiaId(f.getEstadia().getId());
                            //dto.setTotalnota_credito_id(f.getTotalnota_credito_id());
                            //dto.setResponsable_id(f.getResponsable_id());
                            dto.setTipo(f.getTipo());
                            dto.setMonto(f.getMonto());
                            dto.setFechaEmision(f.getFechaEmision());
                            dto.setEstado(f.getEstado());
                            dto.setTotal(f.getTotal());
                            return dto;
                        })
                        .collect(Collectors.toList());
        }

        public void pagar(Double monto, Long idFactura) {
            
            Factura factura = facturaRepository.findById(idFactura).orElse(null);
            factura.setEstado(EstadoFactura.PAGO);
            factura.setTotal(factura.getTotal() - monto);
            facturaRepository.save(factura);
        }

        public List<FacturaDTO> obtenerPendientesBytipoDocumentoandnumeroDocumentoorcuit(String tipoDocumento, String numeroDocumento, String cuit) {
            String buscador = null;
        if (cuit == null || cuit.isEmpty()) {
                // Si no se proporciona CUIT, buscamos por tipo y número de documento
                // buscar huesped por tipo y numero de documento
                

                var h = buscarHuespedPorDocumento(tipoDocumento, numeroDocumento);
                if(h == null){
                    return Collections.emptyList();
                }
                else{
                    buscador = h.getCuit();
                }
                
            }
            else {
                // Si se proporciona CUIT, buscamos por CUIT
                buscador = cuit;
            }
                List<Factura> facturas = facturaRepository.findAllByCuit(buscador);
                
                return facturas.stream()
                        .filter(f -> f.getEstado() == EstadoFactura.NO_PAGO || f.getEstado() == EstadoFactura.PAGO_PARCIAL) // Filtrar solo facturas pendientes
                        .map(f -> {
                            FacturaDTO dto = new FacturaDTO();
                            dto.setId(f.getId());
                            dto.setCuit(f.getCuit());
                            dto.setIva(f.getIva());
                            dto.setNombre(f.getNombre());
                            //dto.setEstadia_id(f.getEstadia().getId());
                            //dto.setTotalnota_credito_id(f.getTotalnota_credito_id());
                            //dto.setRespondable_id(f.getRespondable_id());
                            dto.setTipo(f.getTipo());
                            dto.setMonto(f.getMonto());
                            dto.setFechaEmision(f.getFechaEmision());
                            dto.setEstado(f.getEstado());
                            dto.setTotal(f.getTotal());
                            return dto;
                        })
                        .collect(Collectors.toList());
            
        }
        
        public NotaCreditoDTO generarNotaCredito(List<Long> facturasIds) {



            List<Factura> facturas = List.of(); // Inicializamos con una lista vacía
            
            
            // Si se proporcionan IDs de facturas, las buscamos en la base de datos
            if (facturasIds != null && !facturasIds.isEmpty()) {
                facturas = facturaRepository.findAllById(facturasIds);
            }

            NotaCredito notaCredito = new NotaCredito();

            // Calculamos los valores de la nota de crédito sumando los valores de las facturas
            double monto = facturas.stream()
                    .mapToDouble(Factura::getMonto)
                    .sum();
            
            double ivaTotal = facturas.stream()
                    .mapToDouble(Factura::getIva)
                    .sum();
                    
            double total = facturas.stream()
                    .mapToDouble(Factura::getTotal)
                    .sum();
            
            // Configuramos la nota de crédito con los valores calculados
            notaCredito.setMonto(monto);
            notaCredito.setIva(ivaTotal);
            notaCredito.setTotal(total);
            notaCredito.setFechaEmision(LocalDateTime.now());
            notaCredito.setFacturas(facturas);

            //Guardamos la nota de crédito en la base de datos
            notaCreditoRepository.save(notaCredito);

            // Mapeamos la nota de crédito a un DTO para enviar al Front
            NotaCreditoDTO notaCreditoDTO = new NotaCreditoDTO();
            notaCreditoDTO.setMonto(notaCredito.getMonto());
            notaCreditoDTO.setFechaEmision(notaCredito.getFechaEmision());
            notaCreditoDTO.setIva(notaCredito.getIva());
            notaCreditoDTO.setTotal(notaCredito.getTotal());

            return notaCreditoDTO;
        }

        private Huesped buscarHuespedPorDocumento(String tipoDocumento, String numeroDocumento) {
                return huespedRepository.findByTipoDocumentoAndDocumento(tipoDocumento, numeroDocumento)
                        .orElseThrow(() -> new RuntimeException("Huésped no encontrado"));
        }

    }
