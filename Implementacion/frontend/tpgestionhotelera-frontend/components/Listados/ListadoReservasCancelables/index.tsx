"use client";
import  styles from "./listadoReservasCancelables.module.css";
import Button from "@/components/Button";
import Title from "@/components/Title";
import { useState } from "react";

export interface Reserva {
  id: number;
  apellido: string;
  nombre: string;
  numero: number;
  tipoHabitacion: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface Props {
  reservas: Reserva[];
  onAccept: (reserva: Reserva[]) => void;
  onCancel: () => void;
}

export default function ListadoCancelarReserva({

  reservas,
  onAccept,
  onCancel,
}: Props) {

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  const reservasSeleccionadas = reservas.filter(r =>
    seleccionadas.includes(r.id)
  );

  return (
    <div className={styles.wrapper}>

      <header className={styles.titleWrapper}>
        <Title>Reservas Encontradas</Title>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Apellido</th>
            <th>Nombres</th>
            <th>Habitación</th>
            <th>Tipo</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
          </tr>
        </thead>

        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>
                <input
                type="checkbox"
                checked={seleccionadas.includes(r.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSeleccionadas([...seleccionadas, r.id]);
                    } else {
                      setSeleccionadas(
                        seleccionadas.filter((id) => id !== r.id)
                      );
                    }
                  }}
                /> 
              </td>
              <td>{r.apellido}</td>
              <td>{r.nombre}</td>
              <td>{r.numero}</td>
              <td>{r.tipoHabitacion}</td>
              <td>{r.fechaDesde}</td>
              <td>{r.fechaHasta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.buttonContainer}>
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          type="button"
          disabled={seleccionadas.length === 0}
          onClick={() => onAccept(reservasSeleccionadas)}
        >
          Aceptar
        </Button>


      </div>
    </div>
  );
}
