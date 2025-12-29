"use client";

import { useState } from "react";
import styles from "./listado-reserva.module.css";
import Toast from "@/components/Toast"; 
import Button from "@/components/Button";

interface WizardData {
  startDate: string;
  endDate: string;
  rooms: string[]; 
  selectedData?: { [key: string]: string[] };
}

interface ListadoReservaProps {
  data: WizardData;
  onBack: () => void;   
  onCancel: () => void; 
  onNext: () => void;   
}

export default function ListadoReserva({ data, onBack, onCancel, onNext }: ListadoReservaProps) {
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("warning");

  const habitacionesParaMostrar = data.selectedData 
    ? Object.keys(data.selectedData) 
    : data.rooms;

  const handleReject = () => {
    setToastMsg("Operación Cancelada");
    setToastType("warning");
    setShowToast(true);

    setTimeout(() => {
        onCancel();
    }, 1500);
  };

  return (
    <div className={styles["reservation-wrapper"]}>
      <Toast message={toastMsg} isVisible={showToast} type={toastType} />

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
          {/* BOTÓN RECHAZAR */}
          <Button 
            onClick={handleReject} 
            className={styles["btn-reject"]} 
           
          >
            Rechazar
          </Button>

          {/* BOTÓN ACEPTAR */}
          <Button onClick={onNext} className={styles["btn-accept"]}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}