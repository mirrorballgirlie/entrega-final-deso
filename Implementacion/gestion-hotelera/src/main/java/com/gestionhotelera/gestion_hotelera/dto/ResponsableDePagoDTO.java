package com.gestionhotelera.gestion_hotelera.dto;
import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "responsableDePago")
@Entity
@SuperBuilder

public class ResponsableDePagoDTO {

    private String cuit;

}
