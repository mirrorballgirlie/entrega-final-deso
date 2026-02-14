package com.gestionhotelera.gestion_hotelera.gestores;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.gestionhotelera.gestion_hotelera.dto.ConsumoDTO;
import com.gestionhotelera.gestion_hotelera.dto.GenerarFacturaRequest;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.exception.ResourceNotFoundException;
import com.gestionhotelera.gestion_hotelera.gestores.strategy.RecargoCheckoutStrategy;
import com.gestionhotelera.gestion_hotelera.modelo.Consumo;
import com.gestionhotelera.gestion_hotelera.modelo.Estadia;
import com.gestionhotelera.gestion_hotelera.modelo.Factura;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;
import com.gestionhotelera.gestion_hotelera.modelo.TipoFactura;
import com.gestionhotelera.gestion_hotelera.repository.ConsumoRepository;
import com.gestionhotelera.gestion_hotelera.repository.EstadiaRepository;
import com.gestionhotelera.gestion_hotelera.repository.FacturaRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;
import com.gestionhotelera.gestion_hotelera.repository.ResponsableDePagoRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor



public class GestorFactura {

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

    public Factura generarFactura(GenerarFacturaRequest request) {
        // Obtener estadia
        Estadia estadia = estadiaRepository.findById(request.getEstadiaId())
            .orElseThrow(() -> new ResourceNotFoundException("Estadía no encontrada"));

        // Obtener responsable de pago por CUIT
        ResponsableDePago responsable = responsableRepository.findByCuit(request.getCuitResponsable())
            .orElseThrow(() -> new ResourceNotFoundException("Responsable no encontrado"));

        // Calcular monto
        double montoEstadia = request.isIncluirEstadia() ? obtenerValorEstadia(request.getEstadiaId()) : 0;
        
        // Obtener consumos seleccionados
        List<Consumo> consumosSeleccionados = new ArrayList<>();
        double montoConsumos = 0;
        
        if (request.getIdsConsumosSeleccionados() != null && !request.getIdsConsumosSeleccionados().isEmpty()) {
            consumosSeleccionados = consumoRepository.findAllById(request.getIdsConsumosSeleccionados());
            montoConsumos = consumosSeleccionados.stream()
                .mapToDouble(c -> c.getCantidad() * c.getPrecio())
                .sum();
        }

        double subtotal = montoEstadia + montoConsumos;
        
        // Determinar tipo de factura y calcular IVA
        TipoFactura tipoFactura;
        double iva = 0;
        
        // Suponemos que si es PersonaJuridica con condición RI, se aplica IVA
        // Por ahora simplificamos: si responsable es de cierto tipo, etc.
        // TODO: Verificar la condición fiscal del responsable
        tipoFactura = TipoFactura.B; // Por defecto B
        
        double total = subtotal + iva;

        // Crear factura
        Factura factura = Factura.builder()
            .estadia(estadia)
            .responsableDePago(responsable)
            .nombre(responsable.getCuit()) // O el nombre real
            .tipo(tipoFactura)
            .cuit(responsable.getCuit())
            .monto(subtotal)
            .iva(iva)
            .total(total)
            .build();

        // Guardar factura
        Factura facturaGuardada = facturaRepository.save(factura);

        // Marcar consumos como facturados
        if (!consumosSeleccionados.isEmpty()) {
            consumosSeleccionados.forEach(c -> c.setFacturado(true));
            consumoRepository.saveAll(consumosSeleccionados);
        }

        return facturaGuardada;
    }
    
}

