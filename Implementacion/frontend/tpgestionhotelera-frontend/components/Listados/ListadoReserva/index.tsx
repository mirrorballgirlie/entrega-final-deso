"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./listado-reserva.module.css";
import PopupThreeOptions from "@/components/PopupThreeOptions";

interface ReservationData {
  startDate: string;
  endDate: string;
  rooms: string[]; // Estos son los IDs (para el backend)
  roomType?: string;
  selectedData?: { [key: string]: string[] }; 
}

export default function ListadoReserva() { 
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [data, setData] = useState<ReservationData | null>(null);
  
  const [mode, setMode] = useState<"reservar" | "ocupar">("reservar"); 

  useEffect(() => {
    const storedData = sessionStorage.getItem("reservationData");
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } else {
      console.error("No se encontraron datos de reserva");
      router.push("/ocupar-habitacion/grilla"); 
    }
    
    if (window.location.pathname.includes("ocupar")) {
      setMode("ocupar");
    }
  }, [router]);

  const handleAccept = () => {
    if (!data) return;

    if (mode === "reservar") {
      router.push("/estado-habitaciones2/Formulario");
    } else {
      setShowPopup(true);
    }
  };

  const handleReject = () => {
    router.back();
  };

  const handleCancelar = () => {
    setShowPopup(false);
  };

  const handleSeguirCargando = () => {
    router.push("/ocupar-habitacion/formulario-huesped");
  };

  const handleCargarOtraHabitacion = () => {
    router.push("/ocupar-habitacion/grilla");
  };

  if (!data) {
    return <div className={styles["reservation-container"]}>Cargando datos de la reserva...</div>;
  }

 
  const habitacionesParaMostrar = data.selectedData 
    ? Object.keys(data.selectedData) 
    : data.rooms;

  return (
    <>
      <div className={styles["reservation-wrapper"]}>
        <div className={styles["reservation-header"]}>
          <button onClick={() => router.back()} className={styles["btn-back"]}>
            ← Volver
          </button>
          <h1 className={styles["reservation-title"]}>Listado de la reserva</h1>
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
              {/* Iteramos sobre los NÚMEROS visuales, no sobre los IDs */}
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
            <button onClick={handleReject} className={styles["btn-reject"]}>
              Rechazar
            </button>

            <button onClick={handleAccept} className={styles["btn-accept"]}>
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <PopupThreeOptions
          message="¿Qué desea realizar a continuación?"
          option1Text="Cancelar"
          option2Text="Seguir cargando"
          option3Text="Cargar otra habitación"
          onOption1={handleCancelar}
          onOption2={handleSeguirCargando}
          onOption3={handleCargarOtraHabitacion}
        />
      )}
    </>
  );
}