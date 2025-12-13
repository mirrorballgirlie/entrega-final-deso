"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./formulariohuesped.module.css";
import Button from "@/components/Button";

interface Props {
  mode: "reservar" | "ocupar" | "buscar";
}

export default function FormularioHuesped({ mode }: Props) {
  const router = useRouter();

  const [apellido, setApellido] = useState("");
  const [nombre, setNombres] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [documento, setDocumento] = useState("");

  
  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  if (!apellido && !nombre && !tipoDocumento && !documento) {
    alert("Debe completar al menos un campo.");
    return;
  }

  const query = new URLSearchParams({
    apellido,
    nombre: nombre,
    tipoDocumento,
    documento,
    mode,
  }).toString();

  router.push(`/buscar-huesped/Lista-huesped?${query}`);
};


  return (
    <main className={style.container}>
      <div className={style.formWrapper}>

        <div className={style.contentWrapper}>
          <h1 className={style.title}>Buscar Huésped</h1>

          <p className={style.instructions}>
            Complete al menos un campo para realizar la búsqueda.
          </p>

          <form className={style.form} onSubmit={handleSearch}>
            <div className={style.formGroup}>
              <label className={style.label}>Apellido</label>
              <input
                className={style.input}
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Nombres</label>
              <input
                className={style.input}
                value={nombre}
                onChange={(e) => setNombres(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Tipo Documento</label>
              <select
                className={style.select}
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Documento</label>
              <input
                className={style.input}
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>

            <div className={style.buttonGroup}>
              <Button type="submit" className={style.buttonSearch}>
                Buscar
              </Button>
              <Button
                className={style.buttonCancel}
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        <div className={style.footer}></div>
      </div>
    </main>
  );
}
