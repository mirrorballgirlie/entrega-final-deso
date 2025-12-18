"use client";
import React, { useState } from "react";
import FormularioAltaHuesped from "@/components/Formularios/FormularioAltaHuesped";
import PopupCritical from "@/components/PopupCritical";
// Importa tus validadores
import { isValidCUIT, isValidEmail, isValidPhone, isValidName, isValidLocation, isValidPostCode, validateDocumentNumber, isNumeric, onlyLettersAndNumbers, isFutureOrToday } from "@/utils/validators";


interface Props {
  onExit: () => void;
}

const INITIAL_STATE = {
  apellido: "", nombre: "", tipoDocumento: "DNI", documento: "", cuit: "",
  fechaNacimiento: "", nacionalidad: "ARGENTINA", telefono: "", email: "",
  ocupacion: "", posicionIVA: "CONSUMIDOR_FINAL",
  direccion: {
    calle: "", numero: "", departamento: "", piso: "", codigoPostal: "", ciudad: "", provincia: "", pais: "ARGENTINA"
  }
};

export default function AltaHuespedManager({ onExit }: Props) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<{ [field: string]: string }>({});
  
  // Nuevo estado para guardar el ID del duplicado si existe
  const [existingId, setExistingId] = useState<number | null>(null);

  // Estados de Popups
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // --- LÓGICA DE VALIDACIÓN ---

  //VALIDACION CAMPO POR CAMPO
  
  const validateField = (field: string, value: string) => {
  let message = "";

  // Campos obligatorios generales
  const requiredFields = [
    "apellido", "nombre", "tipoDocumento", "documento", 
    "fechaNacimiento", "telefono", "ocupacion", "nacionalidad"
  ];

  // Campos de dirección obligatorios (excluyendo departamento y piso)
  const direccionFields = [
    "calle", "numero", "codigoPostal", "ciudad", "provincia", "pais"
  ];

  if (requiredFields.includes(field) && (!value || value.trim() === "")) {
    message = "Este campo es obligatorio";
  } else if (direccionFields.includes(field) && (!value || value.toString().trim() === "")) {
    message = "Este campo es obligatorio";
  } else {
    // Validación de formato según campo
    switch (field) {
      case "apellido":
      case "nombre":
      case "ocupacion":
        if (!isValidName(value)) message = "Formato inválido: solo letras y espacios";
        break;

      case "telefono":
        if (!isValidPhone(value)) message = "Formato inválido: ej. 3411234567 o +5493411234567";
        break;

      case "email":
        if (value && !isValidEmail(value)) message = "Formato inválido: ejemplo@correo.com";
        break;

      case "cuit":
        if (form.posicionIVA === "RESPONSABLE_INSCRIPTO") {
          if (!value || value.trim() === "") {
            message = "Este campo es obligatorio";
          } else if (!isValidCUIT(value)) {
            message = "CUIT inválido: ej. 20-12345678-9 o 20123456789";
          }
        }
        break;

      case "ciudad":
      case "provincia":
      case "pais":
      case "calle":
        if (!isValidLocation(value)) message = "Formato inválido: solo letras de cualquier idioma, numeros, comilla simple, puntos y espacios";
        break; 
        
      case "codigoPostal":
        if (!isValidPostCode(value)) message = "Formato inválido: solo números y letras, E3192AAA o 3192";
        break;


      case "documento":
        if (!validateDocumentNumber(form.tipoDocumento, value)) {
          switch(form.tipoDocumento) {
            case "DNI":
            case "LE":
            case "LC":
              message = "Formato inválido: solo números, OBLIGATORIO SIN puntos (ejemplo 12345678)";
              break;
            case "Pasaporte":
            case "Otro":
              message = "Formato inválido: solo letras y números, OBLIGATORIO SIN puntos";
              break;
            default:
              message = "Número de documento inválido";
          }
        }
        break;

      case "numero":
      case "piso": 
        if (!isNumeric(value)) message = "Formato inválido: solo números";

        break;  
      
      case "departamento":
        if (value && !onlyLettersAndNumbers(value)) message = "Formato inválido: solo letras y números";
        break;

      case "fechaNacimiento":
        if (value && isFutureOrToday(value)) message = "La fecha de nacimiento no puede ser hoy o futura";


  

      default:
        break;
    }
  }

  // Actualiza el estado de errores
  setErrors(prev => ({ ...prev, [field]: message }));
};


const validateAll = (): { [field: string]: string } => {
  const newErrors: { [field: string]: string } = {};

  if (!form.apellido.trim()) newErrors.apellido = "Este campo es obligatorio";
  if (!form.nombre.trim()) newErrors.nombre = "Este campo es obligatorio";
  if (!form.tipoDocumento.trim()) newErrors.tipoDocumento = "Este campo es obligatorio";
  if (!form.documento.trim()) newErrors.documento = "Este campo es obligatorio";
  if (!form.fechaNacimiento.trim()) newErrors.fechaNacimiento = "Este campo es obligatorio";

  if (!form.direccion.calle.trim()) newErrors.calle = "Este campo es obligatorio";
  if (!form.direccion.numero) newErrors.numero = "Este campo es obligatorio";
  if (!form.direccion.codigoPostal.trim()) newErrors.codigoPostal = "Este campo es obligatorio";
  if (!form.direccion.ciudad.trim()) newErrors.ciudad = "Este campo es obligatorio";
  if (!form.direccion.provincia.trim()) newErrors.provincia = "Este campo es obligatorio";
  if (!form.direccion.pais.trim()) newErrors.pais = "Este campo es obligatorio";

  if (!form.telefono.trim()) newErrors.telefono = "Este campo es obligatorio";
  if (!form.ocupacion.trim()) newErrors.ocupacion = "Este campo es obligatorio";

  if (form.posicionIVA === "RESPONSABLE_INSCRIPTO" && !form.cuit.trim()) {
    newErrors.cuit = "Este campo es obligatorio";
  }

  return newErrors;
};



// --- VALIDACIÓN COMPLETA ---

/*
  const validateAll = (): { [field: string]: string } => {
    const newErrors: { [field: string]: string } = {};
    // Campos personales
    if (!form.apellido.trim()) newErrors.apellido = "Este campo es obligatorio"; else if (!isValidName(form.apellido)) newErrors.apellido = "Solo incluir caracteres y espacios";
    if (!form.nombre.trim()) newErrors.nombre = "Este campo es obligatorio"; else if (!isValidName(form.nombre)) newErrors.nombre = "Solo incluir caracteres y espacios";
    if (!form.tipoDocumento.trim()) newErrors.tipoDocumento = "Este campo es obligatorio";
    if (!form.documento.trim()) {
    newErrors.documento = "Este campo es obligatorio";
    } else if (!validateDocumentNumber(form.tipoDocumento, form.documento)) {
    switch (form.tipoDocumento) {
    case "DNI":
    case "LE":
    case "LC":
      newErrors.documento = "Formato inválido: solo números, se permiten puntos (12.345.678 o 12345678)";
      break;
    case "Pasaporte":
    case "Otro":
      newErrors.documento = "Formato inválido: solo letras y números, sin puntos ni espacios";
      break;
    default:
      newErrors.documento = "Número de documento inválido";
  }
}

    if (!form.fechaNacimiento.trim()) newErrors.fechaNacimiento = "Este campo es obligatorio";
    if (!form.telefono.trim()) newErrors.telefono = "Este campo es obligatorio"; else if (!isValidPhone(form.telefono)) newErrors.telefono = "Formato inválido: ej. 3411234567 o +5493411234567";
    if (!form.ocupacion.trim()) newErrors.ocupacion = "Este campo es obligatorio"; else if (!isValidName(form.ocupacion)) newErrors.ocupacion = "Formato inválido: solo se permiten letras y espacios";
    if (form.posicionIVA === "RESPONSABLE_INSCRIPTO") {
      if (!form.cuit.trim()) newErrors.cuit = "Obligatorio"; else if (!isValidCUIT(form.cuit)) newErrors.cuit = "CUIT inválido, ejemplos 20-12345678-3 o 20123456783";
    }
    // Dirección
    const d = form.direccion;
    if (!d.calle.trim()) newErrors.calle = "Obligatorio"; else if (!isValidLocation(d.calle)) newErrors.calle = "Formato inválido, solo letras de cualquier idioma, numeros, comilla simple, puntos y espacios";
    if (!d.numero.toString().trim()) newErrors.numero = "Obligatorio"; else if (!isNumeric(d.numero)) newErrors.numero = "Solo números";
    if (d.piso && !isNumeric(d.piso)) newErrors.piso = "Solo números";
    if (!d.codigoPostal.trim()) newErrors.codigoPostal = "Obligatorio"; else if (!isValidPostCode(d.codigoPostal)) newErrors.codigoPostal = "Formato inválido, ejemplos E3192AAA o 3192";
    if (!d.ciudad.trim()) newErrors.ciudad = "Obligatorio"; else if (!isValidLocation(d.ciudad)) newErrors.ciudad = "Formato inválido, solo letras de cualquier idioma, numeros, comilla simple, puntos y espacios";
    if (!d.provincia.trim()) newErrors.provincia = "Obligatorio"; else if (!isValidLocation(d.provincia)) newErrors.provincia = "Formato inválido, solo letras de cualquier idioma, numeros, comilla simple, puntos y espacios";
    if (!d.pais.trim()) newErrors.pais = "Obligatorio"; else if (!isValidLocation(d.pais)) newErrors.pais = "Formato inválido, solo letras de cualquier idioma, numeros, comilla simple, puntos y espacios";
    return newErrors;
  };

  */


  // --- HANDLERS INPUTS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valUpper = value.toUpperCase();
    setForm(prev => ({ ...prev, [name]: valUpper }));
    if (errors[name]) validateField(name, valUpper); // ✅ corregido
  };

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valUpper = value.toUpperCase();
    setForm(prev => ({
      ...prev,
      direccion: { ...prev.direccion, [name]: valUpper }
    }));
    if (errors[name]) validateField(name, valUpper); // ✅ corregido
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleDireccionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  // --- SUBMIT (Lógica Principal) ---
  const handleSiguiente = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length > 0) return; // ✅ CORRECTO


    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      
      // 1. Verificar Duplicado
      const url = `${base}/api/huespedes/buscar?tipoDocumento=${encodeURIComponent(form.tipoDocumento)}&documento=${encodeURIComponent(form.documento)}`;
      
      const resCheck = await fetch(url);
      if (resCheck.ok) {
         const data = await resCheck.json();
         // El endpoint /buscar devuelve { existe: boolean, resultados: [...] }
         // O a veces devuelve array directo. Adaptamos según tu estructura anterior:
         const lista = data.resultados || (Array.isArray(data) ? data : []);
         
         if (lista.length > 0) {
           // ENCONTRAMOS DUPLICADO
           setExistingId(lista[0].id); // Guardamos el ID para poder hacer el PUT después
           setShowDuplicatePopup(true); // POPUP 1
           return;
         }
      }

      // 2. Si no hay duplicado, creamos uno nuevo (POST)
      await guardarHuesped();

    } catch (err) {
      console.error(err);
      alert("Error al verificar duplicados");
    }
  };

  // --- GUARDAR (POST) ---
  const guardarHuesped = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/api/huespedes/alta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformarPayload())
      });

      if (!res.ok) throw new Error(await res.text());

      setShowSuccessPopup(true); // POPUP 3
    } catch (err) {
      console.error(err);
      alert("Error al guardar huésped");
    }
  };

  // --- ACTUALIZAR (PUT) - "Aceptar Igualmente" ---
  const actualizarHuesped = async () => {
    if (!existingId) return;

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/api/huespedes/actualizar/${existingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformarPayload())
      });

      if (!res.ok) throw new Error(await res.text());

      // Éxito al actualizar, mostramos el mismo popup de éxito o uno diferente si prefieres
      setShowDuplicatePopup(false);
      setShowSuccessPopup(true); 

    } catch (err) {
      console.error(err);
      alert("Error al actualizar huésped existente");
    }
  };

  // Helper para armar el JSON plano que espera el backend (DTO)
  const transformarPayload = () => ({
     ...form,
     // Aplanamos la dirección para que coincida con tu DTO si es necesario,
     // o la enviamos anidada si tu Controller lo soporta. 
     // Aquí uso la lógica que tenías:
     direccion: {
        ...form.direccion,
        numero: Number(form.direccion.numero),
        piso: form.direccion.piso ? Number(form.direccion.piso) : null,
        departamento: form.direccion.departamento || null
     }
  });

  // --- RESET ---
  const handleReset = () => {
    setForm(INITIAL_STATE);
    setExistingId(null);
    setShowSuccessPopup(false);
    setShowDuplicatePopup(false);
  };

  return (
    <>
      <FormularioAltaHuesped 
         form={form}
         errors={errors}
         onChange={handleInputChange}
         onChangeDireccion={handleDireccionChange}
         onBlur={handleInputBlur}
         onBlurDireccion={handleDireccionBlur}
         onSubmit={handleSiguiente}
         onCancel={() => setShowCancelPopup(true)} // POPUP 2 Trigger
      />

      {/* --- POPUP 1: DUPLICADO --- */}
      {showDuplicatePopup && (
        <PopupCritical 
          message="¡CUIDADO! El tipo y número de documento ya existen en el sistema"
          primaryText="ACEPTAR IGUALMENTE" // Modifica el existente
          secondaryText="CORREGIR"         // Vuelve al form
          onPrimary={actualizarHuesped}    // <--- LLAMA AL PUT
          onSecondary={() => setShowDuplicatePopup(false)} 
        />
      )}

      {/* --- POPUP 2: CANCELAR --- */}
      {showCancelPopup && (
        <PopupCritical
          message="¿Desea cancelar el alta del huésped?"
          primaryText="SI" // Sale
          secondaryText="NO" // Se queda
          onPrimary={onExit}
          onSecondary={() => setShowCancelPopup(false)}
        />
      )}

      {/* --- POPUP 3: ÉXITO --- */}
      {showSuccessPopup && (
        <PopupCritical
          message={`El huésped ${form.nombre} ${form.apellido} ha sido satisfactoriamente cargado al sistema. ¿Desea cargar otro?`}
          primaryText="SI" // Carga otro (Reset)
          secondaryText="NO" // Sale al menú
          onPrimary={handleReset}
          onSecondary={onExit}
        />
      )}
    </>
  );
}