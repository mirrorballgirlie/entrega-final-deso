// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import style from "./formulariohuesped.module.css";
// import Button from "@/components/Button";

// interface Props {
//   mode: "reservar" | "ocupar" | "buscar";
// }

// export default function FormularioHuesped({ mode }: Props) {
//   const router = useRouter();

//   const [apellido, setApellido] = useState("");
//   const [nombre, setNombres] = useState("");
//   const [tipoDocumento, setTipoDocumento] = useState("");
//   const [documento, setDocumento] = useState("");

  
//   const handleSearch = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!apellido && !nombre && !tipoDocumento && !documento) {
//     alert("Debe completar al menos un campo.");
//     return;
//   }

//   const query = new URLSearchParams({
//     apellido,
//     nombre: nombre,
//     tipoDocumento,
//     documento,
//     mode,
//   }).toString();

//   router.push(`/buscar-huesped/Lista-huesped?${query}`);
// };


//   return (
//     <main className={style.container}>
//       <div className={style.formWrapper}>

//         <div className={style.contentWrapper}>
//           <h1 className={style.title}>Buscar Huésped</h1>

//           <p className={style.instructions}>
//             Complete al menos un campo para realizar la búsqueda.
//           </p>

//           <form className={style.form} onSubmit={handleSearch}>
//             <div className={style.formGroup}>
//               <label className={style.label}>Apellido</label>
//               <input
//                 className={style.input}
//                 value={apellido}
//                 onChange={(e) => setApellido(e.target.value)}
//               />
//             </div>

//             <div className={style.formGroup}>
//               <label className={style.label}>Nombres</label>
//               <input
//                 className={style.input}
//                 value={nombre}
//                 onChange={(e) => setNombres(e.target.value)}
//               />
//             </div>

//             <div className={style.formGroup}>
//               <label className={style.label}>Tipo Documento</label>
//               <select
//                 className={style.select}
//                 value={tipoDocumento}
//                 onChange={(e) => setTipoDocumento(e.target.value)}
//               >
//                 <option value="">Seleccionar</option>
//                 <option value="DNI">DNI</option>
//                 <option value="Pasaporte">Pasaporte</option>
//               </select>
//             </div>

//             <div className={style.formGroup}>
//               <label className={style.label}>Documento</label>
//               <input
//                 className={style.input}
//                 value={documento}
//                 onChange={(e) => setDocumento(e.target.value)}
//               />
//             </div>

//             <div className={style.buttonGroup}>
//               <Button type="submit" className={style.buttonSearch}>
//                 Buscar
//               </Button>
//               <Button
//                 className={style.buttonCancel}
//                 onClick={() => router.back()}
//               >
//                 Cancelar
//               </Button>
//             </div>
//           </form>
//         </div>

//         <div className={style.footer}></div>
//       </div>
//     </main>
//   );
// }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIONES USANDO TUS FUNCIONES ---
    if (form.apellido && !isValidName(form.apellido)) {
      setFormError("Apellido inválido: solo letras, espacios");
      return;
    }

    if (form.nombre && !isValidName(form.nombre)) {
      setFormError("Nombre inválido: solo letras, espacios");
      return;
    }

    if (form.documento && form.tipoDocumento && !validateDocumentNumber(form.tipoDocumento, form.documento)) {
      setFormError(
        "Documento inválido para el tipo seleccionado. DNI/LE/LC: solo dígitos, Pasaporte/Otro: alfanumérico (todos sin puntos)."
      );
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