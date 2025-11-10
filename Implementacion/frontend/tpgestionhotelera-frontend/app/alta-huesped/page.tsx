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
  nroDocumento: string;
  cuit: string;
  fechaNacimiento: string;
  nacionalidad: string;
  telefono: string;
  email: string;
  ocupacion: string;
  // dirección desglosada
  calle: string;
  numero: string;
  depto: string;
  piso: string;
  codigoPostal: string;
  localidad: string;
  provincia: string;
  pais: string;
  ivaCondicion: string;
};

export default function AltaHuespedPage() {
  const [form, setForm] = useState<FormState>({
    apellido: "",
    nombres: "",
    tipoDocumento: "DNI",
    nroDocumento: "",
    cuit: "",
    fechaNacimiento: "",
    nacionalidad: "ARGENTINA",
    telefono: "",
    email: "",
    ocupacion: "",
    calle: "",
    numero: "",
    depto: "",
    piso: "",
    codigoPostal: "",
    localidad: "",
    provincia: "",
    pais: "ARGENTINA",
    ivaCondicion: "CONSUMIDOR_FINAL"
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showCritical, setShowCritical] = useState(false); // para grayscale
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const tipoDocRef = useRef<HTMLSelectElement | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  // Validación local (2.A)
  function validate(): string[] {
    const e: string[] = [];
    if (!form.apellido.trim()) e.push("Apellido es obligatorio.");
    if (!form.nombres.trim()) e.push("Nombres es obligatorio.");
    if (!form.tipoDocumento.trim()) e.push("Tipo de documento es obligatorio.");
    if (!form.nroDocumento.trim()) e.push("Número de documento es obligatorio.");
    if (!form.fechaNacimiento.trim()) e.push("Fecha de nacimiento es obligatoria.");
    if (!form.calle.trim()) e.push("Calle es obligatoria.");
    if (!form.numero.trim()) e.push("Número de dirección es obligatorio.");
    if (!form.codigoPostal.trim()) e.push("Código postal es obligatorio.");
    if (!form.localidad.trim()) e.push("Localidad es obligatoria.");
    if (!form.provincia.trim()) e.push("Provincia es obligatoria.");
    if (!form.telefono.trim()) e.push("Teléfono es obligatorio.");
    if (!form.ocupacion.trim()) e.push("Ocupación es obligatoria.");
    // regla especial CUIT vs IVA
    if (form.ivaCondicion === "RESPONSABLE_INSCRIPTO" && !form.cuit.trim()) {
      e.push("CUIT es obligatorio para Responsable Inscripto.");
    }
    return e;
  }

  // submit inicial: valida + consulta duplicado
  async function handleSiguiente(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validate();
    setErrors(v);
    if (v.length > 0) {
      // mostrar errores y terminar (2.A)
      return;
    }

    // Consulta duplicado (2.B) -> ajustar endpoint real
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/api/huesped/existe?tipo=${encodeURIComponent(form.tipoDocumento)}&nro=${encodeURIComponent(form.nroDocumento)}`);
      if (!res.ok) throw new Error("Error al verificar duplicado");
      const { existe } = await res.json(); // backend: { existe: true/false }
      if (existe) {
        setShowDuplicatePopup(true);
        setShowCritical(true);
        return;
      }
      // si no existe -> guardar directamente
      await guardarHuesped();
    } catch (err) {
      console.error(err);
      // en caso de error de red mostramos popup crítico genérico
      setShowDuplicatePopup(true); // reusar popup con texto distinto si querés
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
    <div className={`${styles.wrapper} ${showCritical ? styles.isCritical : ""}`}>
      {/* Si querés usar la imagen de fondo/rectángulo gris ponla en public y usá next/image */}
      <div className={styles.header}>
        <div className={styles.headerChild} />
        <div className={styles.hotelPremier}>Hotel Premier</div>
      </div>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Dar de alta Huesped</h1>

        {/* Error list (2.A) */}
        {errors.length > 0 && <ErrorBox errors={errors} />}

        <form className={styles.form} onSubmit={handleSiguiente}>
          {/* Primera fila */}
          <div className={styles.row}>
            <FormField label="Apellido *">
              <input name="apellido" value={form.apellido} onChange={(ev)=> setField("apellido", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="Nombres *">
              <input name="nombres" value={form.nombres} onChange={(ev)=> setField("nombres", ev.target.value.toUpperCase())} />
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
              <input name="nroDocumento" value={form.nroDocumento} onChange={(ev)=> setField("nroDocumento", ev.target.value.toUpperCase())} />
            </FormField>

            <FormField label="CUIT">
              <input name="cuit" value={form.cuit} onChange={(ev)=> setField("cuit", ev.target.value)} />
            </FormField>
          </div>

          {/* ...agregá el resto de campos de la misma forma (fecha, direccion, telefono, email, ocupacion, nacionalidad, etc.) */}
          <div style={{ marginTop: 18 }}>
            <Button type="submit">Siguiente</Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>Cancelar</Button>
          </div>
        </form>
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
            setForm({
              apellido: "",
              nombres: "",
              tipoDocumento: "DNI",
              nroDocumento: "",
              cuit: "",
              fechaNacimiento: "",
              nacionalidad: "ARGENTINA",
              telefono: "",
              email: "",
              ocupacion: "",
              calle: "",
              numero: "",
              depto: "",
              piso: "",
              codigoPostal: "",
              localidad: "",
              provincia: "",
              pais: "ARGENTINA",
              ivaCondicion: "CONSUMIDOR_FINAL"
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
