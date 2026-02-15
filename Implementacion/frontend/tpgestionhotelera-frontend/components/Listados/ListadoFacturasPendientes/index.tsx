"use client";
//ESTE ES EL LISTADO DE FACTURAS PENDIENTES PARA PAGO
import React from "react";
import styles from "./listadoFacturasPendientes.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

interface Props {
  facturas: any[];
  onSeleccionar: (f: any) => void;
  onBack: () => void;
}

export default function ListadoFacturasPendientes({ facturas, onSeleccionar, onBack }: Props) {
  return (
    <div className={styles.container}>
      <h2 style={{
        fontFamily: "Sans Serif",
        textAlign: "center",
        color: "#374375",
        fontSize: "40px",

      }}>
        Comprobantes Pendientes de Pago
      </h2>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Nro Factura</th>
            <th>Responsable</th>
            <th>Total a Pagar</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id} className={styles.row}>
              <td className={styles.cell}>{f.nombre}</td>
              <td className={styles.cell}>{f.nombreResponsable}</td>
              <td className={styles.cell} style={{ fontWeight: "bold" }}>
                ${f.total.toLocaleString()}
              </td>
              <td className={styles.cell}>
                <Button onClick={() => onSeleccionar(f)}>
                  Seleccionar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.btnContainer}>
        <Button onClick={onBack}>
          Volver a buscar
        </Button>
      </div>
    </div>
  );
}