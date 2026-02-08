"use client";
import styles from "./listadoOcupantes.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";
import React from "react";
export type SeleccionResponsable = Ocupante | "TERCERO";

export interface Ocupante {
  id: number;
  nombre: string;
  dni: string;
  edad: number;
}

interface Props {
  ocupantes: Ocupante[];
  seleccionado: SeleccionResponsable | null;
  onSelect: (ocupante: SeleccionResponsable) => void;
  onCancel: () => void;
  onAccept: () => void;
  mostrarBotones?: boolean;
  children?: React.ReactNode;
}

export default function ListadoOcupantes({
  ocupantes,
  seleccionado,
  onSelect,
  onCancel,
  onAccept,
  children,
  mostrarBotones = true,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.titleWrapper}>
        <Title>Ocupantes de la habitación</Title>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Edad</th>
          </tr>
        </thead>

        <tbody>
          {ocupantes.map((o) => (
            <tr key={o.id}>
              <td>
                <input
                  type="radio"
                  checked={seleccionado !== "TERCERO" && seleccionado?.id === o.id}
                  onChange={() => onSelect(o)}
                />
              </td>
              <td>{o.nombre}</td>
              <td>{o.dni}</td>
              <td>{o.edad}</td>
            </tr>
          ))}
          <tr className={styles.terceroRow}>
           <td>
            <input
             type="radio"
             checked={seleccionado === "TERCERO"}
             onChange={() => onSelect("TERCERO")}
             />
           </td>
           <td colSpan={3}>
             <strong>Un tercero</strong>
           </td>
         </tr>
        </tbody>
      </table>

      {children}

      {mostrarBotones && (
        <div className={styles.buttonContainer}>
          <Button type="button" onClick={onCancel}>
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={onAccept}
            disabled={!seleccionado}
          >
            Aceptar
          </Button>
        </div>
      )}


    </div>
  );
}
