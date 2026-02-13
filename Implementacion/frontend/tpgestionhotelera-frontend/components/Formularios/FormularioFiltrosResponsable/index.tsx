"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./formularioFiltrosResponsable.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";

export default function FormularioFiltrosResponsable({ onBuscar }: any) {
  const [filtros, setFiltros] = useState({ razonSocial: "", cuit: "" });
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <Title>
          Busqueda de Responsable de Pago
        </Title>
      </div>

      <div className={styles.formCard}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Razón Social</label>
            <input
              className={styles.input}
              placeholder="Ej: Tech Solutions S.A."
              value={filtros.razonSocial}
              onChange={(e) => setFiltros({ ...filtros, razonSocial: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>CUIT</label>
            <input
              className={styles.input}
              placeholder="00-00000000-0"
              value={filtros.cuit}
              onChange={(e) => setFiltros({ ...filtros, cuit: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button onClick={() => router.push("/home")}>CANCELAR</Button>
          <Button onClick={() => onBuscar(filtros)}>SIGUIENTE</Button>

        </div>
      </div>
    </div>
  );
}