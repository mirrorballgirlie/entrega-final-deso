package com.gestionhotelera.gestion_hotelera.gestores.strategy;

import com.gestionhotelera.gestion_hotelera.dto.ModificarResponsableDePagoRequest;
import com.gestionhotelera.gestion_hotelera.modelo.ResponsableDePago;


/*Modificar Responsable de Pago
└── si es Persona Jurídica → modificar datos fiscales completos
└── si es Persona Física → modificar SOLO datos fiscales permitidos
*/



public interface ModificarResponsableDePagoStrategy {

    void modificar(ResponsableDePago responsable, ModificarResponsableDePagoRequest request);
}

