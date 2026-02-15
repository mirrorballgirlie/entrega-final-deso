"use client";
import React, { useState, useRef , useEffect } from "react";
import styles from "./formularioResponsable.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

export default function FormularioResponsablePago({
    onGuardar, onCancelar, onBorrar, initialData, isEdit }: any) {
  const cuitRef = useRef<HTMLInputElement>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [form, setForm] = useState({
      tipoPersona: "JURIDICA", huespedId: 0,
    razonSocial: "", cuit: "", telefono: "",
    calle: "", numero: "", depto: "", piso: "",
    cp: "", localidad: "", provincia: "", pais: "Argentina"
  });
  useEffect(() => {
      if(initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(errores.length > 0) setErrores([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    const nuevosErrores: string[] = [];
    const camposOpcionales = ["piso", "depto"];
    // validación
    Object.entries(form).forEach(([key, value]) => {
      if (!camposOpcionales.includes(key) && typeof value === 'string' && !value.trim ()) {
          nuevosErrores.push(`EL CAMPO ${key.toUpperCase()} ES OBLIGATORIO`);
      }

    });

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }
        const dataParaEnviar = { //porque direccion es compuesta
              tipoPersona: form.tipoPersona,
              razonSocial: form.razonSocial,
              cuit: form.cuit,
              telefono: form.telefono,
              huespedId: null, // Como es alta de tercero, va null
              direccion: {
                calle: form.calle,
                numero: form.numero,
                piso: form.piso,
                departamento: form.depto, //en back es 'departamento'
                codigoPostal: form.cp,    //enback es 'codigoPostal'
                ciudad: form.localidad,   //en back es 'ciudad'
                provincia: form.provincia,
                pais: form.pais
              }
          };

    const resultado = await onGuardar(dataParaEnviar);

    if (resultado === "EXISTE") {
      setErrores(["¡CUIDADO! EL CUIT YA EXISTE EN EL SISTEMA"]);
      cuitRef.current?.focus();
    } else if (resultado === "ERROR") {
        setErrores(["Hubo un error con el servidor"]);
        }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
              {/* literalmente voy a reutlizar el formulario asi q cambio el titulo pero es el mismo ya fue */}
              <Title>{isEdit ? "Modificar Responsable de Pago" : "Alta de Responsable de Pago"}</Title>
            </div>

      <div className={styles.formCard}>
        <div className={styles.sectionTitle}>Datos Fiscales / Personales</div>
        <div className={styles.verticalFields}>
          <div className={styles.field}>
            <label>Razón Social / Nombre y Apellido *</label>
            <input name="razonSocial" placeholder="Ej: Hotel Premier S.A." className={styles.input} value={form.razonSocial} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>CUIT*</label>
            <input name="cuit" ref={cuitRef} placeholder="00-00000000-0" className={styles.input} value={form.cuit} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Teléfono*</label>
            <input name="telefono" placeholder="Ej: +54 9 11 ..." className={styles.input} value={form.telefono} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.radio}>
          <label>
            <input
              type="radio"
              value="FISICA"
              checked={form.tipoPersona === "FISICA"}
              onChange={(e) => setForm({...form, tipoPersona: e.target.value})}
            /> Persona Física
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              value="JURIDICA"
              checked={form.tipoPersona === "JURIDICA"}
              onChange={(e) => setForm({...form, tipoPersona: e.target.value})}
            /> Persona Jurídica
          </label>
        </div>


        <div className={styles.sectionTitle}>Dirección</div>
        <div className={styles.gridDir}>
          <div className={styles.field}><label>Calle*</label><input name="calle" className={styles.input} value={form.calle} onChange={handleChange} /></div>
          <div className={styles.field}><label>Numero*</label><input name="numero" className={styles.input} value={form.numero} onChange={handleChange} /></div>
          <div className={styles.field}><label>Piso</label><input name="piso" className={styles.input} value={form.piso} onChange={handleChange} /></div>
          <div className={styles.field}><label>Depto</label><input name="depto" className={styles.input} value={form.depto} onChange={handleChange} /></div>
          <div className={styles.field}><label>C.P.*</label><input name="cp" className={styles.input} value={form.cp} onChange={handleChange} /></div>
          <div className={styles.field}><label>Localidad*</label><input name="localidad" className={styles.input} value={form.localidad} onChange={handleChange} /></div>
          <div className={styles.field}><label>Provincia*</label><input name="provincia" className={styles.input} value={form.provincia} onChange={handleChange} /></div>
          <div className={styles.field}><label>País*</label><input name="pais" className={styles.input} value={form.pais} onChange={handleChange} /></div>
        </div>

        {errores.length > 0 &&  (
            <div className={styles.localErrorList}>
            {errores.map((err, i) => (
              <p key={i} className={styles.errorText}> {err}</p>
            ))}
          </div>
        )}

        <div className={styles.buttonGroup}>
          {/*solo uso el boton borrar en el modificar no en el alta!! */}
          {isEdit && (
              <div className={styles.borrarWrapper}>
                <Button onClick={onBorrar}>Borrar</Button>
              </div>
            )}
          <Button onClick={onCancelar}>Cancelar</Button>
          <Button onClick={handleSubmit}>Siguiente</Button>
        </div>
      </div>
    </div>
  );
}