package com.gestionhotelera.gestion_hotelera.dto;
import java.util.Date;
import com.gestionhotelera.gestion_hotelera.modelo.EstadoReserva;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class ReservaDTO {

    private int numero;
    private EstadoReserva estado;
    private Date fechaDesde;
    private Date fechaHasta;
    private String nombre;
    private String apellido;
    private String telefono;

}
