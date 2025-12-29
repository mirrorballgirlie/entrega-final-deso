"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioHuesped from "@/components/Formularios/FormularioHuesped";
import ListadoHuesped from "@/components/Listados/ListadoHuesped";
//import { isValidName, validateDocumentNumber } from "@/utils/validators";

interface Props {
  mode: "reservar" | "ocupar" | "buscar";
 
}

export default function BuscarHuespedManager({ mode }: Props) {
  const router = useRouter();

  // Estados del Manager
  const [step, setStep] = useState<1 | 2>(1); // 1 = Formulario, 2 = Listado
  const [loading, setLoading] = useState(false);
  
  // Datos del Formulario
  const [form, setForm] = useState({
    apellido: "",
    nombre: "", // Ojo: en tu form original usabas "nombres" o "nombre"? Unifiqué a nombre
    tipoDocumento: "",
    documento: ""
  });

  // Resultados de búsqueda
  const [results, setResults] = useState<any[]>([]);

  // Estado para errores de formato
  const [formError, setFormError] = useState("");


  // 1. Manejo de inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 2. Manejo del Submit (Fetch al backend)
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    // if (!form.apellido && !form.nombre && !form.tipoDocumento && !form.documento) {
    //   alert("Debe completar al menos un campo.");
    //   return;
    // }

    // --- Validaciones de formato ---
  //   if (form.apellido && !isValidName(form.apellido)) {
  //    setFormError("Apellido con formato inválido: unicamente caracteres y espacios");
  //    return;
  //  }

  //  if (form.nombre && !isValidName(form.nombre)) {
  //   setFormError("Nombre con formato inválido: unicamente caracteres y espacios");
  //  return;
  //  }

  //  if (form.documento && form.tipoDocumento && !validateDocumentNumber(form.tipoDocumento, form.documento)) {
  //    setFormError("Documento con formato inválido para el tipo seleccionado. Para DNI, LE y LC solamente se permiten digitos. Pasaporte/otro caracteres alfanumericos. cargar SIN puntos (ejemplo 12345678)");
  //    return;
  //  }

  setFormError(""); 

    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      
      const queryParams = new URLSearchParams();
      if (form.apellido) queryParams.append("apellido", form.apellido);
      if (form.nombre) queryParams.append("nombre", form.nombre);
      if (form.tipoDocumento) queryParams.append("tipoDocumento", form.tipoDocumento);
      if (form.documento) queryParams.append("documento", form.documento);

      const res = await fetch(`${base}/api/huespedes/buscar?${queryParams.toString()}`);
      
      if (!res.ok) throw new Error("Error en la búsqueda");

      const data = await res.json();
      
      // La API devuelve { existe: boolean, resultados: [] }
      const encontrados = data.existe ? data.resultados : [];
      setResults(encontrados);
      
      // Avanzamos al paso 2 (Listado)
      // Incluso si está vacío, pasamos al paso 2 para que ListadoHuesped muestre el Popup de "No encontrado"
      setStep(2); 

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Volver a buscar (desde el listado)
  const handleRetry = () => {
    setStep(1);
    setResults([]);
  };

  return (
    <>
      {step === 1 && (
        <FormularioHuesped 
          form={form}
          onChange={handleInputChange}
          onSubmit={handleSearchSubmit}
          onCancel={() => router.back()} // Sale de la página si cancela en el paso 1
          // formError={formError} // <-- pasamos error al formulario
        />
      )}

      {step === 2 && (
        <ListadoHuesped 
          mode={mode}
          results={results}
          onRetry={handleRetry} // Vuelve al paso 1
        />
      )}
    </>
  );
}