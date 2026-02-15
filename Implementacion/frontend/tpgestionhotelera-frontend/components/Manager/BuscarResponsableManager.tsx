"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioBuscarResponsable from "@/components/Formularios/FormularioBuscarResponsable";
import ListadoResponsables from "@/components/Listados/ListadoResponsables";

export default function BuscarResponsableManager() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 formulario, 2 lista
  const [resultados, setResultados] = useState([]);

  const [form, setForm] = useState({
    razonSocial: "",
    cuit: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos búsqueda:", form.razonSocial, form.cuit);
     try{
         const response = await fetch(
             `http://localhost:8080/api/responsablesdepago/buscar?razonSocial=${form.razonSocial}&cuit=${form.cuit}`,
             {
                 method: 'GET',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                 }
             }
         );
         if (!response.ok) {
                 throw new Error("Error en la respuesta del servidor");
             }
         const data = await response.json();
         console.log("respuesta del back", data);
         if (data.existe) {
               setResultados(data.resultados);
               setStep(2);
             } else {
               router.push("/alta-responsable");
             }

     } catch (error) {
         console.error("Error de conexion: ", error);
         alert("No se pudo conectar con el servidor de Java.")
         }

     //mock para ver flujo front
    /*const mockResponsables = [
      { id: 1, razonSocial: "Empresa de Prueba SA", cuit: "20-12345678-9" },
      { id: 2, razonSocial: "Juan Perez SRL", cuit: "27-98765432-1" },
    ];
    setResultados(mockResponsables);
    setStep(2);*/

  };

  const handleCancel = () => {
    router.push("/home");
  };

  return (
      <div>
        {step === 1 && (
          <FormularioBuscarResponsable
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {step === 2 && (
          <ListadoResponsables
            datos={resultados}
            onVolver={() => setStep(1)}
            onSiguiente={(seleccion) => {
                  if (seleccion) {
                    const id = typeof seleccion === 'object' ? seleccion.id : seleccion;
                    router.push(`/modificar-responsable/${id}`);
                  } else {
                    //va al alta si no selecciona nada
                    router.push("/alta-responsable");
                  }
                }}

          />
        )}
      </div>
    );
}
