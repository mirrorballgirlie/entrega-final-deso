"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./formulario.module.css"; 
import Button from "@/components/Button";

interface ReservationData {
  rooms: string[];
  startDate: string;
  endDate: string;
  roomType: string;
}

export default function ReservationFormPage() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);

  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    telefono: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // 🔹 Cargar info de sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("reservationData");
    if (!data) {
      router.push("/");
      return;
    }
    setReservationData(JSON.parse(data));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.apellido || !formData.nombre || !formData.telefono) {
  //     alert("Por favor completa todos los campos");
  //     return;
  //   }

  //   if (!reservationData) return;

  //   try {
  //     // 🔹 CAMBIO CLAVE:
  //     // Como 'ReservaDTO' es un objeto singular pero tenemos varias habitaciones,
  //     // creamos un ARRAY de objetos ReservaDTO, uno por cada habitación seleccionada.
      
  //     const payload = reservationData.rooms.map((roomNumber) => ({
  //       numero: Number(roomNumber), // Asignamos el número de habitación al campo 'numero' del DTO
  //       fechaDesde: reservationData.startDate, // Ya viene en YYYY-MM-DD
  //       fechaHasta: reservationData.endDate,   // Ya viene en YYYY-MM-DD
  //       nombre: formData.nombre.toUpperCase(),
  //       apellido: formData.apellido.toUpperCase(),
  //       telefono: formData.telefono,
  //       // 'estado': No lo enviamos, dejamos que el backend lo asigne por defecto (ej. RESERVADA)
  //     }));

  //     console.log("🛑 DETECTIVE - DATOS ENVIADOS:", JSON.stringify(payload, null, 2));

  //     // Nota: Verifica si tu Controller en Spring Boot espera una lista (@RequestBody List<ReservaDTO>)
  //     // o un solo objeto. Dado que seleccionas varias habitaciones, debería esperar una lista.
      
  //     const base = process.env.NEXT_PUBLIC_API_BASE || ""; 
  //     const response = await fetch(`${base}/api/reservas/confirmar`, { // Ajusta la URL si es necesario
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload), // Enviamos el Array
  //     });

  //     if (!response.ok) {
  //       // Intentamos leer el mensaje de error del backend si existe
  //       const errorText = await response.text(); 
  //       throw new Error(errorText || `Error: ${response.status}`);
  //     }

  //     setShowSuccess(true);
  //     sessionStorage.removeItem("reservationData");

  //     setTimeout(() => router.push("/"), 2000);
  //   } catch (error: any) {
  //     console.error("Error submitting reservation:", error);
  //     alert(`Error al guardar la reserva: ${error.message || "Intenta nuevamente"}`);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!formData.apellido || !formData.nombre || !formData.telefono) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!reservationData) return;

    try {
      // ---------------------------------------------------------
      // CORRECCIÓN: Construir un Objeto Único (ConfirmarReservaRequest)
      // ---------------------------------------------------------
      
      const payload = {
        // Convertimos el array de strings ["2"] a array de números [2]
        // Y lo asignamos al campo 'habitacionIds' que espera Java
        habitacionIds: reservationData.rooms.map((r) => Number(r)), 
        
        fechaDesde: reservationData.startDate,
        fechaHasta: reservationData.endDate,
        nombre: formData.nombre.toUpperCase(),
        apellido: formData.apellido.toUpperCase(),
        telefono: formData.telefono
      };

      console.log("🚀 PAYLOAD CORREGIDO:", JSON.stringify(payload, null, 2));

      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const url = `${base}/api/reservas/confirmar`; 

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Enviamos el objeto payload, NO una lista
      });

      if (!response.ok) {
        if (!response.ok) {
        // 1. Leemos la respuesta UNA SOLA VEZ como texto plano
        const errorText = await response.text();
        
        let errorMessage = `Error: ${response.status}`;

        try {
          // 2. Intentamos ver si ese texto es un JSON válido
          const errorJson = JSON.parse(errorText);
          // Si es JSON, buscamos la propiedad message o error
          if (errorJson.message) errorMessage = errorJson.message;
          else if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {
          // 3. Si falla el parseo (es decir, el backend devolvió HTML o texto plano)
          // Usamos el texto original si no está vacío
          if (errorText) errorMessage = errorText;
        }

        throw new Error(errorMessage);
      }
      }

      setShowSuccess(true);
      sessionStorage.removeItem("reservationData");
      
      setTimeout(() => router.push("/"), 2000);

    } catch (error: any) {
      console.error("Error al confirmar reserva:", error);
      alert(`Error al guardar la reserva: ${error.message || "Intenta nuevamente"}`);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("reservationData");
    router.push("/");
  };

  if (!reservationData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles["form-wrapper"]}>
      {showSuccess && (
        <div className={styles["success-popup"]}>
          ¡Reserva realizada exitosamente!
        </div>
      )}

      {/* HEADER */}
      <div className={styles["form-header"]}>
        <Button className={styles["btn-back"]} onClick={handleCancel}>
          Volver
        </Button>
      </div>

      {/* FORM */}
      <div className={styles["form-container"]}>
        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="apellido" className={styles["form-label"]}>
              Reserva a nombre de:
            </label>

            <div className={styles["form-inputs"]}>
              {/* Apellido */}
              <div className={styles["input-field"]}>
                <label htmlFor="apellido" className={styles["field-label"]}>
                  Apellido <span className={styles["required"]}>(*)</span>
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  placeholder="INGRESE UN APELLIDO..."
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                />
              </div>

              {/* Nombre */}
              <div className={styles["input-field"]}>
                <label htmlFor="nombre" className={styles["field-label"]}>
                  Nombre <span className={styles["required"]}>(*)</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="INGRESE UN NOMBRE..."
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                />
              </div>

              {/* Teléfono */}
              <div className={styles["input-field"]}>
                <label htmlFor="telefono" className={styles["field-label"]}>
                  Teléfono <span className={styles["required"]}>(*)</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="INGRESE UN TELÉFONO..."
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                />
              </div>
            </div>
          </div>

          {/* ACEPTAR */}
          <div className={styles["button-container"]}>       
            <Button type="submit" className={styles["btn-accept"]}>
              Aceptar
            </Button>
          </div>
          
        </form>
      </div>

      {/* CANCELAR */}
      <button className={styles["btn-cancel"]} onClick={handleCancel}>
        Cancelar
      </button>
    </div>
  );
}