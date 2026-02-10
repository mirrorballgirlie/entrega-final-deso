"use client";
import React from "react";
import styles from "./formularioModificarHuesped.module.css";
import FormField from "@/components/FormField";
import Title from "@/components/Title";
import Button from "@/components/Button";

const paisesAmerica = [
  "Argentina","Bolivia","Brasil","Canadá","Chile","Colombia","Costa Rica","Cuba","Dominica",
  "Ecuador","El Salvador","Estados Unidos","Granada","Guatemala","Guyana","Haití","Honduras",
  "Jamaica","México","Nicaragua","Panamá","Paraguay","Perú","República Dominicana",
  "San Cristóbal y Nieves","San Vicente y las Granadinas","Santa Lucía","Surinam",
  "Trinidad y Tobago","Uruguay","Venezuela"
];

interface Props {
  huesped: any;
  form: any;
  errors: { [field: string]: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onChangeDireccion: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlurDireccion: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function FormularioModificarHuesped({
  huesped,
  form,
  errors,
  onChange,
  onChangeDireccion,
  onBlur,
  onBlurDireccion,
  onSubmit,
  onCancel,
  onDelete
}: Props) {

  const hasError = (field: string) => !!errors[field];
  const getError = (field: string) => errors[field];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Title>Modificar Huésped</Title>
      </header>

      <main className={styles.mainContent}>
        <form id="formHuesped" className={styles.form} onSubmit={onSubmit}>

          {/* --- DATOS PERSONALES --- */}
          <h2 className={styles.sectionTitle}> Datos Personales</h2>
          <div className={styles.row}>
            <FormField label="Apellido *">
              <input
                name="apellido"
                placeholder="INGRESE UN APELLIDO..."
                value={form.apellido || huesped?.apellido || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("apellido") && <span className={styles.errorMessage}>{getError("apellido")}</span>}
            </FormField>

            <FormField label="Nombre *">
              <input
                name="nombre"
                placeholder="INGRESE UN NOMBRE..."
                value={form.nombre || huesped?.nombre || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("nombre") && <span className={styles.errorMessage}>{getError("nombre")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Nro. documento *">
              <input
                name="documento"
                placeholder="INGRESE UN NÚMERO DE DOCUMENTO..."
                value={form.documento || huesped?.documento || ""}
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("documento") ? "red" : undefined }}
              />
              {hasError("documento") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("documento")}</span>}
            </FormField>

            <FormField label="Tipo de Documento *">
              <select
                name="tipoDocumento"
                value={form.tipoDocumento || huesped?.tipoDocumento || ""}
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("tipoDocumento") ? "red" : undefined }}
              >
                <option value="">SELECCIONE...</option>
                <option>DNI</option>
                <option>LE</option>
                <option>LC</option>
                <option>PASAPORTE</option>
                <option>OTRO</option>
              </select>
              {hasError("tipoDocumento") && <span style={{ color:'red', fontSize:'0.8rem'}}>Este campo es obligatorio</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="CUIT">
              <input
                name="cuit"
                placeholder="INGRESE UN CUIT..."
                value={form.cuit || huesped?.cuit || ""}
                onChange={onChange}
              />
            </FormField>

            <FormField label="Nacionalidad *">
              <select
                name="nacionalidad"
                value={form.nacionalidad || huesped?.nacionalidad || ""}
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("nacionalidad") ? "red" : undefined }}
              >
                <option value="">SELECCIONE...</option>
                {paisesAmerica.map((pais) => (
                  <option key={pais} value={pais.toUpperCase()}>{pais}</option>
                ))}
              </select>
              {hasError("nacionalidad") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("nacionalidad")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Fecha de Nacimiento *">
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento || huesped?.fechaNacimiento || ""}
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("fechaNacimiento") ? "red" : undefined }}
              />
              {hasError("fechaNacimiento") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("fechaNacimiento")}</span>}
            </FormField>
          </div>

          {/* --- DIRECCIÓN --- */}
          <h2 className={styles.sectionTitle}> Dirección </h2>
          <div className={styles.row}>
            <FormField label="Pais *">
              <input
                name="pais"
                placeholder="INGRESE UN PAIS..."
                value={form.direccion?.pais || huesped?.direccion?.pais || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("pais") ? "red" : undefined }}
              />
              {hasError("pais") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("pais")}</span>}
            </FormField>

            <FormField label="Provincia *">
              <input
                name="provincia"
                placeholder="INGRESE UNA PROVINCIA..."
                value={form.direccion?.provincia || huesped?.direccion?.provincia || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("provincia") ? "red" : undefined }}
              />
              {hasError("provincia") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("provincia")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Ciudad *">
              <input
                name="ciudad"
                placeholder="INGRESE UNA CIUDAD..."
                value={form.direccion?.ciudad || huesped?.direccion?.ciudad || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("ciudad") ? "red" : undefined }}
              />
              {hasError("ciudad") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("ciudad")}</span>}
            </FormField>

            <FormField label="Código Postal *">
              <input
                name="codigoPostal"
                placeholder="INGRESE UN CÓDIGO POSTAL..."
                value={form.direccion?.codigoPostal || huesped?.direccion?.codigoPostal || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("codigoPostal") ? "red" : undefined }}
              />
              {hasError("codigoPostal") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("codigoPostal")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Calle *">
              <input
                name="calle"
                placeholder="INGRESE UNA CALLE..."
                value={form.direccion?.calle || huesped?.direccion?.calle || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("calle") ? "red" : undefined }}
              />
              {hasError("calle") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("calle")}</span>}
            </FormField>

            <FormField label="Número *">
              <input
                name="numero"
                placeholder="INGRESE UN NÚMERO..."
                value={form.direccion?.numero || huesped?.direccion?.numero || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("numero") ? "red" : undefined }}
              />
              {hasError("numero") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("numero")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Piso">
              <input
                name="piso"
                placeholder="INGRESE UN PISO..."
                value={form.direccion?.piso || huesped?.direccion?.piso || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
              />
            </FormField>

            <FormField label="Departamento">
              <input
                name="departamento"
                placeholder="INGRESE UN DEPARTAMENTO..."
                value={form.direccion?.departamento || huesped?.direccion?.departamento || ""}
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
              />
            </FormField>
          </div>

          {/* --- INFORMACIÓN LABORAL --- */}
          <h2 className={styles.sectionTitle}> Información Laboral </h2>
          <div className={styles.row}>
            <FormField label="Posición Frente al IVA *">
              <input
                name="posicionIVA"
                placeholder="INGRESE UNA POSICIÓN..."
                value={form.posicionIVA || huesped?.posicionIVA || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("posicionIVA") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("posicionIVA")}</span>}
            </FormField>

            <FormField label="Ocupación *">
              <input
                name="ocupacion"
                placeholder="INGRESE UNA OCUPACIÓN..."
                value={form.ocupacion || huesped?.ocupacion || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("ocupacion") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("ocupacion")}</span>}
            </FormField>
          </div>

          {/* --- CONTACTO --- */}
          <h2 className={styles.sectionTitle}> Contacto </h2>
          <div className={styles.row}>
            <FormField label="Teléfono *">
              <input
                name="telefono"
                placeholder="INGRESE UN TELÉFONO..."
                value={form.telefono || huesped?.telefono || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("telefono") && <span style={{ color:'red', fontSize:'0.8rem'}}>{getError("telefono")}</span>}
            </FormField>

            <FormField label="Email">
              <input
                name="email"
                placeholder="INGRESE UN EMAIL..."
                value={form.email || huesped?.email || ""}
                onChange={onChange}
                onBlur={onBlur}
              />
            </FormField>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" form="formHuesped">Siguiente</Button>
            <Button type="button" onClick={onCancel}>Cancelar</Button>
            {onDelete && <Button type="button" onClick={onDelete} style={{ background: 'red' }}>Borrar</Button>}
          </div>

        </form>
      </main>
    </div>
  );
}