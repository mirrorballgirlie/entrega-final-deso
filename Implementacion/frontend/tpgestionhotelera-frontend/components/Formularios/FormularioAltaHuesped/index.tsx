"use client";
import React from "react";
import styles from "./alta.module.css"; // Ajusta la ruta a tu CSS
import FormField from "@/components/FormField";
import Title from "@/components/Title";
import Button from "@/components/Button";
import { get } from "http";

const paisesAmerica = ["Argentina", "Bolivia", "Brasil", "Canadá", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Ecuador", "El Salvador", "Estados Unidos", "Granada", "Guatemala", "Guyana", "Haití", "Honduras", "Jamaica", "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana", "San Cristóbal y Nieves", "San Vicente y las Granadinas", "Santa Lucía", "Surinam", "Trinidad y Tobago", "Uruguay", "Venezuela"];

interface Props {
  form: any;   // Tus datos

  // Ahora errors es un objeto que mapea nombre de campo → mensaje de error
  errors: { [field: string]: string };

  // Funciones para manejar los inputs
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onChangeDireccion: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlurDireccion: (e: React.FocusEvent<HTMLInputElement>) => void;

  // Botones
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}


export default function FormularioAltaHuesped({ 
  form, errors, onChange, onChangeDireccion, onBlur, onBlurDireccion, onSubmit, onCancel 
}: Props) {


  //lo anterior:
  // Helper para mantener tu lógica de "errors.includes(...)"
  //const hasError = (field: string) => errors.includes(field);

  //lo nuevo:
  // Devuelve true si hay error en el campo
  const hasError = (field: string) => !!errors[field];
  // Devuelve el mensaje de error real
  const getError = (field: string) => errors[field];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Title>Dar de alta Huesped</Title>
      </header>

      <main className={styles.mainContent}>
        
        {/* Tu lista de errores global (si la usas) */}
        {/* {errors.length > 0} */}

        <form id="formHuesped" className={styles.form} onSubmit={onSubmit}>
          
          {/* --- DATOS PERSONALES --- */}
          <h2 className={styles.sectionTitle}> Datos Personales</h2>

          <div className={styles.row}>
            <FormField label="Apellido *">
              <input 
                name="apellido" 
                placeholder="INGRESE UN APELLIDO..." 
                value={form.apellido} 
                onChange={onChange}
                onBlur={onBlur} 
              />
              {hasError("apellido") && (
                <span className={styles.errorMessage}>{getError("apellido")}</span>
              )}
            </FormField>

            <FormField label="nombre *">
              <input 
                name="nombre" 
                placeholder="INGRESE UN NOMBRE..." 
                value={form.nombre} 
                onChange={onChange}
                onBlur={onBlur}
              />
              {hasError("nombre") && (
                <span className={styles.errorMessage}>{getError("nombre")}</span>
              )}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Nro. documento *">
              <input 
                name="documento" 
                placeholder="INGRESE UN NÚMERO DE DOCUMENTO..." 
                value={form.documento} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("documento") ? "red" : undefined }}
              />
              {hasError("documento") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("documento")}</span>}
            </FormField>

            <FormField label="Tipo de Documento *">
              <select 
                name="tipoDocumento" 
                value={form.tipoDocumento} 
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
              {hasError("tipoDocumento") && <span style={{ color: 'red', fontSize: '0.8rem' }}>Este campo es obligatorio</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="CUIT">
              <input name="cuit" placeholder="INGRESE UN CUIT..." value={form.cuit} onChange={onChange} />
            </FormField>

            <FormField label="Nacionalidad *">
              <select 
                name="nacionalidad" 
                value={form.nacionalidad} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("nacionalidad") ? "red" : undefined }}
              >
                <option value="">SELECCIONE...</option>
                {paisesAmerica.map((pais) => (
                  <option key={pais} value={pais.toUpperCase()}>{pais}</option>
                ))}
              </select>
              {hasError("nacionalidad") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("nacionalidad")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Fecha de Nacimiento *">
              <input 
                type="date" 
                placeholder="--/--/----" 
                name="fechaNacimiento" 
                value={form.fechaNacimiento} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("fechaNacimiento") ? "red" : undefined }}
              />
              {hasError("fechaNacimiento") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("fechaNacimiento")}</span>}
            </FormField>
          </div>

          {/* --- DATOS DE DIRECCIÓN --- */}
          <h2 className={styles.sectionTitle}> Direccion </h2>

          <div className={styles.row}>
            <FormField label="Pais *">
              <input 
                name="pais" 
                placeholder="INGRESE UN PAIS..." 
                value={form.direccion.pais} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("pais") ? "red" : undefined }}
              />
              {hasError("pais") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("pais")}</span>}
            </FormField>

            <FormField label="Provincia *">
              <input 
                name="provincia" 
                placeholder="INGRESE UNA PROVINCIA..." 
                value={form.direccion.provincia} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("provincia") ? "red" : undefined }}
              />
              {hasError("provincia") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("provincia")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Ciudad *">
              <input 
                name="ciudad" 
                placeholder="INGRESE UNA CIUDAD..." 
                value={form.direccion.ciudad} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("ciudad") ? "red" : undefined }}
              />
              {hasError("ciudad") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("ciudad")}</span>}
            </FormField>

            <FormField label="Codigo Postal *">
              <input 
                name="codigoPostal" 
                placeholder="INGRESE UN CODIGO POSTAL..." 
                value={form.direccion.codigoPostal} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("codigoPostal") ? "red" : undefined }}
              />
              {hasError("codigoPostal") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("codigoPostal")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Calle *">
              <input 
                name="calle" 
                placeholder="INGRESE UNA CALLE..." 
                value={form.direccion.calle} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("calle") ? "red" : undefined }}
              />
              {hasError("calle") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("calle")}</span>}
            </FormField>

            <FormField label="Numero *">
              <input 
                name="numero" 
                placeholder="INGRESE UN NUMERO..." 
                value={form.direccion.numero} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("numero") ? "red" : undefined }}
              />
              {hasError("numero") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("numero")}</span>}
            </FormField>
          </div>

          <div className={styles.row}>
            <FormField label="Piso ">
              <input 
                name="piso" 
                placeholder="INGRESE UN PISO..." 
                value={form.direccion.piso} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("piso") ? "red" : undefined }}
              />
              {hasError("piso") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("piso")}</span>}
            </FormField>

            <FormField label="Departamento ">
              <input 
                name="departamento" 
                placeholder="INGRESE UN DEPARTAMENTO..." 
                value={form.direccion.departamento} 
                onChange={onChangeDireccion}
                onBlur={onBlurDireccion}
                style={{ borderColor: hasError("departamento") ? "red" : undefined }}
              />
              {hasError("departamento") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("departamento")}</span>}
            </FormField>
          </div>

          {/* --- INFORMACION LABORAL --- */}
          <h2 className={styles.sectionTitle}> Informacion Laboral</h2>

          <div className={styles.row}>
            <FormField label="Posición Frente al IVA *">
              <input 
                name="posicionIVA" 
                placeholder="INGRESE UNA POSICIÓN..." 
                value={form.posicionIVA} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("posicionIVA") ? "red" : undefined }}
              />
              {hasError("posicionIVA") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("posicionIVA")}</span>}
            </FormField>

            <FormField label="Ocupación *">
              <input 
                name="ocupacion" 
                placeholder="INGRESE UNA OCUPACIÓN..." 
                value={form.ocupacion} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("ocupacion") ? "red" : undefined }}
              />
              {hasError("ocupacion") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("ocupacion")}</span>}
            </FormField>
          </div>

          {/* --- CONTACTO --- */}
          <h2 className={styles.sectionTitle}> Contacto</h2>

          <div className={styles.row}>
            <FormField label="Telefono *">
              <input 
                name="telefono" 
                placeholder="INGRESE UN TELEFONO..." 
                value={form.telefono} 
                onChange={onChange}
                onBlur={onBlur}
                style={{ borderColor: hasError("telefono") ? "red" : undefined }}
              />
              {hasError("telefono") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("telefono")}</span>}
            </FormField>

            <FormField label="Email ">
              <input name="email" placeholder="INGRESE UN EMAIL..." value={form.email} onChange={onChange} onBlur={onBlur} />
              {hasError("email") && <span style={{ color: 'red', fontSize: '0.8rem' }}>{getError("email")}</span>}
            </FormField>
          </div>

          <div className={styles.buttonContainer}>
            <Button type="submit" form="formHuesped">Siguiente</Button>
            <Button type="button" onClick={onCancel}>Cancelar</Button>
          </div>
        </form>
      </main>
    </div>
  );
}