"use client";

import styles from "./listado-reserva.module.css";

// Definimos la estructura de datos que viene del Padre
interface WizardData {
  startDate: string;
  endDate: string;
  rooms: string[]; // IDs
  selectedData?: { [key: string]: string[] }; // Para mostrar números
}

interface ListadoReservaProps {
  data: WizardData; // Recibe los datos por props
  onBack: () => void;
  onNext: () => void; // Avanza al formulario de encargado
}

export default function ListadoReserva({ data, onBack, onNext }: ListadoReservaProps) {
  
  // Lógica para mostrar números en lugar de IDs
  const habitacionesParaMostrar = data.selectedData 
    ? Object.keys(data.selectedData) 
    : data.rooms;

  return (
    <div className={styles["reservation-wrapper"]}>
      <div className={styles["reservation-header"]}>
        <button onClick={onBack} className={styles["btn-back"]}>
          ← Volver
        </button>
        <h1 className={styles["reservation-title"]}>Resumen de Reserva</h1>
      </div>

      <div className={styles["reservation-container"]}>
        <table className={styles["reservation-table"]}>
          <thead>
            <tr>
              <th>Habitación</th>
              <th>Ingreso</th>
              <th>Egreso</th>
            </tr>
          </thead>
          <tbody>
            {habitacionesParaMostrar.map((roomNumber) => (
              <tr key={roomNumber}>
                <td>{roomNumber}</td>
                <td>{data.startDate}</td>
                <td>{data.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles["reservation-buttons"]}>
          <button onClick={onBack} className={styles["btn-reject"]}>
            Modificar
          </button>

          <button onClick={onNext} className={styles["btn-accept"]}>
            Confirmar y Cargar Datos
          </button>
        </div>
      </div>
    </div>
  );
}