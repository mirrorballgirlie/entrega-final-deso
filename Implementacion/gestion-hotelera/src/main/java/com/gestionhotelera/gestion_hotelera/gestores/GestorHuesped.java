package com.gestionhotelera.gestion_hotelera.gestores;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionhotelera.gestion_hotelera.dto.DireccionDTO;
import com.gestionhotelera.gestion_hotelera.dto.HuespedDTO;
import com.gestionhotelera.gestion_hotelera.modelo.Direccion;
import com.gestionhotelera.gestion_hotelera.modelo.Huesped;
import com.gestionhotelera.gestion_hotelera.repository.DireccionRepository;
import com.gestionhotelera.gestion_hotelera.repository.HuespedRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class GestorHuesped {

    private final HuespedRepository huespedRepository;
    private final DireccionRepository direccionRepository;

    //para el cu2, se buscan los huespedes por combinaciones de filtros o por ningun filtro. en ese caso, se retornan todos los huespedes
    public List<Huesped> buscarFiltrado(String apellido, String nombre, String tipoDocumento, String documento){
        apellido = (apellido != null && !apellido.isBlank()) ? apellido : null;
        nombre = (nombre != null && !nombre.isBlank()) ? nombre : null;
        tipoDocumento = (tipoDocumento != null && !tipoDocumento.isBlank()) ? tipoDocumento : null;
        documento = (documento != null && !documento.isBlank()) ? documento : null;

        boolean sinFiltros = ((apellido == null || apellido.isEmpty()) &&
                             (nombre == null || nombre.isEmpty()) &&
                             (tipoDocumento == null || tipoDocumento.isEmpty()) &&
                             (documento == null || documento.isEmpty()));

                            if (sinFiltros){
                                return huespedRepository.findAll();
                            }
                            else {
                                return huespedRepository.buscarFiltrado(
                                apellido != null && !apellido.isEmpty() ? apellido : null, 
                                nombre != null && !nombre.isEmpty() ? nombre : null, 
                                tipoDocumento != null && !tipoDocumento.isEmpty() ? tipoDocumento : null, 
                                documento != null && !documento.isEmpty() ? documento : null );

                                //aca se busca filtrado, si el campo no es nulo ni vacio, se pasa el valor. sino, se pasa null
                            }
    }

    // para el cu9, verificamos si existe un huesped "duplicado" (si el nro y el tipo de doc ya existen)
    public Optional<Huesped> findByTipoDocumentoAndDocumento(String tipoDocumento, String documento){

        return huespedRepository.findByTipoDocumentoAndDocumento(tipoDocumento, documento);

    }

    // para el cu9, guardamos un nuevo huesped junto a su direccion

    public Huesped registrarHuesped (HuespedDTO dto){

        //verificamos que el dto no sea nulo
        if (dto == null){
            throw new IllegalArgumentException("El DTO de huesped no puede ser nulo");
        }

        //ahora verificamos que este huesped no exista duplicado (mismo tipo y nro de doc)
        Optional<Huesped> existente = findByTipoDocumentoAndDocumento(dto.getTipoDocumento(), dto.getDocumento());
        if (existente.isPresent()){
            throw new IllegalArgumentException("el huesped con ese tipo y nro de doc ya existe en el sistema");
        }

        //creamos y guardamos la direccion, a partir del dto
        DireccionDTO dirDto = dto.getDireccion();
        Direccion direccion = Direccion.builder()
        .pais(dirDto.getPais())
        .provincia(dirDto.getProvincia())
        .ciudad(dirDto.getCiudad())
        .calle(dirDto.getCalle())
        .numero(dirDto.getNumero())
        .codigoPostal(dirDto.getCodigoPostal())
        .build();
        //setear piso y depto

        //guardar la direccion

        direccion = direccionRepository.save(direccion);

        //crear el huesped

        Huesped huesped = Huesped.builder()
        .nombre (dto.getNombre())
        .apellido (dto.getApellido())
        .tipoDocumento (dto.getTipoDocumento())
        .documento (dto.getDocumento())
        .posicionIVA (dto.getPosicionIVA())
        .fechaNacimiento (dto.getFechaNacimiento())
        .telefono (dto.getTelefono())
        .email (dto.getEmail())
        .ocupacion (dto.getOcupacion())
        .nacionalidad (dto.getNacionalidad())
        .direccion(direccion)
        .build();

        //guardar el huesped

        //huesped = huespedRepository.save(huesped);
        return huespedRepository.save(huesped);
    }


    //obtener todos los huespedes, para el cu2 y/o el cu15
     public List<Huesped> obtenerTodos() {
        return huespedRepository.findAll();
    }

    boolean existsByTipoDocumentoAndDocumento(String tipoDocumento, String documento){
        return huespedRepository.existsByTipoDocumentoAndDocumento(tipoDocumento, documento);
    }

    


}
