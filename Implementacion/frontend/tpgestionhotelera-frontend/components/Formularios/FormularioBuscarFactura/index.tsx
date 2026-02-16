"use client";
import React, { useState } from "react";
import styles from "./formularioBuscarFactura.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

interface Props {
  onBuscar: (filtros: any) => void;
  onCancelar: () => void;
}

export default function FormularioBuscarFactura({ onBuscar, onCancelar }: Props) {
  const [filtros, setFiltros] = useState({
    cuit: "",
    tipoDoc: "DNI",
    nroDoc: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
    if (error) setError(""); // Limpiamos el error al escribir
  };

  const handleSubmit = () => {
    // Punto 2.1: Validación de filtros (CUIT o Tipo+Nro)
    const tieneCuit = filtros.cuit.trim() !== "";
    const tieneDoc = filtros.nroDoc.trim() !== "";

    if (!tieneCuit && !tieneDoc) {
      setError("DEBE COMPLETAR CUIT O TIPO Y NRO DE DOCUMENTO PARA BUSCAR");
      return;
    }

    onBuscar(filtros);
  };

  return (
    <div className={styles.container}>
      <Title>Ingresar Nota de Credito</Title>

      <div className={styles.formCard}>
        <p className={styles.instruction}>
          Ingrese los datos del responsable para buscar facturas pendientes:
        </p>

        <div className={styles.field}>
          <label className={styles.label}>CUIT</label>
          <input
            name="cuit"
            className={styles.input}
            placeholder="00-00000000-0"
            value={filtros.cuit}
            onChange={handleChange}
          />
        </div>

        <div className={styles.divider}>
          <span>O BIEN</span>
        </div>

        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label className={styles.label}>Tipo Doc.</label>
            <select
              name="tipoDoc"
              className={styles.select}
              value={filtros.tipoDoc}
              onChange={handleChange}
            >
              <option value="DNI">DNI</option>
              <option value="PASAPORTE">PASAPORTE</option>
              {/* <option value="CEDULA">CÉDULA</option> */}
              <option value="LE">LIBRETA ELECTORAL</option>
              <option value="LC">LIBRETA CIVICA</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>

          <div className={styles.field} style={{ flex: 2 }}>
            <label className={styles.label}>Nro. Documento</label>
            <input
              name="nroDoc"
              className={styles.input}
              placeholder="Ej: 12345678"
              value={filtros.nroDoc}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Button onClick={onCancelar}>CANCELAR</Button>
          <Button onClick={handleSubmit}>BUSCAR</Button>
        </div>
      </div>
    </div>
  );
}