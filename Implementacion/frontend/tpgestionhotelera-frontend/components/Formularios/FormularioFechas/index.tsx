"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./estado.module.css"
import Button from "@/components/Button"

interface FormularioFechasProps {
  mode: "reservar" | "ocupar"
}

export default function FormularioFechas({ mode }: FormularioFechasProps) {
  const router = useRouter()

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })

  const handleDateRangeSubmit = () => {
    const { startDate, endDate } = dateRange

    if (!startDate || !endDate) {
      alert("Debe seleccionar ambas fechas")
      return
    }

    // Validación simple
    if (endDate < startDate) {
      alert("La fecha 'hasta' no puede ser anterior a 'desde'")
      return
    }

    // Construimos el query string
    const query = `?desde=${startDate}&hasta=${endDate}`

    // Redirección según modo
    if (mode === "reservar") {
      router.push(`/estado-habitaciones2/grilla${query}`)
    } else {
      router.push(`/ocupar-habitacion/grilla${query}`)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h3 className={styles.subtitle}>Seleccione un rango de fechas:</h3>

        <div className={styles.row}>
          <label className={styles.label}>
            Desde <span className="rojo">*</span>
          </label>

          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
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
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.buttonContainer}>
          <Button onClick={handleDateRangeSubmit}>Cargar Datos</Button>
        </div>
      </div>
    </main>
  )
}
