package com.gestionhotelera.gestion_hotelera.gestores;
import java.util.List;
import java.util.stream.Collectors;
import com.gestionhotelera.gestion_hotelera.dto.FacturaDTO;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoFactura;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.*;

@Service
@RequiredArgsConstructor


public class GestorPago {
    private final FacturaRepository facturaRepository;

    public List<FacturaDTO> obtenerFacturasPendientes(Integer nroHabitacion) {
        
        return facturaRepository.findFacturasPendientesByNroHabitacionyEstado(nroHabitacion, EstadoFactura.NO_PAGO)
                .stream()
                .map(factura -> new FacturaDTO(factura.getNombre(), factura.getTipo(), factura.getCuit(), factura.getMonto(),factura.getIva(),factura.getTotal(), factura.getFechaEmision(), factura.getEstado()))
                .collect(Collectors.toList());
    }
}
