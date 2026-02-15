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

@Service
@RequiredArgsConstructor


public class GestorPago {
    private final FacturaRepository facturaRepository;

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
}
