"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./alta.module.css";
import FormField from "@/components/FormField";
import PopupCritical from "@/components/PopupCritical";
import ErrorBox from "@/components/ErrorBox";
import Button from "@/components/Button";

type FormState = {
  apellido: string;
  nombres: string;
  tipoDocumento: string;
  documento: string;
  cuit: string;
  fechaNacimiento: string;
  nacionalidad: string;
  telefono: string;
  email: string;
  ocupacion: string;
  direccion: {
    calle: string;
    numero: string;
    departamento: string;
    piso: string;
    codigoPostal: string;
    ciudad: string;
    provincia: string;
    pais: string;
  }; 
  posicionIVA: string;
};
const paisesAmerica = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominica",
  "Ecuador",
  "El Salvador",
  "Estados Unidos",
  "Granada",
  "Guatemala",
  "Guyana",
  "Haití",
  "Honduras",
  "Jamaica",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "República Dominicana",
  "San Cristóbal y Nieves",
  "San Vicente y las Granadinas",
  "Santa Lucía",
  "Surinam",
  "Trinidad y Tobago",
  "Uruguay",
  "Venezuela"
];

export default function AltaHuespedPage() {
  const [form, setForm] = useState<FormState>({ //Estado del componente para los datos del formulario
    apellido: "",
    nombres: "",
    tipoDocumento: "DNI",
    documento: "",
    cuit: "",
    fechaNacimiento: "",
    nacionalidad: "ARGENTINA",
    telefono: "",
    email: "",
    ocupacion: "",
    direccion: {
    calle: "",
    numero: "",
    departamento: "",
    piso: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
    pais: "ARGENTINA",
  },
    posicionIVA: "CONSUMIDOR_FINAL"
  });

  const [errors, setErrors] = useState<string[]>([]); // Estado para los errores de validación
  const [showCritical, setShowCritical] = useState(false); // para grayscale
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const tipoDocRef = useRef<HTMLSelectElement | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }
  
  function setDireccionField<Field extends keyof FormState["direccion"]>(
  field: Field,
  value: FormState["direccion"][Field]
  ) {
  setForm(prev => ({
    ...prev,
    direccion: {
      ...prev.direccion,
      [field]: value
    }
  }));
}


  // Validación local (2.A)
  function validate(): string[] {
    const e: string[] = [];
    if (!form.apellido.trim()) e.push("Apellido es obligatorio.");
    if (!form.nombres.trim()) e.push("Nombres es obligatorio.");
    if (!form.tipoDocumento.trim()) e.push("Tipo de documento es obligatorio.");
    if (!form.documento.trim()) e.push("Número de documento es obligatorio.");
    if (!form.fechaNacimiento.trim()) e.push("Fecha de nacimiento es obligatoria.");
    if (!form.direccion.calle.trim()) e.push("Calle es obligatoria.");
    if (!form.direccion.numero) e.push("Número de direccion es obligatorio.");
    if (!form.direccion.codigoPostal.trim()) e.push("Código postal es obligatorio.");
    if (!form.direccion.ciudad.trim()) e.push("ciudad es obligatoria.");
    if (!form.direccion.provincia.trim()) e.push("Provincia es obligatoria.");
    if (!form.telefono.trim()) e.push("Teléfono es obligatorio.");
    if (!form.ocupacion.trim()) e.push("Ocupación es obligatoria.");
    // regla especial CUIT vs IVA
    if (form.posicionIVA === "RESPONSABLE_INSCRIPTO" && !form.cuit.trim()) {
      e.push("CUIT es obligatorio para Responsable Inscripto.");
    }
    return e;
  }

  // submit inicial: valida + Consulta si el huesped es duplicado (2.B)
  async function handleSiguiente(e?: React.FormEvent) {
    console.log("CLICK DETECTADO - Entré en handleSiguiente");
    e?.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length > 0) {
      // mostrar errores y terminar (2.A)
      return;
    }

    // Consulta duplicado (2.B) -> ajustar endpoint real
    // try {
    //   const base = process.env.NEXT_PUBLIC_API_BASE || "";
    //   const res = await fetch(`${base}/api/huesped/existe?tipo=${encodeURIComponent(form.tipoDocumento)}&nro=${encodeURIComponent(form.documento)}`); //Llamada al backend con el fetch para verificar duplicado
    //   if (!res.ok) throw new Error("Error al verificar duplicado");
    //   const { existe } = await res.json(); // backend: { existe: true/false }
    //   if (existe) {
    //     setShowDuplicatePopup(true);
    //     setShowCritical(true);
    //     return;
    //   }
    //   // si no existe -> guardar directamente
    //   await guardarHuesped();
    // } catch (err) {
    //   console.error(err);
    //   // en caso de error de red mostramos popup crítico genérico
    //   setShowDuplicatePopup(true); // reusar popup con texto distinto si querés
    //   setShowCritical(true);
    // }

    // try {
    //   const base = process.env.NEXT_PUBLIC_API_BASE;
  
    //   const url = `${base}/api/huespedes/buscar?` +
    //   `tipoDocumento=${encodeURIComponent(form.tipoDocumento)}&` +
    //   `documento=${encodeURIComponent(form.documento)}`;

    //   const res = await fetch(url);
    //   if (!res.ok) throw new Error("Error al consultar huésped");

    //   const data = await res.json();

    //   console.log("Resultado del backend:", data);

    //   // si el backend devuelve un texto "No se encontraron huéspedes..." entonces:
    //   if (typeof data === "string") {
    //     console.log("No existe el huésped");
    //     return;
    //   }

    //   // si devuelve una lista de huéspedes, entonces existe
    //   if (Array.isArray(data) && data.length > 0) {
    //     console.log("El huésped existe:", data[0]);
    //     return;
    //   }

    //   } catch (e) {
    //     console.error("Error de red:", e);
    //   }

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE;

      // 1. CONSULTA PARA VERIFICAR DUPLICADO
      const url = `${base}/api/huespedes/buscar?` +
       `tipoDocumento=${encodeURIComponent(form.tipoDocumento)}&` +
        `documento=${encodeURIComponent(form.documento)}`;
      //console.log("URL FINAL:", url);
      
      //console.log("URL FINAL:", url);

      try {
        const res = await fetch(url);
        console.log("STATUS:", res.status);
        const text = await res.text();
        console.log("RESPUESTA DEL SERVER:", text);
      } catch (err) {
        console.error("ERROR DE FETCH:", err);
      }
      console.log(JSON.stringify(form));
      const res = await fetch(url);

      if (!res.ok) throw new Error("Error al consultar huésped");

      const data = await res.json();

      const existe = Array.isArray(data) && data.length > 0;

      if (existe) {
       // MUESTRO POPUP DE DUPLICADO
        setShowDuplicatePopup(true);
        setShowCritical(true);
        return;
      }

      // 2. SI NO EXISTE → HACER POST PARA DAR DE ALTA

      const altaRes = await fetch(`${base}/api/huespedes/alta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apellido: form.apellido,
          nombre: form.nombres,
          tipoDocumento: form.tipoDocumento,
          documento: form.documento,
          cuit: form.cuit,
          nacionalidad: form.nacionalidad,
          fechaNacimiento: form.fechaNacimiento,
          posicionIVA: form.posicionIVA,
          ocupacion: form.ocupacion,
          telefono: form.telefono,
          email: form.email,

          direccion: {
            pais: form.direccion.pais,
            provincia: form.direccion.provincia,
            ciudad: form.direccion.ciudad,
            codigoPostal: form.direccion.codigoPostal,
            calle: form.direccion.calle,
            numero: Number(form.direccion.numero),
            piso: form.direccion.piso ? Number(form.direccion.piso) : null,
            departamento: form.direccion.departamento || null
          }
  })
});

  if (!altaRes.ok) {
    const errorText = await altaRes.text(); // puede venir como string
    throw new Error(errorText);
  }

  const nuevo = await altaRes.json();
  console.log("Huésped creado:", nuevo);

  // Si querés mostrar popup de éxito:
  setShowSuccessPopup(true);

} catch (e) {
  console.error("Error:", e);
  setShowCritical(true);
}

  }

  async function guardarHuesped() {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      
      const res = await fetch(`${base}/api/huesped`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar huésped");
      // éxito
      setShowSuccessPopup(true);
      setShowCritical(true);
    } catch (err) {
      console.error(err);
      // mostrar popup de error crítico
      setShowDuplicatePopup(true);
      setShowCritical(true);
    }
  }

  function handleAcceptDuplicate() {
    // Aceptar igualmente: seguir guardando
    setShowDuplicatePopup(false);
    setShowCritical(false);
    guardarHuesped();
  }
  function handleCorrectDuplicate() {
    setShowDuplicatePopup(false);
    setShowCritical(false);
    // foco en tipo de documento
    tipoDocRef.current?.focus();
  }

  function handleCancel() {
    setShowCancelPopup(true);
    setShowCritical(true);
  }

  function handleConfirmCancel(confirm: boolean) {
    setShowCancelPopup(false);
    setShowCritical(false);
    if (confirm) {
      // acción de terminar CU: por ejemplo redirect a lista:
      window.location.href = "/"; // cambiá al destino real
    }
    // si no, mantenemos los datos y volvemos a la pantalla
  }

  return (
    <div className={`${styles.wrapper} ${showCritical ? styles.isCritical : ""}`}> {/*cambia la clase  entre wrapper e isCritical del div principal si hay un popup crítico activo */}
      {/* Si querés usar la imagen de fondo/rectángulo gris ponla en public y usá next/image */}
      {/* <div className={styles.header}>
        <div className={styles.headerChild} />
        <div className={styles.hotelPremier}>Hotel Premier</div>
      </div> */}
      <>
        <h1 className={styles.title}>Dar de alta Huesped</h1>
      </>

      <main className={styles.mainContent}>
        

        {/* Error list (2.A) */}
        {errors.length > 0 && <ErrorBox messages={errors} />}
  
        <form id="formHuesped" className={styles.form} onSubmit={handleSiguiente}>
          {/* {Datos Personales} */}

          <h2 className={styles.sectionTitle}> Datos Personales</h2>

          {/* Primera fila */}
          <div className={styles.row}>
            <FormField label="Apellido *">
              <input name="apellido" placeholder="INGRESE UN APELLIDO..." value={form.apellido} onChange={(ev)=> setField("apellido", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Nombres *">
              <input name="nombres" placeholder="INGRESE UN NOMBRE..." value={form.nombres} onChange={(ev)=> setField("nombres", ev.target.value.toUpperCase())} />
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Tipo de Documento *">
              <select name="tipoDocumento" ref={tipoDocRef} value={form.tipoDocumento} onChange={(ev)=> setField("tipoDocumento", ev.target.value)}>
                <option>DNI</option>
                <option>LE</option>
                <option>LC</option>
                <option>PASAPORTE</option>
                <option>OTRO</option>
              </select>
            </FormField>

            <FormField label="Número documento *">
              <input name="documento" placeholder="INGRESE UN NÚMERO DE DOCUMENTO..." value={form.documento} onChange={(ev)=> setField("documento", ev.target.value.toUpperCase())} />
            </FormField>

            
          </div>

          <div className={styles.row}>
            <FormField label="CUIT">
              <input name="cuit" placeholder="INGRESE UN CUIT..." value={form.cuit} onChange={(ev)=> setField("cuit", ev.target.value)} />
            </FormField>

            <FormField label="Nacionalidad *">
              <select name="nacionalidad"  value={form.nacionalidad} onChange={(ev)=> setField("nacionalidad", ev.target.value.toUpperCase())} >
                {paisesAmerica.map((pais) => (
                  <option key={pais} value={pais.toUpperCase()}>{pais}</option>
                ))}
              </select>  
            </FormField>

          </div>

          <div className={styles.row}>
            <FormField label="Fecha de Nacimiento *">
              <input type="date" placeholder="--/--/----" name="fechaNacimiento" value={form.fechaNacimiento} onChange={(ev)=> setField("fechaNacimiento", ev.target.value)} />

            </FormField>
          </div>

          {/* {Datos de Direccion} */}
          <h2 className={styles.sectionTitle}> Direccion </h2>

          <div className={styles.row}>
            <FormField label="Pais *">
              <input name="pais" placeholder="INGRESE UN PAIS..." value={form.direccion.pais} onChange={(ev)=> setDireccionField("pais", ev.target.value)} />
            </FormField>

            <FormField label="Provincia *">
              <input name="provincia" placeholder="INGRESE UNA PROVINCIA..." value={form.direccion.provincia} onChange={(ev)=> setDireccionField("provincia", ev.target.value.toUpperCase())} />
            </FormField>
          </div>

           <div className={styles.row}>
            <FormField label="ciudad *">
              <input name="ciudad" placeholder="INGRESE UNA ciudad..." value={form.direccion.ciudad} onChange={(ev)=> setDireccionField("ciudad", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Codigo Postal *">
              <input name="codigoPostal" placeholder="INGRESE UN CODIGO POSTAL..." value={form.direccion.codigoPostal} onChange={(ev)=> setDireccionField("codigoPostal", ev.target.value.toUpperCase())} />
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Calle *">
              <input name="calle"   placeholder="INGRESE UNA CALLE..." value={form.direccion.calle} onChange={(ev)=> setDireccionField("calle", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Numero *">
              <input name="numero" placeholder="INGRESE UN NUMERO..." value={form.direccion.numero} onChange={(ev)=> setDireccionField("numero", ev.target.value)} />
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Piso *">
              <input name="piso"   placeholder="INGRESE UN PISO..." value={form.direccion.piso} onChange={(ev)=> setDireccionField("piso", ev.target.value)} />
            </FormField>

            <FormField label="Departamento *">
              <input name="departamento" placeholder="INGRESE UN DEPARTAMENTO..." value={form.direccion.departamento} onChange={(ev)=> setDireccionField("departamento", ev.target.value.toUpperCase())} />
            </FormField>
          </div>

          <h2 className={styles.sectionTitle}> Informacion Laboral</h2>

          <div className={styles.row}>
            <FormField label="Posición Frente al IVA *">
              <input name="posicionIVA"  placeholder="INGRESE UNA POSICIÓN..." value={form.posicionIVA} onChange={(ev)=> setField("posicionIVA", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Ocupación *">
              <input name="ocupacion" placeholder="INGRESE UNA OCUPACIÓN..." value={form.ocupacion} onChange={(ev)=> setField("ocupacion", ev.target.value.toUpperCase())} />
            </FormField>
          </div>

          {/* {Datos de Contacto} */}
          <h2 className={styles.sectionTitle}> Contacto</h2>

          <div className={styles.row}>
            <FormField label="Telefono *">
              <input name="telefono"  placeholder="INGRESE UN TELEFONO..." value={form.telefono} onChange={(ev)=> setField("telefono", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Email *">
              <input name="email" placeholder="INGRESE UN EMAIL..." value={form.email} onChange={(ev)=> setField("email", ev.target.value.toUpperCase())} />
            </FormField>
          </div>
          
        </form>

         <div className={styles.buttonContainer}>
            <Button type="submit" form="formHuesped">Siguiente</Button>
            <Button type="button" /*variant="secondary" */ onClick={handleCancel}>Cancelar</Button>
          </div>
      </main>
      

      {/* Popups */}
      {showDuplicatePopup && (
        <PopupCritical title="¡CUIDADO!"
          message="El tipo y número de documento ya existen en el sistema"
          primaryText="ACEPTAR IGUALMENTE"
          secondaryText="CORREGIR"
          onPrimary={handleAcceptDuplicate}
          onSecondary={handleCorrectDuplicate}
        />
      )}

      {showCancelPopup && (
        <PopupCritical
          title="Cancelar"
          message="¿Desea cancelar el alta del huésped?"
          primaryText="SI"
          secondaryText="NO"
          onPrimary={() => handleConfirmCancel(true)}
          onSecondary={() => handleConfirmCancel(false)}
        />
      )}

      {showSuccessPopup && (
        <PopupCritical
          title="¡Alta exitosa!"
          message={`El huésped ${form.nombres} ${form.apellido} ha sido cargado. ¿Desea cargar otro?`}
          primaryText="SI"
          secondaryText="NO"
          onPrimary={() => {
            setShowSuccessPopup(false);
            setShowCritical(false);
            // limpiar formulario
            setForm({ //Estado del componente para los datos del formulario
              apellido: "",
              nombres: "",
              tipoDocumento: "DNI",
              documento: "",
              cuit: "",
              fechaNacimiento: "",
              nacionalidad: "ARGENTINA",
              telefono: "",
              email: "",
              ocupacion: "",
              direccion: {
                calle: "",
                numero: "",
                departamento: "",
                piso: "",
                codigoPostal: "",
                ciudad: "",
                provincia: "",
                pais: "ARGENTINA",
              },
            posicionIVA: "CONSUMIDOR_FINAL"
      });
          }}
          onSecondary={() => {
            // NO: redirigir
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
}
