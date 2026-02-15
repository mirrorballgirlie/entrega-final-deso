"use client";
import React, { useState } from "react";
import styles from "./listadoResponsables.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

interface Responsable {
  id: number;
  razonSocial: string;
  cuit: string;
}

interface Props {
  datos: Responsable[];
  onSiguiente: (id: number | null) => void;
  onVolver: () => void;
}

export default function ListadoResponsablesBusqueda({ datos, onSiguiente, onVolver }: Props) {
  const [seleccionado, setSeleccionado] = useState<Responsable | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
      <Title>Responsables de Pago</Title>
       </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Razón Social</th>
              <th>CUIT</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(datos) ? datos : []).map((r) => (
              <tr
                key={r.id}
                className={seleccionado?.id === r.id ? styles.selectedRow : ""}
                onClick={() => setSeleccionado(r)} //guarda el obj completo!!!
              >
                <td>
                  <input
                    type="radio"
                    name="responsable"
                    checked={seleccionado?.id === r.id}
                    onChange={() => setSeleccionado(r)}
                  />
                </td>
                <td>{r.nombreRazonSocial || r.razonSocial || "Sin nombre"}</td>
                <td>{r.cuit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onVolver}>VOLVER</Button>
        <Button onClick={() => onSiguiente(seleccionado)}> SIGUIENTE </Button>
      </div>
    </div>
  );
}