"use client";
import styles from "./formularioFacturarCheckout.module.css";
import FormField from "@/components/FormField";
import Button from "@/components/Button";
import Title from "@/components/Title";
import React from "react";

interface Props {
  form: {
    numeroHabitacion: string;
    horaSalida: string;
  };
  errors: {
    numeroHabitacion?: string;
    horaSalida?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //onSubmit: (e: React.FormEvent) => void;   me daba error este onSubmit en el manager
//   La diferencia es:

// La primera versión es más genérica y no permite async.

// La segunda versión es específica para formularios HTML en React y permite funciones async.

// En nuestro caso de uso necesitamos async porque hacemos llamadas al backend.

// Por eso debemos tipar el onSubmit como:

// (e: React.FormEvent<HTMLFormElement>) => void | Promise<void> 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel: () => void;
}

export default function FormularioFacturarCheckout({
  form,
  errors,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.titleWrapper}>
        <Title>Facturar Checkout</Title>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        <FormField label="Número de habitación">
          <input

            name="numeroHabitacion"
            value={form.numeroHabitacion}
            onChange={onChange}
            placeholder="INGRESE NÚMERO DE HABITACIÓN"
          />

          {errors.numeroHabitacion && (
            <span className={styles.error}>{errors.numeroHabitacion}</span>
          )}
        </FormField>

        <FormField label="Hora de salida">
          <input

            type="time"
            name="horaSalida"
            value={form.horaSalida}
            onChange={onChange}
          />
          {errors.horaSalida && (
            <span className={styles.error}>{errors.horaSalida}</span>
          )}
        </FormField>

        <div className={styles.buttonContainer}>
          <Button type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Aceptar</Button>
        </div>
      </form>
    </div>
  );
}

