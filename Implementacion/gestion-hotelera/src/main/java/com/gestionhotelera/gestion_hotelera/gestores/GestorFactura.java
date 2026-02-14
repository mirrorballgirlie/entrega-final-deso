package com.gestionhotelera.gestion_hotelera.gestores;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.dto.NotaCreditoDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import lombok.RequiredArgsConstructor;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import java.util.Optional;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.NotaCreditoRepository;
import com.gestionhotelera.gestion_hotelera.repository.PagoRepository;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.NotaCredito;
import com.gestionhotelera.gestion_hotelera.dto.ConsumoDTO;
import com.gestionhotelera.gestion_hotelera.dto.FacturaDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import com.gestionhotelera.gestion_hotelera.repository.ConsumoRepository;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.RecargoCheckoutStrategy;
import org.springframework.beans.factory.annotation.Autowired;


@Service
@RequiredArgsConstructor



public class GestorFactura {

    private final FacturaRepository facturaRepository;
    private final EstadiaRepository estadiaRepository;
    private final HuespedRepository huespedRepository;
    private final ConsumoRepository consumoRepository;
    private final RecargoCheckoutStrategy recargoStrategy;
    private final NotaCreditoRepository notaCreditoRepository;
    private final PagoRepository pagoRepository;

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

    public List<FacturaDTO> obtenerPendientesByCuit(String cuit) {
        // Buscamos las facturas para el CUIT dado
        List<Factura> facturas = facturaRepository.findAllByCuit(cuit);
        
        

        //Filtramos solo las facturas que estén pendientes (esto depende de cómo se maneje el estado de la factura, aquí asumimos que el monto pendiente es mayor a 0)
        List<Factura> facturasPendientes = facturas.stream()
                .filter(f -> !pagoRepository.existsByFacturaId(f.getId()))
                .collect(Collectors.toList());

        List<FacturaDTO> facturasPendientesDTO = facturasPendientes.stream().map(f -> {
            FacturaDTO dto = new FacturaDTO();
            dto.setId(f.getId());
            dto.setCuit(f.getCuit());
            dto.setMonto(f.getMonto());
            dto.setFechaEmision(f.getFechaEmision());
            return dto;
        }).collect(Collectors.toList());

        return facturasPendientesDTO;
    }
    
    public NotaCreditoDTO generarNotaCredito(List<Long> facturasIds) {
        // Aquí iría la lógica para generar la nota de crédito a partir de las facturas
        // Esto podría incluir cálculos, validaciones, etc.
        // Por simplicidad, vamos a devolver una nota de crédito con un monto fijo



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
}
    

