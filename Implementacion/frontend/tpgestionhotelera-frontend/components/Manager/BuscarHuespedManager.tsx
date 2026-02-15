"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioHuesped from "@/components/Formularios/FormularioHuesped";
import ListadoHuesped from "@/components/Listados/ListadoHuesped";
import ModificarHuespedManager from "@/components/Manager/ModificarHuespedManager";

interface Props {
  mode: "reservar" | "ocupar" | "buscar";

}

export default function BuscarHuespedManager({ mode }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Formulario, 2 = Listado
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    apellido: "",
    nombre: "", 
    tipoDocumento: "",
    documento: ""
  });

  const [results, setResults] = useState<any[]>([]);
  const [selectedHuesped, setSelectedHuesped] = useState<any>(null);

  const [formError, setFormError] = useState("");//?

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  //setFormError("");


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
      setResults(data.existe ? data.resultados : []);
      setStep(2);

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al buscar.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStep(1);
    setResults([]);
  };
  const handleSelectHuesped = (huesped: any) => {
    setSelectedHuesped(huesped); // guardamos en estado
    setStep(3); // pasamos al manager de modificar
  };


  return (
    <>
      {step === 1 && (
        <FormularioHuesped 
          form={form}
          onChange={handleInputChange}
          onSubmit={handleSearchSubmit}
          onCancel={() => router.push("/home")} // Sale de la página si cancela en el paso 1
          />
      )}

      {step === 2 && (
        <ListadoHuesped 
          mode={mode}
          results={results}
          onRetry={handleRetry} // Vuelve al paso 1
          onSelectionComplete={(huespedes) => handleSelectHuesped(huespedes[0])}
        />
      )}
      
     {step === 3 && selectedHuesped && (
         <ModificarHuespedManager huesped = {selectedHuesped} />
         )}
    </>
  );

}