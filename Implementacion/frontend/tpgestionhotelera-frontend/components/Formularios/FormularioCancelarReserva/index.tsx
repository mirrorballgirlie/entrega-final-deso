"use client";
import styles from "./formularioCancelarReserva.module.css";
import FormField from "@/components/FormField";
import Title from "@/components/Title";
import Button from "@/components/Button";
import React from "react";

interface Props {
  form: {
    apellido: string;
    nombres: string;
  };
  errors: {
    apellido?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}


export default function FormularioCancelarReserva({
  form,
  errors,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
const hasError = (field: keyof typeof errors) => !!errors[field];
const getError = (field: keyof typeof errors) => errors[field];
  
  return (
    <div className={styles.wrapper}>
      <header className={styles.titleWrapper}>
        <Title>Cancelar Reserva</Title>
      </header>

      <main className={styles.mainContent}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.row}>
            <FormField label="Apellido *">
              <input
                name="apellido"
                value={form.apellido}
                onChange={onChange}
                placeholder="INGRESE APELLIDO..."
              />
              {hasError("apellido") && (
                <span className={styles.error}>
                  {getError("apellido")}
                </span>
              )}
            </FormField>

            <FormField label="Nombres">
              <input
                name="nombres"
                value={form.nombres}
                onChange={onChange}
                placeholder="INGRESE NOMBRES..."
              />
            </FormField>
          </div>

          <div className={styles.buttonContainer}>
             <Button type="submit">Siguiente</Button>
             <Button type="button" onClick={onCancel}>
              Cancelar
              </Button>
          </div>

        </form>
      </main>
    </div>
  );
}
