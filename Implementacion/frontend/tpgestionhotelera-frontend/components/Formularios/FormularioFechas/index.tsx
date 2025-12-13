"use client"

import { useState } from "react"
// Ya no necesitamos useRouter, la navegación la maneja el Padre
import styles from "./estado.module.css"
import Button from "@/components/Button"
// Importamos la validación que creamos antes
//import { isValidDateRange } from "@/utils/validations" 

interface FormularioFechasProps {
  // Función que llama el padre cuando todo está OK
  onNext: (fechas: { startDate: string; endDate: string }) => void;
  // Función para cancelar y volver al menú
  onCancel: () => void;
}

export default function FormularioFechas({ onNext, onCancel }: FormularioFechasProps) {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  
  const [error, setError] = useState("");

  const handleDateRangeSubmit = () => {
    const { startDate, endDate } = dateRange

    // 1. Validar campos vacíos
    if (!startDate || !endDate) {
      setError("Debe seleccionar ambas fechas.");
      return;
    }

    // 2. Validar rango lógico usando tu utilidad
    // if (!isValidDateRange(startDate, endDate)) {
    //   setError("La fecha de egreso debe ser posterior a la de ingreso.");
    //   return;
    // }

    // Si pasa las validaciones, limpiamos errores y avisamos al Padre
    setError("");
    
    // Aquí pasamos los datos hacia ARRIBA (al Manager)
    onNext({ startDate, endDate });
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h3 className={styles.subtitle}>Seleccione un rango de fechas:</h3>

        {/* Mensaje de error visual (Mejor que un alert) */}
        {error && <p className={styles.errorText} style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

        <div className={styles.row}>
          <label className={styles.label}>
            Desde <span className="rojo">*</span>
          </label>

          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => {
              setError(""); // Limpiamos error al escribir
              setDateRange({ ...dateRange, startDate: e.target.value })
            }}
            className={styles.input}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>
            Hasta <span className="rojo">*</span>
          </label>

          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => {
              setError(""); 
              setDateRange({ ...dateRange, endDate: e.target.value })
            }}
            className={styles.input}
          />
        </div>

        <div className={styles.buttonContainer} style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
          {/* Botón Volver/Cancelar */}
          <Button onClick={onCancel} className={styles.btnBack}>
             Cancelar
          </Button>

          {/* Botón Siguiente */}
          <Button onClick={handleDateRangeSubmit}>
             Siguiente
          </Button>
        </div>
      </div>
    </main>
  )
}