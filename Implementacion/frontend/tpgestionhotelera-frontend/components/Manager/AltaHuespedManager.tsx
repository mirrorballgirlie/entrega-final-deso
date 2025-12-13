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
  
  // Estados de Popups
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // --- LÓGICA DE VALIDACIÓN (Idéntica a tu original) ---
  const validateField = (fieldName: string, value: string) => {
    if (!value || value.trim() === "") {
      setErrors(prev => {
        if (prev.includes(fieldName)) return prev;
        return [...prev, fieldName];
      });
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
    // Dirección
    if (!form.direccion.calle.trim()) e.push("calle");
    if (!form.direccion.numero) e.push("numero");
    if (!form.direccion.codigoPostal.trim()) e.push("codigoPostal");
    if (!form.direccion.ciudad.trim()) e.push("ciudad");
    if (!form.direccion.provincia.trim()) e.push("provincia");
    if (!form.direccion.pais.trim()) e.push("pais");
    // Resto
    if (!form.telefono.trim()) e.push("telefono");
    if (!form.ocupacion.trim()) e.push("ocupacion");
    
    // Regla especial
    if (form.posicionIVA === "RESPONSABLE_INSCRIPTO" && !form.cuit.trim()) {
      e.push("cuit"); // Asumo que querías marcar el cuit
    }
    return e;
  };

  // --- MANEJO DE INPUTS (Con Uppercase y Validación on-type) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const valUpper = value.toUpperCase(); // Tu lógica original

    setForm(prev => ({ ...prev, [name]: valUpper }));

    // Si ya había error, validar al escribir para borrarlo
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

  // --- MANEJO DE ONBLUR (Tu lógica original de validación al salir) ---
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleDireccionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  // --- SUBMIT ---
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
         const existe = Array.isArray(data) && data.length > 0;
         if (existe) {
            setShowDuplicatePopup(true);
            return;
         }
      }

      // 2. Alta
      await guardarHuesped();

    } catch (err) {
      console.error(err);
      alert("Error al procesar la solicitud");
    }
  };

  const guardarHuesped = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/api/huespedes/alta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
             ...form,
             direccion: {
                ...form.direccion,
                numero: Number(form.direccion.numero),
                piso: form.direccion.piso ? Number(form.direccion.piso) : null,
                departamento: form.direccion.departamento || null
             }
        })
      });

      if (!res.ok) {
         const txt = await res.text();
         throw new Error(txt);
      }

      setShowSuccessPopup(true);

    } catch (err) {
      console.error(err);
      // Aquí tenías lógica de reintentar o mostrar error critico
      alert("Error al guardar huésped");
    }
  };

  // --- RESET ---
  const handleReset = () => {
    setForm(INITIAL_STATE);
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
         onCancel={() => setShowCancelPopup(true)}
      />

      {/* --- POPUPS ORIGINALES --- */}
      
      {showDuplicatePopup && (
        <PopupCritical 
          message="El tipo y número de documento ya existen en el sistema"
          primaryText="ACEPTAR IGUALMENTE"
          secondaryText="CORREGIR"
          onPrimary={() => {
             setShowDuplicatePopup(false);
             guardarHuesped(); // Fuerza guardado
          }}
          onSecondary={() => setShowDuplicatePopup(false)} // Cierra
        />
      )}

      {showCancelPopup && (
        <PopupCritical
          message="¿Desea cancelar el alta del huésped?"
          primaryText="SI"
          secondaryText="NO"
          onPrimary={onExit}
          onSecondary={() => setShowCancelPopup(false)}
        />
      )}

      {showSuccessPopup && (
        <PopupCritical
          message={`El huésped ${form.nombres} ${form.apellido} ha sido cargado. ¿Desea cargar otro?`}
          primaryText="SI"
          secondaryText="NO"
          onPrimary={handleReset}
          onSecondary={onExit}
        />
      )}
    </>
  );
}