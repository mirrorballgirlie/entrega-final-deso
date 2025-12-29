"use client";

import style from "./formulariohuesped.module.css"; 
import Button from "@/components/Button";
import { isValidName, validateDocumentNumber } from "@/utils/validators"; // tu archivo de validators
import * as React from "react";


interface Props {
  // Recibe el estado completo del padre
  form: {
    apellido: string;
    nombre: string;
    tipoDocumento: string;
    documento: string;
  };
  // Recibe las funciones de control
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  //formError?: string; // <-- esto hay que agregarlo
}

export default function FormularioHuesped({ form, onChange, onSubmit, onCancel}: Props) {

  const [formError, setFormError] = React.useState<string | null>(null);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // --- VALIDACIONES USANDO TUS FUNCIONES ---
  //   if (form.apellido && !isValidName(form.apellido)) {
  //     setFormError("Apellido inválido: solo letras, espacios");
  //     return;
  //   }

  //   if (form.nombre && !isValidName(form.nombre)) {
  //     setFormError("Nombre inválido: solo letras, espacios");
  //     return;
  //   }

  //   if (form.documento && form.tipoDocumento && !validateDocumentNumber(form.tipoDocumento, form.documento)) {
  //     setFormError(
  //       "Documento inválido para el tipo seleccionado. DNI/LE/LC: solo dígitos, Pasaporte/Otro: alfanumérico (todos sin puntos)."
  //     );
  //     return;
  //   }

  //   setFormError(null); // todo OK
  //   onSubmit(e);
  // };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIONES DE NOMBRE Y APELLIDO ---
    if (form.apellido && !isValidName(form.apellido)) {
      setFormError("Apellido inválido: solo letras, espacios");
      return;
    }

    if (form.nombre && !isValidName(form.nombre)) {
      setFormError("Nombre inválido: solo letras, espacios");
      return;
    }

    // --- VALIDACIÓN DE DOCUMENTO CORREGIDA ---
    
    // 1. Si el usuario escribió un número de documento...
    if (form.documento) {
        // ...es OBLIGATORIO que haya seleccionado un tipo.
        if (!form.tipoDocumento) {
             setFormError("Debe seleccionar un Tipo de Documento.");
             return;
        }

        // 2. Si tiene tipo y número, validamos el formato.
        if (!validateDocumentNumber(form.tipoDocumento, form.documento)) {
            setFormError(
                "Documento inválido para el tipo seleccionado. DNI/LE/LC: solo dígitos (7 u 8). Pasaporte/Otro: alfanumérico."
            );
            return;
        }
    } 
    // 3. (Opcional) Si seleccionó tipo pero no escribió número
    else if (form.tipoDocumento) {
        setFormError("Si selecciona un tipo, debe ingresar el número de documento.");
        return;
    }

    setFormError(null); // todo OK
    onSubmit(e);
  };
  
  return (
    <main className={style.container}>
      <div className={style.formWrapper}>

        <div className={style.contentWrapper}>
          <h1 className={style.title}>Buscar Huésped</h1>

          {/* <p className={style.instructions}>
            Complete al menos un campo para realizar la búsqueda.
          </p> */}

          {/* Mensaje de error */}
          {formError && (
            <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>
              {formError}
            </div>
          )}

          <form className={style.form} onSubmit={handleSubmit}>
            <div className={style.formGroup}>
              <label className={style.label}>Apellido</label>
              <input
                name="apellido" // Importante: name para identificar el campo
                className={style.input}
                value={form.apellido}
                onChange={onChange}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Nombres</label>
              <input
                name="nombre"
                className={style.input}
                value={form.nombre}
                onChange={onChange}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Tipo Documento</label>
              <select
                name="tipoDocumento"
                className={style.select}
                value={form.tipoDocumento}
                onChange={onChange}
              >
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="LE">LE</option>
                <option value="LC">LC</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Documento</label>
              <input
                name="documento"
                className={style.input}
                value={form.documento}
                onChange={onChange}
              />
            </div>

            <div className={style.buttonGroup}>
              <Button type="submit" className={style.buttonSearch}>
                Buscar
              </Button>
              <Button
                type="button"
                className={style.buttonCancel}
                onClick={onCancel}
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