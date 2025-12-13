"use client";

import { useState } from "react";
import styles from "./formulario.module.css";
import Button from "@/components/Button";
import Toast from "@/components/Toast"; 


// Estructura de datos que viene del Padre (ReservarManager)
interface WizardData {
  startDate: string;
  endDate: string;
  rooms: string[]; // IDs
}

interface Props {
  data: WizardData; // Recibe los datos acumulados
  onBack: () => void;
  onSuccess: () => void; // Avisa al padre que terminó

}

export default function FormularioEncargado({ data, onBack, onSuccess }: Props) {
  // Estado local del formulario
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 1. NUEVO ESTADO PARA EL TOAST
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Limpiamos error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.apellido || !formData.nombre || !formData.telefono) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    
    setLoading(true);

    try {
      // Construcción del Payload
      const payload = {
        habitacionIds: data.rooms.map((r) => Number(r)), 
        fechaDesde: data.startDate,
        fechaHasta: data.endDate,
        nombre: formData.nombre.toUpperCase(),
        apellido: formData.apellido.toUpperCase(),
        telefono: formData.telefono
      };

      console.log("🚀 Enviando Reserva:", payload);

      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const url = `${base}/api/reservas/confirmar`; 

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        let msg = `Error ${response.status}`;
        try { msg = JSON.parse(text).message || msg } catch {}
        throw new Error(msg);
      }

      // 2. LÓGICA DE ÉXITO CON TOAST
      setShowToast(true); // Mostramos el cartelito verde

      // Esperamos 2 segundos para que el usuario lo vea antes de salir
      setTimeout(() => {
         onSuccess(); 
      }, 2000);

    } catch (err: any) {
      console.error("Error al confirmar reserva:", err);
      setError(err.message || "Ocurrió un error al procesar la reserva.");
      setLoading(false); // Solo quitamos loading si falla. Si es éxito, dejamos loading visualmente.
    } 
    // Nota: Quite el 'finally' para que el loading siga activo durante los 2 seg del Toast
    // y el usuario no toque nada más.
  };

  return (
    <div className={styles["form-wrapper"]}>
      {/* 3. AGREGAMOS EL COMPONENTE TOAST AQUÍ */}
      <Toast 
        message="¡Reserva realizada exitosamente!" 
        isVisible={showToast} 
      />

      <div className={styles["form-header"]}>
        <Button className={styles["btn-back"]} onClick={onBack}>
          Volver
        </Button>
        <h2 className={styles["form-title"]}>Datos del Responsable</h2>
      </div>

      <div className={styles["form-container"]}>
        {/* Mensaje de error visual */}
        {error && <div className={styles["error-banner"]} style={{color: 'red', marginBottom: '15px'}}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
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
                  placeholder="Ej: PEREZ"
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
                  placeholder="Ej: JUAN"
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
                  placeholder="Ej: 3492..."
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={styles["form-input"]}
                />
              </div>
            </div>
          </div>

          <div className={styles["button-container"]}>       
            <Button type="submit" className={styles["btn-accept"]} disabled={loading || showToast}>
              {loading ? "Procesando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </div>

      <button className={styles["btn-cancel"]} onClick={onBack}>
        Cancelar
      </button>
    </div>
  );
}