"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FormularioBuscarResponsable from "@/components/Formularios/FormularioBuscarResponsable";

export default function BuscarResponsableManager() {
  const router = useRouter();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos búsqueda:", form);
    // fetch o navegación
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <FormularioBuscarResponsable
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
