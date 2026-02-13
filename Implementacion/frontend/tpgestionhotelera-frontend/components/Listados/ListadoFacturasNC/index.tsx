"use client";
import React, { useState } from "react";
import styles from "./listadoFacturasNC.module.css";
import Button from "@/components/Button";

interface Factura {
  id: string;
  numeroFactura: string;
  fechaConfeccion: string;
  importeNeto: number;
  iva: number;
  total: number;
}

interface Props {
  facturas: Factura[];
  onAceptar: (seleccionadas: Factura[]) => void;
  onCancelar: () => void;
}

export default function ListadoSeleccionFacturasNC({ facturas, onAceptar, onCancelar }: Props) {
  const [seleccionadas, setSeleccionadas] = useState<Factura[]>([]);

  const handleToggle = (f: Factura) => {
    const existe = seleccionadas.find(item => item.id === f.id);
    if (existe) {
      setSeleccionadas(seleccionadas.filter(item => item.id !== f.id));
    } else {
      setSeleccionadas([...seleccionadas, f]);
    }
  };

  const totales = seleccionadas.reduce((acc, f) => ({
    neto: acc.neto + f.importeNeto,
    iva: acc.iva + f.iva,
    total: acc.total + f.total
  }), { neto: 0, iva: 0, total: 0 });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Seleccione Facturas para Nota de Crédito</h2>

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Sel.</th>
            <th>Nro Factura</th>
            <th>Fecha</th>
            <th>Neto</th>
            <th>IVA</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((f) => (
            <tr key={f.id} className={styles.row}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleToggle(f)}
                  checked={seleccionadas.some(s => s.id === f.id)}
                />
              </td>
              <td>{f.numeroFactura}</td>
              <td>{f.fechaConfeccion}</td>
              <td>${f.importeNeto.toLocaleString()}</td>
              <td>${f.iva.toLocaleString()}</td>
              <td style={{ fontWeight: "bold" }}>${f.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.resumenBox}>
        <div className={styles.resumenItem}>Total Neto: <span>${totales.neto.toLocaleString()}</span></div>
        <div className={styles.resumenItem}>Total IVA: <span>${totales.iva.toLocaleString()}</span></div>
        <div className={styles.resumenTotal}>TOTAL A ANULAR: <span>${totales.total.toLocaleString()}</span></div>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onCancelar}>CANCELAR</Button>
        <Button
          onClick={() => onAceptar(seleccionadas)}
          disabled={seleccionadas.length === 0}
        >
          ACEPTAR
        </Button>
      </div>
    </div>
  );
}