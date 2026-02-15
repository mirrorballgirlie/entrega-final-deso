/*package com.gestionhotelera.gestion_hotelera.gestores;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import lombok.RequiredArgsConstructor;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import java.util.Optional;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.dto.ConsumoDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import com.gestionhotelera.gestion_hotelera.repository.ConsumoRepository;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.RecargoCheckoutStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import com.gestionhotelera.gestion_hotelera.dto.FacturaDTO;
import java.time.LocalDateTime;




@Service
@RequiredArgsConstructor



public class GestorFactura {

    private final EstadiaRepository estadiaRepository;
    private final HuespedRepository huespedRepository;
    private final ConsumoRepository consumoRepository;
    private final RecargoCheckoutStrategy recargoStrategy;
    private final FacturaRepository facturaRepository;

    public List<HuespedDTO> obtenerOcupantes(Integer numHab, LocalDate fechaSalida) {
    // 1. Buscamos la estadía activa para esa habitación y fecha
    List<Estadia> estadiaOpt = estadiaRepository.buscarEstadiaPorHabitacionYSalida(numHab, fechaSalida);
    if (estadiaOpt.isEmpty()) {
        throw new ResourceNotFoundException("No se encontró una estadía activa para la habitación " + numHab + " con fecha de salida " + fechaSalida);
    }
    Estadia estadia = estadiaOpt.get(0); // Suponemos que solo hay una estadia activa para esa habitación y fecha

    // 2. Mapeamos los huéspedes a un DTO para enviar al Front
    return estadia.getHuespedes().stream()
            .map(h -> {
                // Asegurate que HuespedDTO tenga un constructor que acepte estos campos
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
            dto.setNombre(c.getNombre());
            dto.setCantidad(c.getCantidad());
            dto.setPrecio(c.getPrecio());
            return dto;
        }).collect(Collectors.toList());
    }

    public double obtenerValorEstadia(Long estadiaId) {
        Estadia estadia = estadiaRepository.findById(estadiaId)
            .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

        // 1. Calcular cantidad de noches
        long noches = ChronoUnit.DAYS.between(estadia.getFechaIngreso(), estadia.getFechaEgreso());
        if (noches <= 0) noches = 1; // Mínimo se cobra una noche

        double precioNoche = estadia.getHabitacion().getTipoHabitacion().getPrecioNoche();
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

    @Transactional
    public Long crearFactura(FacturaDTO dto, Long estadiaId, List<Long> itemsFacturadosIds) {
        Estadia estadia = estadiaRepository.findById(estadiaId).orElseThrow();

        Factura factura = Factura.builder()
            .nombre(dto.getNombre())
            .tipo(dto.getTipo())
            .cuit(dto.getCuit())
            .monto(dto.getMonto())
            .iva(dto.getIva())
            .total(dto.getTotal())
            .fechaEmision(LocalDateTime.now())
            .estadia(estadia)
            .build();

        // 1. Guardar factura
        Factura guardada = facturaRepository.save(factura);

        // 2. Marcar consumos como FACTURADOS para que no aparezcan de nuevo
        /*if (itemsFacturadosIds != null && !itemsFacturadosIds.isEmpty()) {
            consumoRepository.marcarComoFacturados(itemsFacturadosIds, guardada.getId());
        }*/
    

//return guardada.getId();
// }


//}
