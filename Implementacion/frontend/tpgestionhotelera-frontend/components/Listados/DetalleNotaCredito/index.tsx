"use client";
import React from "react";
import styles from "./detalleNotaCredito.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

interface NCData {
  nroNotaCredito: string;
  responsablePago: string;
  importeNeto: number;
  iva: number;
  importeTotal: number;
}

interface Props {
  datos: NCData;
  onFinalizar: () => void;
}

export default function DetalleNotaCredito({ datos, onFinalizar }: Props) {
  return (
    <div className={styles.container}>
      <Title>Detalle Nota Credito</Title>

      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.subtitle}>Comprobante Confeccionado</h3>
          <p className={styles.ncNumber}>{datos.nroNotaCredito}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.infoGroup}>
            <label className={styles.label}>Responsable de Pago</label>
            <p className={styles.value}>{datos.responsablePago}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalsSection}>
            <div className={styles.totalRow}>
              <span>Importe Neto:</span>
              <span>${datos.importeNeto.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>IVA:</span>
              <span>${datos.iva.toLocaleString()}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>IMPORTE TOTAL:</span>
              <span>${datos.importeTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p className={styles.successText}>La operación ha culminado con éxito.</p>
          <div className={styles.btnContainer}>
            <Button onClick={onFinalizar}>ACEPTAR</Button>
          </div>
        </footer>
      </div>
    </div>
  );
}