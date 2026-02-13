"use client";
import React, { useState } from "react";
import styles from "./listadoResultadosResponsable.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

export default function ListadoResultadosResponsable({ datos, onSeleccion, onSiguiente, onVolver }: any) {
  const [localSelect, setLocalSelect] = useState<number | null>(null);

  const handleSelect = (item: any) => {
    setLocalSelect(item.id);
    onSeleccion(item);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
          <Title>Busqueda de Responsable de Pago</Title>
        </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "50px" }}></th>
            <th>Razón Social</th>
            <th>CUIT</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item: any) => (
            <tr
              key={item.id}
              className={localSelect === item.id ? styles.selectedRow : ""}
              onClick={() => handleSelect(item)}
            >
              <td className={styles.radioCell}>
                <input
                  type="radio"
                  name="responsableSelection"
                  checked={localSelect === item.id}
                  readOnly
                />
              </td>
              <td>{item.razonSocial}</td>
              <td>{item.cuit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.buttonGroup}>
        <Button onClick={onVolver}>VOLVER</Button>
        <Button onClick={onSiguiente}>SIGUIENTE</Button>
      </div>
    </div>
  );
}