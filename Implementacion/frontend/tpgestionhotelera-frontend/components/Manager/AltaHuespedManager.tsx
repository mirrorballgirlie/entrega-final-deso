"use client";
import React, { useState } from "react";
import FormularioAltaHuesped from "@/components/Formularios/FormularioAltaHuesped";
import PopupCritical from "@/components/PopupCritical";

interface Props {
  onExit: () => void;
}

const INITIAL_STATE = {
  apellido: "", nombres: "", tipoDocumento: "DNI", documento: "", cuit: "",
  fechaNacimiento: "", nacionalidad: "ARGENTINA", telefono: "", email: "",
  ocupacion: "", posicionIVA: "CONSUMIDOR_FINAL",
  direccion: {
    calle: "", numero: "", departamento: "", piso: "", codigoPostal: "", ciudad: "", provincia: "", pais: "ARGENTINA"
  }
};

export default function AltaHuespedManager({ onExit }: Props) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Nuevo estado para guardar el ID del duplicado si existe
  const [existingId, setExistingId] = useState<number | null>(null);

  // Estados de Popups
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // --- LÓGICA DE VALIDACIÓN ---
  const validateField = (fieldName: string, value: string) => {
    if (!value || value.trim() === "") {
      setErrors(prev => prev.includes(fieldName) ? prev : [...prev, fieldName]);
    } else {
      setErrors(prev => prev.filter(field => field !== fieldName));
    }
  };

  const validateAll = (): string[] => {
    const e: string[] = [];
    if (!form.apellido.trim()) e.push("apellido");
    if (!form.nombres.trim()) e.push("nombres");
    if (!form.tipoDocumento.trim()) e.push("tipoDocumento");
    if (!form.documento.trim()) e.push("documento");
    if (!form.fechaNacimiento.trim()) e.push("fechaNacimiento");
    
    if (!form.direccion.calle.trim()) e.push("calle");
    if (!form.direccion.numero) e.push("numero");
    if (!form.direccion.codigoPostal.trim()) e.push("codigoPostal");
    if (!form.direccion.ciudad.trim()) e.push("ciudad");
    if (!form.direccion.provincia.trim()) e.push("provincia");
    if (!form.direccion.pais.trim()) e.push("pais");
    
    if (!form.telefono.trim()) e.push("telefono");
    if (!form.ocupacion.trim()) e.push("ocupacion");
    
    if (form.posicionIVA === "RESPONSABLE_INSCRIPTO" && !form.cuit.trim()) {
      e.push("cuit");
    }
    return e;
  };

  // --- HANDLERS INPUTS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valUpper = value.toUpperCase();
    setForm(prev => ({ ...prev, [name]: valUpper }));
    if (errors.includes(name)) validateField(name, valUpper);
  };

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valUpper = value.toUpperCase();
    setForm(prev => ({
      ...prev,
      direccion: { ...prev.direccion, [name]: valUpper }
    }));
    if (errors.includes(name)) validateField(name, valUpper);
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
    if (v.length > 0) return;

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
          message={`El huésped ${form.nombres} ${form.apellido} ha sido satisfactoriamente cargado al sistema. ¿Desea cargar otro?`}
          primaryText="SI" // Carga otro (Reset)
          secondaryText="NO" // Sale al menú
          onPrimary={handleReset}
          onSecondary={onExit}
        />
      )}
    </>
  );
}